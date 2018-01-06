/* global chrome */
/* global Elm */
(function () {

    const bg = chrome.extension.getBackgroundPage();

    const app = Elm.Main.fullscreen();

    chrome.runtime.onConnect.addListener(function (port) {
        console.log('[POPUP] chrome.runtime.onConnect', port.name, port, this);

        port.onMessage.addListener(function (msg) {
            console.log("[POPUP] .. port.onMessage", msg);
        });
    });

}());
