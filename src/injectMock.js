// Content script

function injectScript() {
    var script = document.getElementById('mo-ckda-te')
    if (!script) {
        scriptElem = document.createElement('script');
        scriptElem.src = chrome.extension.getURL("mockDate.js");
        scriptElem.id = 'mo-ckda-te';
        document.head.appendChild(scriptElem);
    }
}

function receiveSetting(request, sender, sendResponse) {
    window.postMessage(request, '*')
}

injectScript();
chrome.runtime.onMessage.addListener(receiveSetting);
    
