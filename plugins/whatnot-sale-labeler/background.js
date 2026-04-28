const DEFAULT_SETTINGS = {
  enabled: true,
  autoPrint: true,
  debugMode: false,
  labelImageDataUrl: "",
  labelImageFit: "contain",
  minConfidence: 3,
  dedupeMinutes: 360,
  printDelayMs: 300,
  autoCloseAfterMs: 30000,
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

const RECENT_PRINTS_KEY = "recentSalePrints";
const SETTINGS_KEY = "settings";
const PRINT_PAYLOAD_PREFIX = "printPayload:";

chrome.runtime.onInstalled.addListener(async () => {
  const stored = await getLocal([SETTINGS_KEY]);

  if (!stored[SETTINGS_KEY]) {
    await setLocal({ [SETTINGS_KEY]: DEFAULT_SETTINGS });
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then((response) => sendResponse(response))
    .catch((error) => {
      console.error("[Whatnot Sale Labeler]", error);
      sendResponse({ ok: false, error: error.message });
    });

  return true;
});

async function handleMessage(message, sender) {
  if (!message || typeof message.type !== "string") {
    return { ok: false, error: "Unknown message." };
  }

  switch (message.type) {
    case "SALE_LABELER_GET_DEFAULT_SETTINGS":
      return { ok: true, defaults: DEFAULT_SETTINGS };

    case "SALE_LABELER_SALE_DETECTED":
      return handleDetectedSale(message.sale, sender);

    case "SALE_LABELER_TEST_PRINT":
      return openPrintWindow({
        productName: "Adam Bomb PSA 8",
        lotNumber: "42",
        price: "$24.00",
        username: "sample_buyer",
        detectedAt: new Date().toISOString(),
        sourceUrl: "extension-options",
        confidence: 99
      }, { isTest: true });

    case "SALE_LABELER_CLOSE_PRINT_WINDOW":
      await removePrintPayload(message.payloadKey);
      await closeSenderTab(sender);
      return { ok: true };

    default:
      return { ok: false, error: `Unhandled message type: ${message.type}` };
  }
}

async function handleDetectedSale(sale, sender) {
  const settings = await getSettings();

  if (!settings.enabled) {
    return { ok: true, skipped: "disabled" };
  }

  if (!settings.autoPrint) {
    return { ok: true, skipped: "auto-print-disabled" };
  }

  const normalizedSale = normalizeSale({
    ...sale,
    sourceUrl: sale?.sourceUrl || sender?.tab?.url || ""
  });

  if (!normalizedSale.productName && !normalizedSale.price && !normalizedSale.username) {
    return { ok: false, error: "Detected sale did not include printable fields." };
  }

  const fingerprint = normalizedSale.fingerprint || createFingerprint(normalizedSale);
  const duplicate = await rememberSaleFingerprint(fingerprint, settings.dedupeMinutes);

  if (duplicate) {
    return { ok: true, skipped: "duplicate", fingerprint };
  }

  return openPrintWindow(normalizedSale, { isTest: false });
}

async function openPrintWindow(sale, options) {
  const settings = await getSettings();
  const payloadKey = `${PRINT_PAYLOAD_PREFIX}${createId()}`;
  const payload = {
    sale: normalizeSale(sale),
    settings,
    isTest: Boolean(options?.isTest),
    createdAt: new Date().toISOString()
  };

  await setLocal({ [payloadKey]: payload });

  const url = chrome.runtime.getURL(`print.html?payloadKey=${encodeURIComponent(payloadKey)}`);
  const printWindow = await createChromeWindow({
    url,
    type: "popup",
    width: 440,
    height: 300,
    focused: false
  });

  return {
    ok: true,
    payloadKey,
    windowId: printWindow?.id,
    sale: payload.sale
  };
}

async function getSettings() {
  const stored = await getLocal([SETTINGS_KEY]);
  return {
    ...DEFAULT_SETTINGS,
    ...(stored[SETTINGS_KEY] || {})
  };
}

async function rememberSaleFingerprint(fingerprint, dedupeMinutes) {
  if (!fingerprint) {
    return false;
  }

  const ttlMs = Math.max(Number(dedupeMinutes) || DEFAULT_SETTINGS.dedupeMinutes, 1) * 60 * 1000;
  const now = Date.now();
  const stored = await getLocal([RECENT_PRINTS_KEY]);
  const recentPrints = Array.isArray(stored[RECENT_PRINTS_KEY])
    ? stored[RECENT_PRINTS_KEY]
    : [];
  const activePrints = recentPrints.filter((entry) => {
    return entry && entry.at && now - entry.at < ttlMs;
  });
  const duplicate = activePrints.some((entry) => entry.fingerprint === fingerprint);

  if (!duplicate) {
    activePrints.push({ fingerprint, at: now });
  }

  await setLocal({ [RECENT_PRINTS_KEY]: activePrints.slice(-100) });
  return duplicate;
}

function normalizeSale(sale) {
  return {
    productName: cleanText(sale?.productName) || "Unknown item",
    lotNumber: cleanText(sale?.lotNumber) || "",
    price: cleanText(sale?.price) || "",
    username: cleanUsername(sale?.username) || "",
    sourceUrl: cleanText(sale?.sourceUrl) || "",
    detectedAt: cleanText(sale?.detectedAt) || new Date().toISOString(),
    confidence: Number(sale?.confidence) || 0,
    fingerprint: cleanText(sale?.fingerprint) || ""
  };
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

function createId() {
  if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getLocal(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keys, resolve);
  });
}

function setLocal(items) {
  return new Promise((resolve) => {
    chrome.storage.local.set(items, resolve);
  });
}

function removeLocal(keys) {
  return new Promise((resolve) => {
    chrome.storage.local.remove(keys, resolve);
  });
}

function createChromeWindow(createData) {
  return new Promise((resolve, reject) => {
    chrome.windows.create(createData, (createdWindow) => {
      const error = chrome.runtime.lastError;

      if (error) {
        reject(new Error(error.message));
        return;
      }

      resolve(createdWindow);
    });
  });
}

async function removePrintPayload(payloadKey) {
  if (typeof payloadKey === "string" && payloadKey.startsWith(PRINT_PAYLOAD_PREFIX)) {
    await removeLocal(payloadKey);
  }
}

function closeSenderTab(sender) {
  return new Promise((resolve) => {
    const tabId = sender?.tab?.id;

    if (!tabId) {
      resolve();
      return;
    }

    chrome.tabs.remove(tabId, () => {
      resolve();
    });
  });
}

