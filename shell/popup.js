/* global chrome */
/* global Elm */
(function () {

    //const bg = chrome.extension.getBackgroundPage();

    const app = Elm.Main.fullscreen();

    const someValue = chrome.storage.local.get("some-key");
    //storage.local.clear
    //storage.local.get
    //storage.local.remove
    //storage.local.set
    //storage.sync

    chrome.runtime.onConnect.addListener(function (port) {
        console.log('[POPUP] (someValue ' + someValue + ') chrome.runtime.onConnect', port.name, port, this);

        port.onMessage.addListener(function (msg) {
            console.log("[POPUP] .. port.onMessage", msg);
        });
    });

}());
