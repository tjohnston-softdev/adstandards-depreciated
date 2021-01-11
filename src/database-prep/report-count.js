/*
	This file is responsible for counting the number of advertisement case entries with known files.
	Used in the 'download-reports' command.
*/

const ora = require("ora");
const dbConnection = require("../common/database/db-connection");
const dbCount = require("../common/database/db-count");
const tblDesc = require("../common/interface/schema/tbl-desc");



// Main function.
function getReportFileCount(fileCountCallback)
{
	var countSpinner = ora("Counting Report Files").start();
	
	coordinateCounting(function (fcError, fcResult)
	{
		if (fcError !== null)
		{
			countSpinner.fail("Report Count Error");
			return fileCountCallback(fcError, null);
		}
		else
		{
			countSpinner.succeed("Report File Count Successful");
			return fileCountCallback(null, fcResult);
		}
	});
	
}


// Coordinate report count. Establish database connection.
function coordinateCounting(countCallback)
{
	dbConnection.openConnection(false, function (reportConnectionError, reportConnectionRes)
	{
		if (reportConnectionError !== null)
		{
			return countCallback(reportConnectionError, null);
		}
		else
		{
			callCountQuery(reportConnectionRes, countCallback);
		}
	});
}


// Perform report count query.
function callCountQuery(reportConnObject, cQueryCallback)
{
	dbCount.countFlaggedCaseFiles(reportConnObject, tblDesc.reportFile, function (docError, docRes)
	{
		if (docError !== null)
		{
			// Query error - Abort connection.
			dbConnection.resolveError(reportConnObject, docError, cQueryCallback);
		}
		else
		{
			// Query successful - Close connection and return result.
			callSuccessfulOutcome(reportConnObject, docRes, cQueryCallback);
		}
	});
}



// Close database connection with successful result.
function callSuccessfulOutcome(reportConn, retNumber, finalCallback)
{
	dbConnection.closeConnection(reportConn, function (closeErr, closeRes)
	{
		if (closeErr !== null)
		{
			return finalCallback(closeErr, null);
		}
		else
		{
			return finalCallback(null, retNumber);
		}
	});
}




module.exports =
{
	getCount: getReportFileCount
};