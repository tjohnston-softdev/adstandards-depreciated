// Retrieves current set of rows for export (../write-export-files.js)

const dbConnection = require("../../common/database/db-connection");
const dbSelect = require("../../common/database/db-select");
const valueLimits = require("../../common/value-limits");


// Main function
function retrieveNextRowGroup(loopCountNumber, groupQueryTable, groupQueryDesc, groupQueryKey, retrievalCallback)
{
	// Establishes database connection.
	dbConnection.openConnection(false, function (gOpenErr, gOpenRes)
	{
		if (gOpenErr !== null)
		{
			return retrievalCallback(gOpenErr, null);
		}
		else
		{
			performRowQuery(gOpenRes, loopCountNumber, groupQueryTable, groupQueryDesc, groupQueryKey, retrievalCallback);
		}
	});
}


// Query current set of rows.
function performRowQuery(groupConnection, loopCount, grpQueryTbl, grpQueryDesc, grpQueryKey, rowQueryCallback)
{
	// Calculate current group start point.
	var currentOffset = loopCount * valueLimits.rowCacheSize;
	
	// Perform query.
	dbSelect.selectExportData(groupConnection, grpQueryTbl, grpQueryDesc, grpQueryKey, currentOffset, valueLimits.rowCacheSize,
	function (gQueryErr, gQueryRes)
	{
		if (gQueryErr !== null)
		{
			// Abort connection with error.
			dbConnection.resolveError(groupConnection, gQueryErr, rowQueryCallback);
		}
		else
		{
			// Rows retrieved successfully.
			finishGroupConnection(groupConnection, gQueryRes, rowQueryCallback);
		}
	});
}


// Close connection with successful result.
function finishGroupConnection(grpConn, grpRows, finalCallback)
{
	dbConnection.closeConnection(grpConn, function (closeErr, closeRes)
	{
		if (closeErr !== null)
		{
			return finalCallback(closeErr, null);
		}
		else
		{
			return finalCallback(null, grpRows);
		}
	});
}





module.exports =
{
	retrieveNext: retrieveNextRowGroup
};