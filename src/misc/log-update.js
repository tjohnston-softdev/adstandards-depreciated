// Adds text to the log file when running the 'log' command.

const path = require("path");
const fs = require("fs");
const ora = require("ora");
const charShortcuts = require("../common/char-shortcuts");
const storedPaths = require("../../stored-paths");


// Saves text to file.
function appendLogFile(appendTxt, appendCallback)
{
	var logSpinner = ora("Appending Log").start();
	
	fs.appendFile(storedPaths.logFile, appendTxt, "utf8", function (appendErr)
	{
		if (appendErr !== null)
		{
			logSpinner.warn("Log Update Failed");
			return appendCallback(new Error("Log Append"), null);
		}
		else
		{
			logSpinner.succeed("Log File Updated");
			return appendCallback(null, true);
		}
	});
}


// Display log message in console for error correction.
function echoLogMessage(appendTxt)
{
	var fullText = "";
	
	fullText += charShortcuts.lineBreak;
	fullText += "Could not successfully update log text file.";
	fullText += charShortcuts.lineBreak;
	
	fullText += "Please manually add the following text to";
	fullText += charShortcuts.lineBreak;
	
	fullText += path.resolve(storedPaths.logFile);
	fullText += charShortcuts.paraBreak;
	
	fullText += appendTxt.replace(charShortcuts.paraBreak, "");
	
	console.log(fullText);
}



module.exports =
{
	appendLog: appendLogFile,
	echoMessage: echoLogMessage
};