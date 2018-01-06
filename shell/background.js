/* global browser */
/* global chrome */
(function () {

    const views = chrome.extension.getViews();

    let incidentCount = 0;

    function logURL(requestDetails) {
        console.log("Loading: " + requestDetails.url, views);

        incidentCount += 1;

        if (incidentCount % 2 === 0) {
            chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
        } else {
            chrome.browserAction.setBadgeBackgroundColor({ color: "#00ff00" });
        }

        chrome.browserAction.setBadgeText({ text: String(incidentCount) });

        const port = chrome.runtime.connect();
        port.postMessage({ type: "LOADING", payload: requestDetails });
    }

    chrome.webRequest.onBeforeRequest.addListener(
        logURL,
        {urls: ["<all_urls>"]}
    );

}());
