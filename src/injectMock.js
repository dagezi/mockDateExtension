// Content script

function injectScript() {
    scriptElem = document.createElement('script');
    scriptElem.src = chrome.extension.getURL("mockDate.js");
    document.head.appendChild(scriptElem);
}

function receiveSetting(request, sender, sendResponse) {
    window.postMessage(request, '*')
}

injectScript();
chrome.runtime.onMessage.addListener(receiveSetting);

// Tell background page that new content loaded.
chrome.runtime.sendMessage({pageLoaded: true});
