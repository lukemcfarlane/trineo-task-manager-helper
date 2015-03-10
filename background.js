var DECIMAL_REGEX = /^\d+(\.\d{1,2})?$/;
var HHMM_REGEX = /^\d\d:\d\d$/;
var HHMMSS_REGEX = /^(\d\d):(\d\d):?(\d\d)?$/;

var TimeType = {
	DECIMAL: 1,
	HHMM: 2
};

function Duration(hours, mins) {
	this.hours = hours;
	this.mins = mins;
};

Duration.prototype.getDecimal = function() {
	return this.hours + (this.mins / 60);
};

var getDurationFromDecimal = function(timeDec) {
	var duration;
	var DECIMAL_REGEX = /^\d+(\.\d*)?$/;
	if (DECIMAL_REGEX.test(timeDec.toString())) {
		var hours = Math.floor(timeDec);
		var minsDec = timeDec % 1.0;
		var mins = minsDec * 60;
		mins = Math.floor(mins);
		duration = new Duration(hours, mins);
	} else {
		throw Error('Value \'' + timeDec + '\' is not a decimal');
	}
	return duration;
};

// TODO: finish implementing
// var getDurationFromString = function(timeStr) {
// 	var duration;
// 	if(HHMM_REGEX.test(timeStr)) {
// 		duration = new Duration(0, 0);
// 	} else {
// 		throw Error('Value \'' + timeDec + '\' is not a string in HH:MM format');
// 	}
// 	return duration;
// };

var getStatType = function(statText) {
	if (DECIMAL_REGEX.test(statText)) {
		return TimeType.DECIMAL;
	} else if (HHMM_REGEX.test(statText)) {
		return TimeType.HHMM;
	}
};

Duration.prototype.getFormattedStr = function() {
	var formattedStr = (this.hours < 10 ? '0' + this.hours : this.hours) +
		':' +
		(this.mins < 10 ? '0' + this.mins : this.mins);
	formattedStr + ' !';
	return formattedStr;
};

Duration.prototype.addMinute = function() {
	if (this.mins <= 59) {
		this.mins++;
	} else {
		this.mins = 0;
		this.hours++;
	}
};

Duration.prototype.addHour = function() {
	this.hours++;
};

Duration.prototype.addDuration = function(duration) {
	this.hours += duration.hours;
	this.mins += duration.mins;
	this.normalize();
};

Duration.prototype.normalize = function() {
	this.hours += Math.floor(this.mins / 60);
	this.mins = this.mins % 60;
};

var getNormalizedDuration = function(duration) {
	var normalizedDuration = new Duration(5, 2);
	return normalizedDuration;
};

var getAddedDuration = function(duration1, duration2) {
	var addedDuration = new Duration(0, 0);
	addedDuration.addDuration(duration1);
	addedDuration.addDuration(duration2);
	return addedDuration;
};

var getSubtractedDuration = function(duration1, duration2) {
	var normalized = getNormalizedDuration(duration1);
	return normalized;
};

var updateHoursToday = function() {
	if (!isCurrentlySaving) {
		var currTimerDuration = getCurrentTimerDuration();
		var statNamesToUpdate = [
			'Hours Today',
			'Hours This Week'
		];
		if (currTimerDuration !== null) {
			for (var i = 0; i < statNamesToUpdate.length; i++) {
				var statName = statNamesToUpdate[i];
				currentDataDisplayed[statName] = getAddedDuration(
					mostRecentData[statName],
					currTimerDuration
				);
			}
		}
		updateHomeTime();
		renderStatValues();
	}
};

var getCurrentTimeAsDecimal = function() {
	var now = new Date();
	return now.getHours() + (now.getMinutes() / 60);
};

