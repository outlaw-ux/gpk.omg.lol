# Whatnot Sale Labeler

Chrome extension prototype for printing 2 x 1 in sale labels from completed Whatnot auction activity.

The extension watches Whatnot pages, detects completed sale text in the visible interface, extracts the item name, lot number, final price, and winning username, then opens a small print page formatted for a 2 x 1 in label.

## Install Locally

1. Open `chrome://extensions`.
2. Enable Developer mode.
3. Choose Load unpacked.
4. Select this folder: `plugins/whatnot-sale-labeler`.
5. Open the extension options, upload the label image, and run a test print.

## Silent Printing

Chrome extensions cannot generally bypass the print dialog on their own. For unattended printing, launch Chrome with kiosk printing enabled.

macOS example:

```bash
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --kiosk --kiosk-printing "https://www.whatnot.com/"
```

Windows example:

```text
"C:\Program Files\Google\Chrome\Application\chrome.exe" --kiosk --kiosk-printing "https://www.whatnot.com/"
```

Without `--kiosk-printing`, Chrome will still show print preview when the extension creates a label.

## Label Setup

- Label size: 2 x 1 in.
- Recommended printer driver paper size: 2 x 1 in or 50.8 x 25.4 mm.
- Margins: none.
- Scaling: 100 percent.

The print page uses CSS `@page` sizing, but the printer driver still needs a matching label stock size.

## Whatnot Detection

Whatnot does not provide a stable public browser DOM contract for live seller tooling. This extension uses configurable heuristics:

- completed sale text pattern
- ignored sale text pattern
- sale container selector
- product selector
- lot selector
- price selector
- username selector

Use Debug mode in the options page during a live test. If Whatnot changes the seller UI, update the advanced selectors instead of editing extension code.

## Package For Download

From the `plugins` directory:

```bash
zip -r whatnot-sale-labeler.zip whatnot-sale-labeler -x "*.DS_Store"
```

Host the zip from the website when the extension is ready for other sellers. Chrome Web Store distribution will require the normal extension review flow.

