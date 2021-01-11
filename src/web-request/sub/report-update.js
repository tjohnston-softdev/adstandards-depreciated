/*
	Marks advertisement case entries with known reports as downloaded.
	Keeping track of this is so that the download loop can be aborted and continue later.
	Used in '../report-req.js'
*/

const asyncModule = require("async");
const dbConnection = require("../../common/database/db-connection");
const dbTransaction = require("../../common/database/db-transaction");
const dbUpdate = require("../../common/database/db-update");
const objectReduction = require("../../common/database/object-reduction");
const tblDesc = require("../../common/interface/schema/tbl-desc");



// Main function - Establish database connection.
function updateGroupDownloadStatus(groupEntries, groupUpdateCallback)
{
	dbConnection.openConnection(false, function (fileConnectionError, fileConnectionRes)
	{
		if (fileConnectionError !== null)
		{
			return groupUpdateCallback(fileConnectionError, null);
		}
		else
		{
			callTableUpdateSteps(groupEntries, fileConnectionRes, groupUpdateCallback);
		}
	});
}


// Perform entry update query.
function callTableUpdateSteps(gEntries, groupConnection, tblStepsCallback)
{
	// Compiles list of advertisement case keys for update.
	objectReduction.reduceReports(gEntries);
	
	asyncModule.series(
	[
		dbTransaction.beginTransaction.bind(null, groupConnection),
		dbUpdate.markCaseDownloadStatus.bind(null, groupConnection, tblDesc.reportFile, gEntries),
		dbTransaction.commitChanges.bind(null, groupConnection)
	],
	function (stepErr, stepRes)
	{
		if (stepErr !== null)
		{
			callFailedOutcome(groupConnection, stepErr, tblStepsCallback);
		}
		else
		{
			callSuccessfulOutcome(groupConnection, tblStepsCallback);
		}
	});
}



// Entry update successful - Close connection.
function callSuccessfulOutcome(grpConn, finalCallback)
{
	dbConnection.closeConnection(grpConn, function (closeErr, closeRes)
	{
		if (closeErr !== null)
		{
			return finalCallback(closeErr, null);
		}
		else
		{
			return finalCallback(null, true);
		}
	});
}



// Entry update failed - Abort connection with error.
function callFailedOutcome(grpConn, sError, finalCallback)
{
	asyncModule.series(
	[
		dbTransaction.cancelChanges.bind(null, grpConn),
		dbConnection.resolveError.bind(null, grpConn, sError)
	],
	function (closeErr, closeRes)
	{
		return finalCallback(closeErr, null);
	});
}




module.exports =
{
	updateDownloadStatus: updateGroupDownloadStatus
};