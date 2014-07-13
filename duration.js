function Duration(hours, minutes) {
	this.hours = hours;
	this.minutes = minutes;
};

Duration.prototype.getFormattedStr = function() {
	var formattedStr = (this.hours < 10 ? '0' + this.hours : this.hours) +
		':' +
		(this.mins < 10 ? '0' + this.mins : this.mins);
	formattedStr + ' !';
	return formattedStr;
};

Duration.prototype.fromDecimal = function(timeDec) {
	var duration;
	var decimalRegex = /^\d+(\.\d{1,2})?$/;
	if (decimalRegex.test(timeDec.toString())) {
		var hours = Math.floor(timeDec);
		var minsDec = timeDec % 1.0;
		var mins = minsDec * 60;
		mins = mins.toFixed(0);
		duration = new Duration(hours, mins);
	} else {
		throw Error('Value \'' + timeDec + '\' is not a decimal');
	}
	return duration;
};