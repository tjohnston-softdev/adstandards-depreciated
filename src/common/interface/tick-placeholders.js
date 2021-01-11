/*
	Displays result message for progress bar tasks.
	It is impractical to display ora spinners and progress bars on the same screen
*/

const clear = require("clear");
const ora = require("ora");


function displaySuccessfulTick(tickText)
{
	var tickSpinner = null;
	
	clear();
	tickSpinner = ora("Success").start();
	tickSpinner.succeed(tickText);
}


function displayFailedTick(tickText)
{
	var tickSpinner = null;
	
	clear();
	tickSpinner = ora("Fail").start();
	tickSpinner.fail(tickText);
}




module.exports =
{
	displaySuccessful: displaySuccessfulTick,
	displayFailed: displayFailedTick
};