/*
	Resets the download status for advertisement case entries with known report files.
	Used in '../report-clear.js'
*/

const asyncModule = require("async");
const dbConnection = require("../../common/database/db-connection");
const dbTransaction = require("../../common/database/db-transaction");
const dbUpdate = require("../../common/database/db-update");
const tblDesc = require("../../common/interface/schema/tbl-desc");


// Main function - Establishes database connection.
function resetFileStatus(resetCallback)
{
	dbConnection.openConnection(false, function (resetConnErr, resetConnRes)
	{
		if (resetConnErr !== null)
		{
			return resetCallback(resetConnErr, null);
		}
		else
		{
			callResetSteps(resetConnRes, resetCallback);
		}
	});
}


// Performs download status reset query.
function callResetSteps(resetConnection, resetStepCallback)
{
	asyncModule.series(
	[
		dbTransaction.beginTransaction.bind(null, resetConnection),
		dbUpdate.resetCaseDownloadStatus.bind(null, resetConnection, tblDesc.reportFile),
		dbTransaction.commitChanges.bind(null, resetConnection)
	],
	function (stepErr, stepRes)
	{
		if (stepErr !== null)
		{
			// Abort connection with error.
			handleFailedOutcome(resetConnection, stepErr, resetStepCallback);
		}
		else
		{
			// Successful.
			dbConnection.closeConnection(resetConnection, resetStepCallback);
		}
	});
}



// Error resetting download status.
function handleFailedOutcome(resetConn, sError, finalCallback)
{
	asyncModule.series(
	[
		dbTransaction.cancelChanges.bind(null, resetConn),
		dbConnection.resolveError.bind(null, resetConn, sError)
	],
	function (finalErr, finalRes)
	{
		return finalCallback(finalErr, null);
	});
}




module.exports =
{
	resetStatus: resetFileStatus
};