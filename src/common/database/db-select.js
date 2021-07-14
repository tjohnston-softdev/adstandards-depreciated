// Functions for executing SELECT queries.

const dbErrorText = require("./errors/db-error-text");
const selectQueryText = require("./queries/select-query-text");
const dataCaseDocuments = require("./row-data/data-case-documents");



// Retrieves the row ID of a given item in a given table.
function selectListItemExistsRow(connObj, tblName, tblDesc, idAttr, nameAttr, targetName, selectCallback)
{
	var queryText = selectQueryText.writeListKey(tblName, idAttr, nameAttr, targetName);
	var retrievedRow = null;
	var retrievedID = NaN;
	var flaggedMessage = "";
	
	connObj.query(queryText, function (selectErr, selectRes, selectFields)
	{
		if (selectErr !== undefined && selectErr !== null)
		{
			// Select error.
			flaggedMessage = dbErrorText.writeSelect(tblDesc, selectErr);
			return selectCallback(new Error(flaggedMessage), null);
		}
		else if (selectRes.length > 0)
		{
			// List item exists.
			retrievedRow = selectRes[0];
			retrievedID = retrievedRow[idAttr];
			return selectCallback(null, retrievedID);
		}
		else
		{
			// List item does not exist.
			return selectCallback(null, NaN);
		}
	});
	
}


// Retrieves advertisement case rows that have known report files.
function selectCaseDocumentLinkRows(connObj, urlDesc, offsetNum, groupSize, selectCallback)
{
	var queryText = selectQueryText.writeDocumentFile(offsetNum, groupSize);
	var retrievedRows = [];
	var flaggedMessage = "";
	
	connObj.query(queryText, function (selectErr, selectRes, selectFields)
	{
		if (selectErr !== undefined && selectErr !== null)
		{
			// Select error.
			flaggedMessage = dbErrorText.writeSelect(urlDesc, selectErr);
			return selectCallback(new Error(flaggedMessage), null);
		}
		else
		{
			// Prepare and return query results.
			retrievedRows = prepareCaseDocumentLinkRows(selectRes);
			return selectCallback(null, retrievedRows);
		}
	});
	
}


// Retrieves the most recent determination date out of all advertisement cases.
function selectLatestDeterminationRow(connObj, dateDesc, selectCallback)
{
	var queryText = selectQueryText.writeLatestDeterminationDate();
	var retrievedRow = [];
	var retrievedDate = null;
	var flaggedMessage = "";
	
	connObj.query(queryText, function (selectErr, selectRes, selectFields)
	{
		if (selectErr !== undefined && selectErr !== null)
		{
			// Select error.
			flaggedMessage = dbErrorText.writeSelect(dateDesc, selectErr);
			return selectCallback(new Error(flaggedMessage), null);
		}
		else if (selectRes.length > 0)
		{
			// Case entries found. Use most recent date.
			retrievedRow = selectRes[0];
			retrievedDate = retrievedRow.determinationDate;
			return selectCallback(null, retrievedDate);
		}
		else
		{
			// No case entries, use default date (1970-1-1)
			retrievedDate = new Date(0);
			return selectCallback(null, retrievedDate);
		}
	});
	
}


// Parses advertisement case document rows into JSON objects.
function prepareCaseDocumentLinkRows(rowDataArray)
{
	var rowIndex = 0;
	var currentRow = {};
	var currentCode = "";
	var currentLink = "";
	var currentPrepared = {};
	
	var prepRes = [];
	
	for (rowIndex = 0; rowIndex < rowDataArray.length; rowIndex = rowIndex + 1)
	{
		currentRow = rowDataArray[rowIndex];
		currentCode = currentRow.caseCode;
		currentLink = currentRow.documentFileURL;
		currentPrepared = {"caseName": currentCode, "downloadLink": currentLink};
		
		prepRes.push(currentPrepared);
	}
	
	return prepRes;
}




module.exports =
{
	selectListItemExists: selectListItemExistsRow,
	selectCaseDocumentLinks: selectCaseDocumentLinkRows,
	selectLatestDetermination: selectLatestDeterminationRow
};