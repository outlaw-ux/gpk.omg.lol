(() => {
  const DEFAULT_SETTINGS = {
    enabled: true,
    autoPrint: true,
    debugMode: false,
    minConfidence: 3,
    completedTextPattern: "\\b(sold|winner|won by|sold to|auction ended|final sale)\\b",
    ignoredTextPattern: "\\b(unsold|not sold|no sale|passed)\\b",
    containerSelector: [
      "[data-testid*=\"sale\" i]",
      "[data-testid*=\"sold\" i]",
      "[data-testid*=\"order\" i]",
      "[data-testid*=\"auction\" i]",
      "[class*=\"sale\" i]",
      "[class*=\"sold\" i]",
      "[class*=\"order\" i]",
      "[class*=\"auction\" i]",
      "[role=\"listitem\"]",
      "article",
      "li"
    ].join(", "),
    productSelector: [
      "[data-testid*=\"product\" i]",
      "[data-testid*=\"title\" i]",
      "[data-testid*=\"item\" i]",
      "[class*=\"product\" i]",
      "[class*=\"title\" i]",
      "[class*=\"item\" i]"
    ].join(", "),
    lotSelector: "[data-testid*=\"lot\" i], [class*=\"lot\" i]",
    priceSelector: [
      "[data-testid*=\"price\" i]",
      "[data-testid*=\"amount\" i]",
      "[class*=\"price\" i]",
      "[class*=\"amount\" i]"
    ].join(", "),
    usernameSelector: [
      "[data-testid*=\"winner\" i]",
      "[data-testid*=\"buyer\" i]",
      "[data-testid*=\"username\" i]",
      "[class*=\"winner\" i]",
      "[class*=\"buyer\" i]",
      "[class*=\"username\" i]"
    ].join(", ")
  };

  const SETTINGS_KEY = "settings";
  const MAX_CANDIDATES = 250;
  const MAX_TEXT_LENGTH = 1800;
  const seenFingerprints = new Set();

  let settings = { ...DEFAULT_SETTINGS };
  let observer;
  let scanTimer = 0;
  let debugBadge;

  init();

  async function init() {
    settings = await loadSettings();
    updateDebugBadge("ready");

    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== "local" || !changes[SETTINGS_KEY]) {
        return;
      }

      settings = {
        ...DEFAULT_SETTINGS,
        ...(changes[SETTINGS_KEY].newValue || {})
      };
      updateDebugBadge("settings updated");
      scheduleScan();
    });

    startObserver();
    scheduleScan();
  }

  async function loadSettings() {
    const stored = await getLocal([SETTINGS_KEY]);
    return {
      ...DEFAULT_SETTINGS,
      ...(stored[SETTINGS_KEY] || {})
    };
  }

  function startObserver() {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver(() => {
      scheduleScan();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  function scheduleScan() {
    if (!settings.enabled) {
      updateDebugBadge("disabled");
      return;
    }

    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(scanForSales, 350);
  }

  function scanForSales() {
    if (!settings.enabled) {
      return;
    }

    const candidates = getCandidateElements();
    let detected = 0;

    for (const candidate of candidates) {
      const sale = parseSale(candidate);

      if (!sale) {
        continue;
      }

      if (seenFingerprints.has(sale.fingerprint)) {
        continue;
      }

      seenFingerprints.add(sale.fingerprint);
      detected += 1;
      notifySaleDetected(sale);
    }

    trimSeenFingerprints();
    updateDebugBadge(`scanned ${candidates.length}, sent ${detected}`);
  }

  function getCandidateElements() {
    const elements = safeQueryAll(document, settings.containerSelector || DEFAULT_SETTINGS.containerSelector);

    if (elements.length > 0) {
      return elements.slice(-MAX_CANDIDATES);
    }

    return [document.body].filter(Boolean);
  }

  function parseSale(element) {
    const rawText = element.innerText || element.textContent || "";
    const fullText = cleanText(rawText);

    if (!fullText || fullText.length > MAX_TEXT_LENGTH) {
      return null;
    }

    const completedPattern = toRegExp(settings.completedTextPattern, DEFAULT_SETTINGS.completedTextPattern);
    const ignoredPattern = toRegExp(settings.ignoredTextPattern, DEFAULT_SETTINGS.ignoredTextPattern);

    if (!completedPattern.test(fullText) || ignoredPattern.test(fullText)) {
      return null;
    }

    const productText = textFromSelector(element, settings.productSelector);
    const lotText = textFromSelector(element, settings.lotSelector);
    const priceText = textFromSelector(element, settings.priceSelector);
    const usernameText = textFromSelector(element, settings.usernameSelector);
    const price = normalizePrice(priceText) || extractPrice(fullText);
    const lotNumber = extractLotNumber(lotText) || extractLotNumber(fullText);
    const username = extractUsername(usernameText) || extractUsername(fullText);
    const productName = extractProductName(productText, rawText, completedPattern);
    const confidence = scoreSale({
      fullText,
      productName,
      lotNumber,
      price,
      username,
      completedPattern
    });

    if (confidence < Number(settings.minConfidence || DEFAULT_SETTINGS.minConfidence)) {
      return null;
    }

    const sale = {
      productName,
      lotNumber,
      price,
      username,
      sourceUrl: window.location.href,
      detectedAt: new Date().toISOString(),
      confidence
    };

    return {
      ...sale,
      fingerprint: createFingerprint(sale)
    };
  }

  function scoreSale(sale) {
    let score = 0;

    if (sale.completedPattern.test(sale.fullText)) {
      score += 2;
    }

    if (sale.price) {
      score += 1;
    }

    if (sale.username) {
      score += 1;
    }

    if (sale.productName && sale.productName !== "Unknown item") {
      score += 1;
    }

    if (sale.lotNumber) {
      score += 1;
    }

    return score;
  }

  function extractProductName(productText, fullText, completedPattern) {
    const directProduct = cleanProductText(productText, completedPattern);

    if (directProduct) {
      return directProduct;
    }

    const lines = String(fullText || "")
      .split(/[\n\r]+|(?:\s{2,})/)
      .map((line) => cleanProductText(line, completedPattern))
      .filter(Boolean);

    const inferred = lines.find((line) => {
      return !extractPrice(line) &&
        !extractUsername(line) &&
        !extractLotNumber(line) &&
        line.length <= 120;
    });

    return inferred || "Unknown item";
  }

  function cleanProductText(value, completedPattern) {
    const text = cleanText(value);

    if (!text || text.length > 140) {
      return "";
    }

    if (completedPattern.test(text) || extractPrice(text)) {
      return "";
    }

    if (/^(winner|won by|sold to|buyer|price|lot)\b/i.test(text)) {
      return "";
    }

    return text;
  }

  function extractPrice(value) {
    const match = String(value || "").match(/\$[\d,]+(?:\.\d{2})?/);
    return match ? match[0] : "";
  }

  function normalizePrice(value) {
    return extractPrice(value);
  }

  function extractLotNumber(value) {
    const text = cleanText(value);

    if (!text) {
      return "";
    }

    const labeled = text.match(/\blot\s*#?\s*:?\s*([a-z0-9_-]{1,16})\b/i);

    if (labeled) {
      return labeled[1];
    }

    const shortHash = text.match(/(?:^|\s)#([a-z0-9_-]{1,16})\b/i);
    return shortHash ? shortHash[1] : "";
  }

  function extractUsername(value) {
    const text = cleanText(value);

    if (!text) {
      return "";
    }

    const labeled = text.match(/\b(?:winner|won by|sold to|buyer)\s*:?\s*@?([a-z0-9_.-]{2,32})\b/i);

    if (labeled) {
      return cleanUsername(labeled[1]);
    }

    const handle = text.match(/@([a-z0-9_.-]{2,32})\b/i);
    return handle ? cleanUsername(handle[1]) : "";
  }

  function notifySaleDetected(sale) {
    chrome.runtime.sendMessage({
      type: "SALE_LABELER_SALE_DETECTED",
      sale
    }, (response) => {
      if (chrome.runtime.lastError) {
        updateDebugBadge("send failed");
        return;
      }

      if (response?.skipped) {
        updateDebugBadge(response.skipped);
        return;
      }

      updateDebugBadge(response?.ok ? "label opened" : "label failed");
    });
  }

  function textFromSelector(root, selector) {
    const element = safeQuery(root, selector);
    return cleanText(element?.innerText || element?.textContent);
  }

  function safeQuery(root, selector) {
    if (!selector) {
      return null;
    }

    try {
      return root.querySelector(selector);
    } catch (error) {
      console.warn("[Whatnot Sale Labeler] Invalid selector:", selector, error);
      return null;
    }
  }

  function safeQueryAll(root, selector) {
    if (!selector) {
      return [];
    }

    try {
      return Array.from(root.querySelectorAll(selector));
    } catch (error) {
      console.warn("[Whatnot Sale Labeler] Invalid selector:", selector, error);
      return [];
    }
  }

  function toRegExp(pattern, fallbackPattern) {
    try {
      return new RegExp(pattern, "i");
    } catch (error) {
      console.warn("[Whatnot Sale Labeler] Invalid pattern:", pattern, error);
      return new RegExp(fallbackPattern, "i");
    }
  }

  function createFingerprint(sale) {
    return [
      sale.productName,
      sale.lotNumber,
      sale.price,
      sale.username
    ]
      .map((part) => String(part || "").trim().toLowerCase())
      .join("|");
  }

  function cleanText(value) {
    return String(value || "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function cleanUsername(value) {
    return cleanText(value)
      .replace(/^@+/, "")
      .replace(/[^\w.-]/g, "");
  }

  function trimSeenFingerprints() {
    if (seenFingerprints.size <= 200) {
      return;
    }

    const entries = Array.from(seenFingerprints).slice(-100);
    seenFingerprints.clear();
    entries.forEach((entry) => seenFingerprints.add(entry));
  }

  function updateDebugBadge(message) {
    if (!settings.debugMode) {
      if (debugBadge) {
        debugBadge.remove();
        debugBadge = null;
      }

      return;
    }

    if (!debugBadge) {
      debugBadge = document.createElement("div");
      debugBadge.style.position = "fixed";
      debugBadge.style.right = "12px";
      debugBadge.style.bottom = "12px";
      debugBadge.style.zIndex = "2147483647";
      debugBadge.style.padding = "8px 10px";
      debugBadge.style.border = "1px solid rgba(255,255,255,.25)";
      debugBadge.style.borderRadius = "8px";
      debugBadge.style.background = "rgba(21, 24, 38, .92)";
      debugBadge.style.color = "#f8f8ff";
      debugBadge.style.font = "12px/1.3 Arial, sans-serif";
      debugBadge.style.boxShadow = "0 8px 28px rgba(0,0,0,.3)";
      debugBadge.style.pointerEvents = "none";
      document.documentElement.append(debugBadge);
    }

    debugBadge.textContent = `Sale Labeler: ${message}`;
  }

  function getLocal(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, resolve);
    });
  }
})();
