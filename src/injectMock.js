// Content script

function injectScript() {
    scriptElem = document.createElement('script');
    scriptElem.src = 'http://pasopia7.sakura.ne.jp/mockDate/mockDate.js'
    document.head.appendChild(scriptElem);
}

function receiveSetting(request, sender, sendResponse) {
    window.postMessage(request, '*')
}

injectScript();
chrome.runtime.onMessage.addListener(receiveSetting);
    
