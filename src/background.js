var tabSettingTable = {};

function newTabSetting(tab) {
    var tabSetting = {
        tab: tab, 
        tabId: tab.id, 
        startEpoch: Date.now(),
        multiplier: 1,
        isMocking: false
    };
    tabSettingTable[tab.id] = tabSetting;
    return tabSetting;
}

function getTabSetting(tab) {
    return tabSettingTable[tab.id];
}

function injectScript(tab) {
    injectDetails = {
        file: "injectMock.js",
        allFrames: false,
        runAt: "document_end"};

    chrome.tabs.executeScript(tab.id, injectDetails)
}

function onTabUpdated(id, details, tab)  {
    if (details.status === "loading") {
        injectScript(tab)
    } else if (details.status === "complete") {
        // TODO: how to tell current setting to web page?
        // Doesn't work!
        if (tabSettingTable[tab.id]) {
            chrome.tabs.sendMessage(tab.id, tabSettingTable[tab.id])
        }
    }
}

chrome.tabs.onUpdated.addListener(onTabUpdated);

chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse) {
        console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
        if (!req || !req.tabId ) {
            // Pop-up want to retrieve current setting
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tabId = tabs[0].id;
                if (!tabSettingTable[tabId]) {
                    newTabSetting(tabs[0])
                }
                sendResponse(tabSettingTable[tabId]);
            });
            return true;
        } else {
            // Pop-up want to update new setting
            setting = tabSettingTable[req.tabId]
            setting.startEpoch = req.startEpoch;
            setting.multiplier = req.multiplier;
            setting.isMocking = req.isMocking;

            chrome.tabs.sendMessage(req.tabId, setting);
        }
    }
);
