// Functions that help when displaying progress bars.

const clear = require("clear");
const cliProgress = require("cli-progress");


// Clears console and displays header text.
function displayProgressHeader(headText)
{
	clear();
	console.log(headText);
	console.log("");
	console.log("");
}


// Writes progress bar format with label.
function writeBarSyntax(lblText)
{
	var syntaxRes = "";
	
	syntaxRes += " ";
	syntaxRes += lblText;
	syntaxRes += " | {bar} | {percentage}% | {value}/{total}";
	
	return syntaxRes;
}


// Creates progress bar object.
function initializeProgressBar(formatSyntax)
{
	var optionsObject = defineOptions(formatSyntax);
	var barResult = new cliProgress.SingleBar(optionsObject, cliProgress.Presets.shades_classic);
	return barResult;
}


// Progress bar options with given format.
function defineOptions(fmSyntax)
{
	var defineRes = {};
	
	defineRes["clearOnComplete"] = true;
	defineRes["hideCursor"] = true;
	defineRes["format"] = fmSyntax;
	
	return defineRes;
}



module.exports =
{
	displayHeader: displayProgressHeader,
	writeSyntax: writeBarSyntax,
	initializeBar: initializeProgressBar
};