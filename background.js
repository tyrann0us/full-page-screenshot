chrome.action.onClicked.addListener((tab) => {
  const tabId = tab.id;
  const debuggeeId = { tabId: tabId };

  // Helper function to send debugger commands as promises
  function sendCommand(method, params = {}) {
    return new Promise((resolve, reject) => {
      chrome.debugger.sendCommand(debuggeeId, method, params, (result) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  // Main async function
  async function captureScreenshot() {
    try {
      // Attach debugger
      await new Promise((resolve, reject) => {
        chrome.debugger.attach(debuggeeId, "1.3", () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve();
          }
        });
      });

      // Enable necessary domains
      await sendCommand("Page.enable");
      await sendCommand("Runtime.enable");

      // Get the page height
      const result = await sendCommand("Runtime.evaluate", {
        expression: `Math.max(
          document.body.scrollHeight,
          document.documentElement.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.offsetHeight,
          document.body.clientHeight,
          document.documentElement.clientHeight
        )`,
        returnByValue: true,
      });
      const fullHeight = result.result.value;

      // Get the window dimensions
      const windowInfo = await new Promise((resolve) => {
        chrome.windows.get(tab.windowId, { populate: false }, (window) => {
          resolve(window);
        });
      });
      const windowWidth = windowInfo.width;

      // Get the device pixel ratio
      const deviceMetrics = await sendCommand("Runtime.evaluate", {
        expression: "window.devicePixelRatio",
        returnByValue: true
      });
      const deviceScaleFactor = deviceMetrics.result.value;

      // Set the viewport to capture the full page
      await sendCommand("Emulation.setDeviceMetricsOverride", {
        width: windowWidth,
        height: fullHeight,
        deviceScaleFactor: deviceScaleFactor,
        mobile: false,
        screenWidth: windowWidth,
        screenHeight: fullHeight,
      });

      // Allow time for viewport to update
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Capture the screenshot
      const screenshot = await sendCommand("Page.captureScreenshot", {
        format: 'png',
        fromSurface: true,
      });
      const imageData = screenshot.data;
      const url = 'data:image/png;base64,' + imageData;

      // Create the filename
      const currentDate = new Date();
      const dateString = currentDate.toISOString().slice(0, 10); // YYYY-MM-DD
      const pageUrl = new URL(tab.url);
      const sanitizedUrl = pageUrl.hostname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      const filename = `screenshot-${sanitizedUrl}-${dateString}.png`;

      // Download the screenshot
      await new Promise((resolve, reject) => {
        chrome.downloads.download({
          url: url,
          filename: filename
        }, (downloadId) => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            resolve(downloadId);
          }
        });
      });

      // Reset the viewport metrics
      await sendCommand("Emulation.clearDeviceMetricsOverride");

    } catch (error) {
      console.error("Error: ", error.message);
    } finally {
      // Detach the debugger
      chrome.debugger.detach(debuggeeId, () => {
        if (chrome.runtime.lastError) {
          console.error("Failed to detach debugger: ", chrome.runtime.lastError.message);
        }
      });
    }
  }

  // Start the screenshot capture
  captureScreenshot();
});
