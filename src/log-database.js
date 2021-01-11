const asyncModule = require("async");
const clear = require("clear");
const entryCount = require("./database-prep/entry-count");
const countReportFiles = require("./file-prep/count-report-files");
const logText = require("./misc/log-text");
const logUpdate = require("./misc/log-update");
const exitProgram = require("./common/exit-program");



/*
	Command: log-database
	Description: Outputs database entry and saved report file counts to log text file.
	Steps:
		* Count active, inactive, and total rows for each table.
		* Count number of saved report PDF files.
		* Write output text.
		* Append output text to log file.
		* If append fails, display output text to console instead.
*/





function logDatabaseEntryStats()
{
	clear();
	
	asyncModule.series(
	{
		"tables": entryCount.getSummary.bind(null),
		"savedReportFileCount": countReportFiles.countFiles.bind(null)
	},
	function (dbStatsErr, dbStatsRes)
	{
		if (dbStatsErr !== null)
		{
			exitProgram.callExit(dbStatsErr.message);
		}
		else
		{
			executeStatsWrite(dbStatsRes);
		}
	});
}



function executeStatsWrite(databaseStatsObject)
{
	var outputText = logText.writeStats(databaseStatsObject);
	
	logUpdate.appendLog(outputText, function (intlLogErr, intlLogRes)
	{
		if (intlLogErr !== null)
		{
			logUpdate.echoMessage(outputText);
		}
		
		exitProgram.callSuccessful("Log Update Written");
	});
}




module.exports =
{
	performCommand: logDatabaseEntryStats
};
