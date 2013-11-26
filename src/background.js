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

chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse) {
        if (sender.tab) {
            // Content script requests current setting
            console.log("from a content script:" + req + " from " + sender.tab)

            setting = tabSettingTable[sender.tab.id]
            chrome.tabs.sendMessage(sender.tab.id, setting)

        } else if (!req || !req.tabId ) {
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
