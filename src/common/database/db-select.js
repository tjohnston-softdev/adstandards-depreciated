// Functions for executing SELECT queries.

const dbErrorText = require("./errors/db-error-text");
const selectQueryText = require("./queries/select-query-text");
const dataGeneral = require("./row-data/data-general");
const dataCaseDocuments = require("./row-data/data-case-documents");
const dataUnknown = require("./row-data/data-unknown");



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
			retrievedRows = dataCaseDocuments.prepareCaseDocumentLinks(selectRes);
			return selectCallback(null, retrievedRows);
		}
	});
	
}



// Checks whether there is an advertisement case entry with a given key.
function selectCaseCodeKeyExists(connObj, keyDesc, targetKey, selectCallback)
{
	var queryText = selectQueryText.writeCaseKey(targetKey);
	var flaggedMessage = "";
	
	connObj.query(queryText, function (selectErr, selectRes, selectFields)
	{
		if (selectErr !== null)
		{
			// Select error.
			flaggedMessage = dbErrorText.writeSelect(keyDesc, selectErr);
			return selectCallback(new Error(flaggedMessage), null);
		}
		else if (selectRes.length > 0)
		{
			// Key exists.
			return selectCallback(null, true);
		}
		else
		{
			// Key does not exist.
			return selectCallback(null, false);
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


// Retrieves rows from the database for export.
function selectExportDataRows(connObj, tblName, tblDesc, keyAttr, offsetNum, groupSize, selectCallback)
{
	var queryText = selectQueryText.writeExportRow(tblName, keyAttr, offsetNum, groupSize);
	var retrievedRows = [];
	var flaggedMessage = "";
	
	connObj.query(queryText, function (selectErr, selectRes, selectFields)
	{
		if (selectErr !== undefined && selectErr !== null)
		{
			flaggedMessage = dbErrorText.writeSelect(tblDesc, selectErr);
			return selectCallback(new Error(flaggedMessage), null);
		}
		else
		{
			retrievedRows = dataGeneral.prepareGeneral(selectRes);
			return selectCallback(null, retrievedRows);
		}
	});
	
}


// Retrieves advertisement case entries with missing field values.
function selectUnknownEntryDataRows(connObj, tblDesc, offsetNum, groupSize, selectCallback)
{
	var queryText = selectQueryText.writeUnknownEntries(offsetNum, groupSize);
	var retrievedRows = [];
	var flaggedMessage = "";
	
	connObj.query(queryText, function (selectErr, selectRes, selectFields)
	{
		if (selectErr !== undefined && selectErr !== null)
		{
			flaggedMessage = dbErrorText.writeSelect(tblDesc, selectErr);
			return selectCallback(new Error(flaggedMessage), null);
		}
		else
		{
			retrievedRows = dataUnknown.prepareUnknownEntries(selectRes);
			return selectCallback(null, retrievedRows);
		}
	});
	
}




module.exports =
{
	selectListItemExists: selectListItemExistsRow,
	selectCaseDocumentLinks: selectCaseDocumentLinkRows,
	selectCaseCodeExists: selectCaseCodeKeyExists,
	selectLatestDetermination: selectLatestDeterminationRow,
	selectExportData: selectExportDataRows,
	selectUnknownEntryData: selectUnknownEntryDataRows
};