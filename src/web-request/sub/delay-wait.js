/*
	Waits for delay after HTTP 429 error before downloads continue.
	Used as part of: '../page-req.js' and '../report-req.js'
*/

const asyncModule = require("async");
const progBars = require("../../common/interface/prog-bars");
const progDesc = require("../../common/interface/general/prog-desc");


// Main function.
function enforceWebRequestDelay(requiredLength, reqDelayCallback)
{
	// Prepares delay progress bar.
	var delayText = {sec: ""};
	var delayBar = progBars.initializeBar(" Delay | {bar} | {sec}");
	var secondsElapsed = {"count": 0};
	
	// Writes initial text.
	delayText.sec = writeSecondsRemaining(secondsElapsed.count, requiredLength);
	
	
	// Displays progress bar.
	progBars.displayHeader(progDesc.reqDelay);
	delayBar.start(requiredLength, secondsElapsed.count, delayText);
	
	
	// Loop polls the delay every second.
	asyncModule.whilst(
	function (timeCheckCallback)
	{
		// Checks whether delay is finished.
		var secondsRemaining = requiredLength - secondsElapsed.count;
		var checkRes = (secondsRemaining > 0);
		return timeCheckCallback(null, checkRes);
	},
	function (secondCallback)
	{
		// Poll delay.
		setTimeout(function()
		{
			// Update progress.
			secondsElapsed.count = secondsElapsed.count + 1;
			delayText.sec = writeSecondsRemaining(secondsElapsed.count, requiredLength);
			delayBar.update(secondsElapsed.count, delayText);
			return secondCallback(null, true);
		}, 1000);
	},
	function()
	{
		// Delay finished.
		delayBar.stop();
		return reqDelayCallback(null, true);
	});
	
}



// Writes remaining seconds.
function writeSecondsRemaining(elapseCount, totalCount)
{
	var remainCount = totalCount - elapseCount;
	var writeRes = "";
	
	if (remainCount === 1)
	{
		writeRes = "1 second remaining.";
	}
	else if (remainCount >= 2)
	{
		writeRes = remainCount + " seconds remaining.";
	}
	else
	{
		writeRes = "Complete";
	}
	
	return writeRes;
}





module.exports =
{
	enforceRequestDelay: enforceWebRequestDelay
};