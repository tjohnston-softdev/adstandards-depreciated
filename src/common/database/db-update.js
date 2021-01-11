// Functions for executing UPDATE queries.

const dbErrorText = require("./errors/db-error-text");
const updateQueryText = require("./queries/update-query-text");


// Marks given list entries as active.
function activateSimpleListDataRows(connObj, tblName, tblDesc, keyAttr, valueArray, updateCallback)
{
	var queryText = updateQueryText.writeActivateItems(tblName, keyAttr, valueArray);
	var flaggedMessage = "";
	
	connObj.query(queryText, function (updateErr, updateRes, updateFields)
	{
		if (updateErr !== undefined && updateErr !== null)
		{
			flaggedMessage = dbErrorText.writeUpdate(tblDesc, updateErr);
			return updateCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return updateCallback(null, true);
		}
	});
}


// Marks given list entries as inactive.
function deactivateSimpleListDataRows(connObj, tblName, tblDesc, keyAttr, valueArray, updateCallback)
{
	var queryText = updateQueryText.writeDeactivateItems(tblName, keyAttr, valueArray);
	var flaggedMessage = "";
	
	connObj.query(queryText, function (updateErr, updateRes, updateFields)
	{
		if (updateErr !== undefined && updateErr !== null)
		{
			flaggedMessage = dbErrorText.writeUpdate(tblDesc, updateErr);
			return updateCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return updateCallback(null, true);
		}
	});
}


// Marks advertisement case report files as downloaded.
function markCaseFileDownloadStatus(connObj, urlDesc, codeArray, updateCallback)
{
	var queryText = updateQueryText.writeCaseFileDownload(codeArray);
	var flaggedMessage = "";
	
	connObj.query(queryText, function (updateErr, updateRes, updateFields)
	{
		if (updateErr !== undefined && updateErr !== null)
		{
			flaggedMessage = dbErrorText.writeUpdate(urlDesc, updateErr);
			return updateCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return updateCallback(null, true);
		}
	});
	
}


// Marks all advertisement case report files for download.
function resetCaseFileDownloadStatus(connObj, urlDesc, updateCallback)
{
	var queryText = updateQueryText.writeCaseFileReset();
	var flaggedMessage = "";
	
	connObj.query(queryText, function (updateErr, updateRes, updateFields)
	{
		if (updateErr !== undefined && updateErr !== null)
		{
			flaggedMessage = dbErrorText.writeUpdate(urlDesc, updateErr);
			return updateCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return updateCallback(null, true);
		}
	});
	
}




module.exports =
{
	activateListRows: activateSimpleListDataRows,
	deactivateListRows: deactivateSimpleListDataRows,
	markCaseDownloadStatus: markCaseFileDownloadStatus,
	resetCaseDownloadStatus: resetCaseFileDownloadStatus
};