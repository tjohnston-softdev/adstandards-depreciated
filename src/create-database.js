const asyncModule = require("async");
const clear = require("clear");
const dbFileRead = require("./database-prep/db-file-read");
const archiveInit = require("./database-prep/archive-intl");
const exitProgram = require("./common/exit-program");


/*
	Command: create
	Description: Creates and initialises the archive database
	Steps:
		* Read definition script file (./common/database/scripts/definition.sql)
		* Execute definition script.
*/



function createArchiveDatabase()
{
	clear();
	
	asyncModule.waterfall(
	[
		dbFileRead.readDefinition,
		archiveInit.initializeArchive
	],
	function (overallError, overallResult)
	{
		if (overallError !== null)
		{
			exitProgram.callExit(overallError.message);
		}
		else
		{
			exitProgram.callSuccessful("Database created successfully");
		}
	});
}



module.exports =
{
	performCommand: createArchiveDatabase
};