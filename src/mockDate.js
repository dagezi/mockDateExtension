(function(){
    var mockStartEpoch = -1;
    var origStartEpoch = -1;
    var multiplier = 1;

    var OrigDate = Date
    var MockDate = function(a0, a1, a2, a3, a4, a5, a6) {
	switch (arguments.length) {
	case 0:
	    return new OrigDate(MockDate.now());
	    break;
	case 1:
	    return new OrigDate(a0);
	    break;
	case 2:
	    return new OrigDate(a0, a1);
	    break;
	case 3:
	    return new OrigDate(a0, a1, a2);
	    break;
	case 4:
	    return new OrigDate(a0, a1, a2, a3);
	    break;
	case 5:
	    return new OrigDate(a0, a1, a2, a3, a4);
	    break;
	case 6:
	    return new OrigDate(a0, a1, a2, a3, a4, a5);
	    break;
	}
	// 7 or more
	return new OrigDate(a0, a1, a2, a3, a4, a5, a6);
    }
    
    MockDate.now = function()  {
	return mockStartEpoch + (OrigDate.now() - origStartEpoch) * multiplier;
    }

    MockDate.parse = OrigDate.parse
    MockDate.UTC = OrigDate.UTC

    var updateSetting = function(event) {
	if (event.source != window) return

	setting = event.data;
	if (setting.startEpoch > 0) {
	    origStartEpoch = OrigDate.now();
	    mockStartEpoch = setting.startEpoch;
	    Date = MockDate;
	} else {
	    Date = OrigDate;
	}
    }
    
    window.addEventListener('message', updateSetting, false);
})();
