const DEFAULT_IMAGE = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <rect width="96" height="96" fill="#111827"/>
  <path d="M18 24h60v48H18z" fill="#f8fafc"/>
  <path d="M26 34h44v6H26zm0 12h32v6H26zm0 12h40v6H26z" fill="#111827"/>
</svg>
`)}`;

const payloadKey = new URLSearchParams(window.location.search).get("payloadKey");
const elements = {
  image: document.querySelector("#labelImage"),
  lotNumber: document.querySelector("#lotNumber"),
  price: document.querySelector("#price"),
  productName: document.querySelector("#productName"),
  winner: document.querySelector("#winner"),
  status: document.querySelector("#screenStatus")
};

let finished = false;

init();

async function init() {
  try {
    if (!payloadKey) {
      throw new Error("Missing print payload.");
    }

    const payload = await loadPayload(payloadKey);

    if (!payload) {
      throw new Error("Print payload expired.");
    }

    renderLabel(payload);
    await waitForImage(elements.image);
    await waitForPaint();
    elements.status.textContent = "Printing label...";

    window.setTimeout(() => {
      window.focus();
      window.print();
    }, Number(payload.settings?.printDelayMs) || 300);

    window.setTimeout(() => {
      finish();
    }, Number(payload.settings?.autoCloseAfterMs) || 30000);
  } catch (error) {
    elements.status.textContent = error.message;
  }
}

function renderLabel(payload) {
  const sale = payload.sale || {};
  const settings = payload.settings || {};
  elements.image.src = settings.labelImageDataUrl || DEFAULT_IMAGE;
  elements.image.style.objectFit = settings.labelImageFit || "contain";
  elements.lotNumber.textContent = sale.lotNumber ? `Lot ${sale.lotNumber}` : "Lot --";
  elements.price.textContent = sale.price || "$--";
  elements.productName.textContent = sale.productName || "Unknown item";
  elements.winner.textContent = sale.username ? `@${sale.username}` : "@unknown";
}

window.addEventListener("afterprint", finish);

function finish() {
  if (finished) {
    return;
  }

  finished = true;
  chrome.runtime.sendMessage({
    type: "SALE_LABELER_CLOSE_PRINT_WINDOW",
    payloadKey
  });
}

function loadPayload(key) {
  return new Promise((resolve) => {
    chrome.storage.local.get([key], (stored) => {
      resolve(stored[key]);
    });
  });
}

function waitForImage(image) {
  if (!image || image.complete) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    image.addEventListener("load", resolve, { once: true });
    image.addEventListener("error", resolve, { once: true });
  });
}

function waitForPaint() {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });
}

