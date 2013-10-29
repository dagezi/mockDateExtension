var tabSettingTable = new Object();

function newTabSetting(tab) {
    var tabSetting = new Object();
    tabSetting.tab = tab;
    
    tabSettingTable[tab.id] = tabSettingTable;
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
    if (details.status !== "loading") return;

    injectScript(tab)
}

chrome.tabs.onUpdated.addListener(onTabUpdated);

chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse) {
	console.log(sender.tab ?
                    "from a content script:" + sender.tab.url :
                    "from the extension");
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	    chrome.tabs.sendMessage(tabs[0].id, req);
	});
    }
);
