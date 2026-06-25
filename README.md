# Smart Form Fill (Chrome Extension)

This extension lets you save personal form data one time, then fill matching fields on websites.

It supports:

- Saving key/value fields once (for example: `full_name`, `email`, `phone`, `address`)
- Persistent storage using Chrome local storage
- Deleting fields one-by-one
- Auto-fill when you click an on-page element that contains the text **Export**
- Manual fill from the extension popup with **Fill This Page**

## Files

- `manifest.json`: Extension manifest (MV3)
- `options.html`, `options.js`, `options.css`: Manage saved information
- `popup.html`, `popup.js`, `popup.css`: Quick actions popup
- `content.js`: Website integration and autofill logic

## Load Extension In Chrome

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select this project folder (`form-fill`)

## How To Use

1. Click the extension icon and open **Manage Information**
2. Add your fields and values once
3. Visit any website form
4. Either:
    - Click a page button/link that says **Export** to auto-fill, or
    - Click extension popup -> **Fill This Page**

## Notes

- Field names are normalized to lowercase with underscores.
- Matching works using form element names, IDs, placeholders, labels, and autocomplete hints.
- Some custom websites may use unusual components where direct browser autofill is limited.
