/*
	This file is responsible for counting the number of entries in the archive database.
	Used in the 'log-database' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const dbConnection = require("../common/database/db-connection");
const dbCount = require("../common/database/db-count");
const tblNames = require("../common/interface/schema/tbl-names");
const tblDesc = require("../common/interface/schema/tbl-desc");
const inputDesc = require("../common/interface/general/input-desc");


// Main function.
function getDatabaseEntryCountSummary(entryCountCallback)
{
	var countSpinner = ora("Counting Entries").start();
	
	coordinateCounting(function (ecError, ecResult)
	{
		if (ecError !== null)
		{
			countSpinner.fail("Entry Count Error");
			return entryCountCallback(ecError, null);
		}
		else
		{
			countSpinner.succeed("Database Entries Counted");
			return entryCountCallback(null, ecResult);
		}
	});
	
}


// Coordinate entry count. Establish connection.
function coordinateCounting(countCallback)
{
	dbConnection.openConnection(false, function (entryConnErr, entryConnRes)
	{
		if (entryConnErr !== null)
		{
			return countCallback(entryConnErr, null);
		}
		else
		{
			callEntryCountQueries(entryConnRes, countCallback);
		}
	});
}


// Performs count tasks for individual tables.
function callEntryCountQueries(entryConnObject, ecQueriesCallback)
{
	asyncModule.series(
	{
		"advertisers": handleTableEntries.bind(null, entryConnObject, tblNames.advertiser, tblDesc.advertiser),
		"productCategories": handleTableEntries.bind(null, entryConnObject, tblNames.prodCat, inputDesc.productCategory),
		"mediaTypes": handleTableEntries.bind(null, entryConnObject, tblNames.medType, inputDesc.mediaType),
		"cases": handleTableEntries.bind(null, entryConnObject, tblNames.caseFile, tblDesc.caseFile),
		"reports": handleReportEntries.bind(null, entryConnObject)
	},
	function (querySetError, querySetRes)
	{
		if (querySetError !== null)
		{
			// Query sequence error - Abort with error.
			dbConnection.resolveError(entryConnObj, querySetError, ecQueriesCallback);
		}
		else
		{
			// Queries successful.
			callQueriesFinished(entryConnObject, querySetRes, ecQueriesCallback);
		}
	});
}



// Close connection with successful result.
function callQueriesFinished(entryConnObj, resultSetObject, finalCallback)
{
	dbConnection.closeConnection(entryConnObj, function (closeErr, closeRes)
	{
		if (closeErr !== null)
		{
			return finalCallback(closeErr, null);
		}
		else
		{
			return finalCallback(null, resultSetObject);
		}
	});
}


// Performs count queries for table.
function handleTableEntries(entryConn, targetTableName, targetTableDescription, tableCallback)
{
	asyncModule.series(
	{
		"total": dbCount.countTotalRows.bind(null, entryConn, targetTableName, targetTableDescription),
		"active": dbCount.countActiveRows.bind(null, entryConn, targetTableName, targetTableDescription),
		"inactive": dbCount.countInactiveRows.bind(null, entryConn, targetTableName, targetTableDescription)
	},
	function (tblErr, tblRes)
	{
		return tableCallback(tblErr, tblRes);
	});
}


// Performs count queries for case entry reports.
function handleReportEntries(entryConn, reportCallback)
{
	asyncModule.series(
	{
		"flagged": dbCount.countFlaggedCaseFiles.bind(null, entryConn, tblDesc.aaa),
		"inactive": dbCount.countInactiveCaseFiles.bind(null, entryConn, tblDesc.aaa),
		"total": dbCount.countTotalCaseFiles.bind(null, entryConn, tblDesc.aaa),
		"missing": dbCount.countMissingCaseFiles.bind(null, entryConn, tblDesc.aaa)
	},
	function (repErr, repRes)
	{
		return reportCallback(repErr, repRes);
	});
}




module.exports =
{
	getSummary: getDatabaseEntryCountSummary
};