var updateHomeTime = function() {
	var targetDurationDec = new Duration(8, 0).getDecimal();
	var hoursToday = currentDataDisplayed['Hours Today'];
	var hoursTodayDec = hoursToday.getDecimal();

	var deltaDec = targetDurationDec - hoursTodayDec;
	var homeTimeDec = getCurrentTimeAsDecimal() + deltaDec;

	var homeTimeDuration = getDurationFromDecimal(homeTimeDec);

	currentDataDisplayed['Home Time'] = homeTimeDuration;
	mostRecentData['Home Time'] = homeTimeDuration;
};

var statNamesArr = [
	'Hours This Week',
	'Hours Today',
	'Hours This Time Last Week'
];

var mostRecentData = {
	'Hours This Week': new Duration(0, 0),
	'Hours Today': new Duration(0, 0),
	'Hours This Time Last Week': new Duration(0, 0)
};

var currentDataDisplayed = {
	'Hours This Week': new Duration(0, 0),
	'Hours Today': new Duration(0, 0),
	'Hours This Time Last Week': new Duration(0, 0)
};

function doTweaks() {
	console.log('Running Task Manager tweaks...');

	$('a.reset').css('margin-left', '20px');
	$('.logButton #loadingAnimation')
		.css('position', 'relative')
		.css('margin-left', '20px')
		.css('top', '3px');

	for (statName in mostRecentData) {
		var durationDec = getStat(statName);
		if (durationDec !== null) {
			var durationObj = getDurationFromDecimal(durationDec);
			mostRecentData[statName] = durationObj;
			currentDataDisplayed[statName] = durationObj;
		} else {
			console.log('Stat values must already in HH:MM format');
		}
	}

	addHometimeLabel();
	renderStatValues();
	isCurrentlySaving = false;

	$('.logBtn').click(handleLogBtnClick);
	initMutationObserver();
}

function renderStatValues() {
	for (statName in mostRecentData) {
		var durationObj = currentDataDisplayed[statName];
		setStat(statName, durationObj.getFormattedStr());
	}
}

function renderLoadingStats() {
	for (statName in mostRecentData) {
		setStat(statName, 'Loading...');
	}
}

function initMutationObserver() {
	// select the target node
	var target = document.querySelector('[id$=mainForm]');

	// create an observer instance
	var observer = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			doTweaks();
		});
	});

	// configuration of the observer:
	var config = {
		attributes: true,
		childList: true,
		characterData: true
	};

	// pass in the target node, as well as the observer options
	observer.observe(target, config);
}
initMutationObserver();

function addHometimeLabel() {
	var targetHeaderCell = $('[id$=statsSection] td.labelCol.empty');
	var targetDataCell = targetHeaderCell.next();
	var newCell = $('<th></th>');
	newCell.addClass('labelCol');
	newCell.addClass('vfLabelColTextWrap');
	newCell.addClass('last');
	newCell.append('<label>Home Time</label>');
	targetHeaderCell.replaceWith(newCell);
	targetDataCell.removeClass('empty');
	statNamesArr.push('Home Time');
}

function getStat(statName) {
	var el = $('label:contains("' + statName + '")').parent().next();
	var statVal = el.text();
	var statType = getStatType(statVal);
	if (statType === TimeType.DECIMAL) return parseFloat(statVal);
	if (statType === TimeType.HHMM) return null;
}

function setStat(statName, newVal) {
	var el = $('label:contains("' + statName + '")').parent().next();
	el.text(newVal);
}

function getCurrentTimerDuration() {
	var duration = null;

	var timerVal = $('[id$=timeEntryDurationInput').val();
	var matchArr = timerVal.match(HHMMSS_REGEX);
	if (matchArr !== null && matchArr.length >= 3) {
		var hours = parseFloat(matchArr[1]);
		var mins = parseFloat(matchArr[2]);
		duration = new Duration(hours, mins);
	}

	return duration;
}

function handleLogBtnClick() {
	console.log('Log button clicked, saving in progress...');
	isCurrentlySaving = true;
}

var isCurrentlySaving = false;

doTweaks();
setTimeout(function() {
	setInterval(updateHoursToday, 1 * 1000);
}, 3 * 1000);