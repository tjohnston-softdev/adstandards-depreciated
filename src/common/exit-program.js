// Functions used to exit program.


// Error - displays message.
function callProgramExit(errorMsg)
{
	console.log(errorMsg);
	process.exitCode = 1;
}


// Successful - Optionally displays message.
function callSuccessful(resultMsg)
{
	if (resultMsg)
	{
		console.log("");
		console.log(resultMsg);
	}
	
	process.exitCode = 1;
}



module.exports =
{
	callExit: callProgramExit,
	callSuccessful: callSuccessful
};