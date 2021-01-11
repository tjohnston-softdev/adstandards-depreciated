// Functions for executing SELECT COUNT(*) queries.

const dbErrorText = require("./errors/db-error-text");
const countQueryText = require("./queries/count-query-text");


// Total rows.
function countTotalTableRows(connObj, tblName, tblDesc, selectCallback)
{
	var queryText = countQueryText.writeTotalRows(tblName);
	runCountSelectQuery(connObj, queryText, tblDesc, "total", selectCallback);
}


// Active rows.
function countActiveTableRows(connObj, tblName, tblDesc, selectCallback)
{
	var queryText = countQueryText.writeActiveRows(tblName);
	runCountSelectQuery(connObj, queryText, tblDesc, "activeCount", selectCallback);
}


// Inactive rows.
function countInactiveTableRows(connObj, tblName, tblDesc, selectCallback)
{
	var queryText = countQueryText.writeInactiveRows(tblName);
	runCountSelectQuery(connObj, queryText, tblDesc, "inactiveCount", selectCallback);
}


// Advertisement case entries with known report files.
function countTotalCaseFileRows(connObj, countDesc, selectCallback)
{
	var queryText = countQueryText.writeTotalDocumentFiles();
	runCountSelectQuery(connObj, queryText, countDesc, "totalDocumentCount", selectCallback);
}


// Report files marked for download.
function countFlaggedCaseFileRows(connObj, countDesc, selectCallback)
{
	var queryText = countQueryText.writeFlaggedDocumentFiles();
	runCountSelectQuery(connObj, queryText, countDesc, "flaggedDocumentCount", selectCallback);
}


// Report files not marked for download.
function countInactiveCaseFileRows(connObj, countDesc, selectCallback)
{
	var queryText = countQueryText.writeInactiveDocumentFiles();
	runCountSelectQuery(connObj, queryText, countDesc, "inactiveDocumentCount", selectCallback);
}


// Advertisement case entries without report files.
function countMissingCaseFileRows(connObj, countDesc, selectCallback)
{
	var queryText = countQueryText.writeMissingDocumentFiles();
	runCountSelectQuery(connObj, queryText, countDesc, "missingDocumentCount", selectCallback);
}



// Execute count query.
function runCountSelectQuery(cObject, qText, qDesc, rProp, runQueryCallback)
{
	var retrievedRow = null;
	var retrievedCount = 0;
	var flaggedMessage = "";
	
	cObject.query(qText, function (countErr, countRes, countFields)
	{
		if (countErr !== undefined && countErr !== null)
		{
			// Query execution error.
			flaggedMessage = dbErrorText.writeCount(qDesc, countErr);
			return runQueryCallback(new Error(flaggedMessage), null);
		}
		else if (countRes.length > 0)
		{
			// Query result found. Use retrieved number.
			retrievedRow = countRes[0];
			retrievedCount = retrievedRow[rProp];
			return runQueryCallback(null, retrievedCount);
		}
		else
		{
			// Query result empty.
			return runQueryCallback(null, 0);
		}
	});
	
}




module.exports =
{
	countTotalRows: countTotalTableRows,
	countActiveRows: countActiveTableRows,
	countInactiveRows: countInactiveTableRows,
	countTotalCaseFiles: countTotalCaseFileRows,
	countFlaggedCaseFiles: countFlaggedCaseFileRows,
	countInactiveCaseFiles: countInactiveCaseFileRows,
	countMissingCaseFiles: countMissingCaseFileRows
};