function getMockEpoch(setting) {
    var diff = Date.now() - setting.startEpoch;
    return setting.startEpoch + diff * setting.multiplier;
}

function getDomElements(document) {
    return {
	current: document.getElementById("current_time"),
	date: document.getElementById("date_input"),
	time: document.getElementById("time_input"),
	set_button: document.getElementById("set_button"),
	stop_button: document.getElementById("stop_button"),
	multiplier: document.getElementById("multiplier")
    };
}

function updaetCurrent() {
    var currentEpoch = getMockEpoch(setting);
    doms.current.innerText = new Date(currentEpoch).toLocaleString();
}

function populateSetting() {
    updaetCurrent();
    
    startMoment = moment(setting.startEpoch);
    doms.date.value = startMoment.format("YYYY-MM-DD");
    doms.time.value = startMoment.format("HH:mm");
}

// Retreive settings from GUI and start mock clock
function setAndStartMockDate() {
    startMoment = moment(doms.date.value + " " + doms.time.value);
    setting.startEpoch = +startMoment;
    setting.isMocking = true;

    chrome.runtime.sendMessage(setting);
}

// 
function stopMocking() {
    chrome.runtime.sendMessage({tabId: setting.tabId, isMocking: false});
}

function initDialog() {
    doms = getDomElements(document);
    doms.set_button.onclick = setAndStartMockDate;
    doms.stop_button.onclick = stopMocking;
    
    chrome.runtime.sendMessage({}, function(response) {
        setting = response;
	
        populateSetting(doms, setting);
        // dom.multiplier.onClick = setMultiplier(); 
        setInterval(updaetCurrent, 1000);
    });
}

document.addEventListener('DOMContentLoaded', initDialog);
