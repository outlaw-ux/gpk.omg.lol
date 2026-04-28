const FALLBACK_DEFAULTS = {
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

const SETTINGS_KEY = "settings";
const MAX_IMAGE_BYTES = 1500000;

const fields = {
  enabled: document.querySelector("#enabled"),
  autoPrint: document.querySelector("#autoPrint"),
  debugMode: document.querySelector("#debugMode"),
  dedupeMinutes: document.querySelector("#dedupeMinutes"),
  labelImage: document.querySelector("#labelImage"),
  labelImageFit: document.querySelector("#labelImageFit"),
  imagePreview: document.querySelector("#imagePreview"),
  imagePlaceholder: document.querySelector("#imagePlaceholder"),
  clearImage: document.querySelector("#clearImage"),
  minConfidence: document.querySelector("#minConfidence"),
  completedTextPattern: document.querySelector("#completedTextPattern"),
  ignoredTextPattern: document.querySelector("#ignoredTextPattern"),
  containerSelector: document.querySelector("#containerSelector"),
  productSelector: document.querySelector("#productSelector"),
  lotSelector: document.querySelector("#lotSelector"),
  priceSelector: document.querySelector("#priceSelector"),
  usernameSelector: document.querySelector("#usernameSelector"),
  saveButton: document.querySelector("#saveButton"),
  testPrintButton: document.querySelector("#testPrintButton"),
  status: document.querySelector("#status")
};

let defaults = FALLBACK_DEFAULTS;
let currentSettings = { ...FALLBACK_DEFAULTS };

init();

async function init() {
  defaults = await loadDefaults();
  currentSettings = await loadSettings();
  renderSettings(currentSettings);

  fields.labelImage.addEventListener("change", handleImageChange);
  fields.clearImage.addEventListener("click", () => {
    currentSettings.labelImageDataUrl = "";
    fields.labelImage.value = "";
    renderImagePreview();
  });
  fields.saveButton.addEventListener("click", saveSettings);
  fields.testPrintButton.addEventListener("click", testPrint);
}

async function loadDefaults() {
  try {
    const response = await sendMessage({ type: "SALE_LABELER_GET_DEFAULT_SETTINGS" });
    return response?.defaults ? response.defaults : FALLBACK_DEFAULTS;
  } catch (error) {
    return FALLBACK_DEFAULTS;
  }
}

async function loadSettings() {
  const stored = await getLocal([SETTINGS_KEY]);
  return {
    ...defaults,
    ...(stored[SETTINGS_KEY] || {})
  };
}

function renderSettings(settings) {
  fields.enabled.checked = Boolean(settings.enabled);
  fields.autoPrint.checked = Boolean(settings.autoPrint);
  fields.debugMode.checked = Boolean(settings.debugMode);
  fields.dedupeMinutes.value = settings.dedupeMinutes;
  fields.labelImageFit.value = settings.labelImageFit || defaults.labelImageFit;
  fields.minConfidence.value = settings.minConfidence;
  fields.completedTextPattern.value = settings.completedTextPattern;
  fields.ignoredTextPattern.value = settings.ignoredTextPattern;
  fields.containerSelector.value = settings.containerSelector;
  fields.productSelector.value = settings.productSelector;
  fields.lotSelector.value = settings.lotSelector;
  fields.priceSelector.value = settings.priceSelector;
  fields.usernameSelector.value = settings.usernameSelector;
  renderImagePreview();
}

function collectSettings() {
  return {
    ...currentSettings,
    enabled: fields.enabled.checked,
    autoPrint: fields.autoPrint.checked,
    debugMode: fields.debugMode.checked,
    dedupeMinutes: clampNumber(fields.dedupeMinutes.value, 1, 1440, defaults.dedupeMinutes),
    labelImageFit: fields.labelImageFit.value,
    minConfidence: clampNumber(fields.minConfidence.value, 1, 6, defaults.minConfidence),
    completedTextPattern: fields.completedTextPattern.value.trim() || defaults.completedTextPattern,
    ignoredTextPattern: fields.ignoredTextPattern.value.trim() || defaults.ignoredTextPattern,
    containerSelector: fields.containerSelector.value.trim() || defaults.containerSelector,
    productSelector: fields.productSelector.value.trim() || defaults.productSelector,
    lotSelector: fields.lotSelector.value.trim() || defaults.lotSelector,
    priceSelector: fields.priceSelector.value.trim() || defaults.priceSelector,
    usernameSelector: fields.usernameSelector.value.trim() || defaults.usernameSelector
  };
}

async function handleImageChange(event) {
  const file = event.target.files?.[0];

  if (!file) {
    return;
  }

  if (file.size > MAX_IMAGE_BYTES) {
    setStatus("Choose an image under 1.5 MB.", true);
    fields.labelImage.value = "";
    return;
  }

  currentSettings.labelImageDataUrl = await readFileAsDataUrl(file);
  renderImagePreview();
  setStatus("Image ready. Save settings to keep it.");
}

async function saveSettings() {
  try {
    validateRegex(fields.completedTextPattern.value);
    validateRegex(fields.ignoredTextPattern.value);
    currentSettings = collectSettings();
    await setLocal({ [SETTINGS_KEY]: currentSettings });
    setStatus("Settings saved.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

async function testPrint() {
  try {
    await saveSettings();
    const response = await sendMessage({ type: "SALE_LABELER_TEST_PRINT" });

    if (!response?.ok) {
      throw new Error(response?.error || "Unable to open test label.");
    }

    setStatus("Test label opened.");
  } catch (error) {
    setStatus(error.message, true);
  }
}

function renderImagePreview() {
  const previewBox = fields.imagePreview.closest(".preview-box");

  if (currentSettings.labelImageDataUrl) {
    fields.imagePreview.src = currentSettings.labelImageDataUrl;
    fields.imagePreview.style.objectFit = currentSettings.labelImageFit || "contain";
    previewBox.classList.add("has-image");
    return;
  }

  fields.imagePreview.removeAttribute("src");
  previewBox.classList.remove("has-image");
}

function setStatus(message, isError = false) {
  fields.status.textContent = message;
  fields.status.classList.toggle("error", Boolean(isError));
}

function validateRegex(pattern) {
  try {
    new RegExp(pattern, "i");
  } catch (error) {
    throw new Error(`Invalid text pattern: ${error.message}`);
  }
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return fallback;
  }

  return Math.min(Math.max(Math.round(number), min), max);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(reader.error));
    reader.readAsDataURL(file);
  });
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

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      const error = chrome.runtime.lastError;

      if (error) {
        reject(new Error(error.message));
        return;
      }

      resolve(response);
    });
  });
}

