const clear = require("clear");
const archiveClear = require("./database-prep/archive-clear");
const exitProgram = require("./common/exit-program");


/*
	Command: clear
	Description: Removes all data from the archive database
	Steps:
		* Read clear archive script file (./common/database/scripts/clear-all.sql)
		* Execute clear archive script.
*/


function clearArchiveDatabase()
{
	clear();
	
	archiveClear.clearData(true, function (overallError, overallResult)
	{
		if (overallError !== null)
		{
			exitProgram.callExit(overallError.message);
		}
		else
		{
			exitProgram.callSuccessful("Database cleared successfully");
		}
	});
	
}


module.exports =
{
	performCommand: clearArchiveDatabase
};