/* global chrome */
(function () {
    chrome.tabs.query({'active': true}, function(tabs) {
        //chrome.tabs.update(tabs[0].id, {url: newUrl});
        console.log("chrome.tabs.query({active:true})", tabs, this);
    });

    // Doesn't work in Chrome??
    //console.log("chrome.runtime.getBrowserInfo", chrome.runtime.getBrowserInfo());

    const views = chrome.extension.getViews();

    let incidentCount = 0;

    function logURL(requestDetails) {
        console.log("Loading: " + requestDetails.url, requestDetails, views);

        incidentCount += 1;

        if (incidentCount % 2 === 0) {
            chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
        } else {
            chrome.browserAction.setBadgeBackgroundColor({ color: "#00ff00" });
        }

        chrome.browserAction.setBadgeText({ text: String(incidentCount) });

        const port = chrome.runtime.connect();
        port.postMessage({ type: "LOADING", payload: requestDetails });

        return {
            cancel: true, // Can only be set when not providing anything else in Chrome
            //redirectUrl: requestDetails.url,
            //redirectUrl: "https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif",
            //requestHeaders: requestDetails.requestHeaders,
        };
    }

    chrome.webRequest.onBeforeRequest.addListener(
        logURL,
        {urls: ["<all_urls>"], types: ["image"] },
        ["blocking", "requestBody"], //, "requestHeaders"]
    );

    /*
      Log the storage area that changed,
      then for each item changed,
      log its old value and its new value.
    */
    function logStorageChange(changes, area) {
        console.log("Change in storage area: " + area, changes);

        const changedItems = Object.keys(changes);

        for (const item of changedItems) {
            console.log(item + " has changed:");
            console.log("Old value: ");
            console.log(changes[item].oldValue);
            console.log("New value: ");
            console.log(changes[item].newValue);
        }
    }

    chrome.storage.onChanged.addListener(logStorageChange);

}());
