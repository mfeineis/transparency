/* global chrome */
(function () {
    chrome.tabs.query({'active': true}, function(tabs) {
        //chrome.tabs.update(tabs[0].id, {url: newUrl});
        console.log("chrome.tabs.query({active:true})", tabs, this);
    });

    // Doesn't work in Chrome??
    //console.log("chrome.runtime.getBrowserInfo", chrome.runtime.getBrowserInfo());

    //const views = chrome.extension.getViews();

    function onBeforeSendHeaders(requestDetails) {
        console.log("(onBeforeSendHeaders)", requestDetails.url, requestDetails);
        for (let header of requestDetails.requestHeaders) {
            console.log("  ->", header);
        }

        const port = chrome.runtime.connect();
        port.postMessage({ type: "LOADING", payload: requestDetails });

        return {requestHeaders: requestDetails.requestHeaders};
    }

    let incidentCount = 0;

    function onBeforeRequest(requestDetails) {
        console.log("(onBeforeRequest)", requestDetails.url, requestDetails);
        //for (let bodyProp of requestDetails.requestBody) {
        //    console.log("  ->", bodyProp);
        //}

        incidentCount += 1;

        if (incidentCount % 2 === 0) {
            chrome.browserAction.setBadgeBackgroundColor({ color: "#ff0000" });
        } else {
            chrome.browserAction.setBadgeBackgroundColor({ color: "#ff6600" });
        }

        chrome.browserAction.setBadgeText({ text: String(incidentCount) });

        console.log("  -> sending message through port");
        const port = chrome.runtime.connect();
        port.postMessage({ type: "LOADING", payload: requestDetails });
        console.log("  -> done");

        return { redirectUrl: requestDetails.url };
        //return {
        //    cancel: true, // Can only be set when not providing anything else in Chrome
        //    //redirectUrl: requestDetails.url,
        //    //redirectUrl: "https://38.media.tumblr.com/tumblr_ldbj01lZiP1qe0eclo1_500.gif",
        //    //requestHeaders: requestDetails.requestHeaders,
        //};
    }

    //[main_frame, sub_frame, stylesheet, script, image, font, object, xmlhttprequest, ping, csp_report, media, websocket, other]
    const types = [
        //"beacon",
        "csp_report",
        "font",
        "image",
        //"imageset",
        "main_frame",
        "media",
        "object",
        //"object_subrequest",
        "other",
        "ping",
        "script",
        "stylesheet",
        "sub_frame",
        //"web_manifest",
        "websocket",
        "xmlhttprequest",
    ];

    chrome.webRequest.onBeforeRequest.addListener(
        onBeforeRequest,
        {urls: ["<all_urls>"], types },
        ["blocking", "requestBody"], //, "requestHeaders"]
    );

    //chrome.webRequest.onBeforeSendHeaders.addListener(
    //    onBeforeSendHeaders,
    //    {urls: ["<all_urls>"], types },
    //    ["blocking", "requestHeaders"],
    //);

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
