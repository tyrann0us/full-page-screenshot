# Full Page Screenshot

Chrome extension to capture a screenshot of the full height of the current website, even if the
content extends below the fold.

## Features

- **Full Page Capture:** Captures the entire webpage without the need to scroll.
- **Automatic File Naming:** Saves the screenshot as a PNG file with the format:
  `screenshot-{current URL}-{YYYY-MM-DD}.png`.
- **Easy to Use:** Simply click the extension icon to capture.

## Installation

### 1. Download the Extension

- Download the source code from
  the [latest release](https://github.com/tyrann0us/full-page-screenshot/releases/latest).
- Extract the archive.

### 2. Enable Developer Mode

- Open Chrome and navigate to `chrome://extensions/`.
- Toggle the **Developer mode** switch in the top right corner.

### 3. Load the Extension

- Click on **Load unpacked**.
- Select the folder where you extracted the extension.

### 4. Using the Extension

- Navigate to any webpage.
- Click on the **Full Page Screenshot** extension icon in the toolbar.
- The screenshot will be captured and downloaded automatically to your default download folder.

_For more detailed instructions, refer
to [Chrome's official documentation](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world#load-unpacked)._

## Permissions

The extension requires the following permissions:

- `activeTab`: Access to the currently active tab.
- `tabs`: Interaction with browser tabs.
- `debugger`: Use of the debugging protocol for capturing screenshots.
- `downloads`: Ability to save files to your computer.

## Contributing

Contributions are welcome! Please create

## Disclaimer

- **Security Notifications:** When using the `debugger` API, Chrome may display a notification
  indicating that a debugger is attached. This is expected behavior.
- **Privacy:** The extension does not collect or transmit any personal data.

## Contact and Contributing

For questions or suggestions, please open an issue
on [GitHub](https://github.com/tyrann0us/full-page-screenshot/issues).
Contributions are welcome! If you want to improve the extension, please create a PR.

## License

This project is licensed under the [MIT License](LICENSE).
