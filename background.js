function doTweaks() {
	console.log('Running Task Manager tweaks...');
	$('a.reset').css('margin-left', '20px');
	$('.logButton #loadingAnimation')
		.css('position', 'relative')
		.css('margin-left', '20px')
		.css('top', '3px');

	$('[id$=statsSection] td.dataCol').each(function(el) {
		var contents = $(this).text();
		var decimalRegex = /^\d+(\.\d{1,2})?$/;
		if (decimalRegex.test(contents)) {
			var timeDec = parseFloat(contents);
			var hours = Math.floor(timeDec);
			var minsDec = timeDec % 1.0;
			var mins = minsDec * 60;
			mins = mins.toFixed(0);
			var formattedStr = (hours < 10 ? '0' + hours : hours) +
				':' +
				(mins < 10 ? '0' + mins : mins);
			$(this).text(formattedStr);
		}
	});
}

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

doTweaks();

k