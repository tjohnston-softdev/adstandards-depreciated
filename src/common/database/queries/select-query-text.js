// Functions prepare MySQL queries for retrieving data from the archive. (../db-select.js)

const mysql = require("mysql");


// Select item from list table
function writeListKeySelect(vTableName, vListID, vListName, vTarget)
{
	var queryFormat = "SELECT ?? FROM ?? WHERE ?? = ?";
	var queryParameters = [vListID, vTableName, vListName, vTarget];
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Select group of advertisement cases with known report files. Includes row offset and group size.
function writeDocumentFileSelect(vOffset, vSize)
{
	var queryFormat = "";
	var queryParameters = [vOffset, vSize];
	
	queryFormat += "SELECT caseCode, documentFileURL ";
	queryFormat += "FROM CaseFile ";
	queryFormat += "WHERE documentFileURL IS NOT NULL ";
	queryFormat += "AND downloadFlag = 1 ";
	queryFormat += "ORDER BY caseEntryID ";
	queryFormat += "LIMIT ?,?";
	
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Select individual advertisement case using it's code key.
function writeCaseKeySelect(vKey)
{
	var queryFormat = "SELECT caseCode FROM CaseFile WHERE caseCode = ?";
	var queryParameters = [vKey];
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Select most recent determination date from advertisement cases.
function writeLatestDeterminationDateSelect()
{
	var writeRes = "";
	
	writeRes += "SELECT determinationDate FROM CaseFile ";
	writeRes += "ORDER BY determinationDate DESC ";
	writeRes += "LIMIT 1";
	
	return writeRes;
}

// Select group of rows from a table.
function writeExportRowSelect(vTableName, vSortKey, vOffset, vSize)
{
	var queryFormat = "";
	var queryParameters = [vTableName, vSortKey, vOffset, vSize];
	
	queryFormat += "SELECT * FROM ?? ";
	queryFormat += "ORDER BY ??";
	queryFormat += "LIMIT ?,?";
	
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Select advertisement case entries with blank values.
function writeUnknownEntriesSelect(vOffset, vSize)
{
	var queryFormat = "";
	var queryParameters = [vOffset, vSize];
	
	queryFormat += "SELECT ";
	queryFormat += "caseEntryID, caseCode, advertiserID, descriptionText, ";
	queryFormat += "determinationFlag, productCategoryID, mediaTypeID, determinationDate ";
	queryFormat += "FROM CaseFile WHERE (";
	
	queryFormat += "(advertiserID IS NULL) OR ";
	queryFormat += "(determinationFlag IS NULL) OR ";
	queryFormat += "(productCategoryID IS NULL) OR ";
	queryFormat += "(mediaTypeID IS NULL) OR ";
	queryFormat += "(determinationDate IS NULL)";
	
	queryFormat += ") AND ";
	queryFormat += "(documentFileURL IS NOT NULL) ";
	
	queryFormat += "ORDER BY caseEntryID ";
	queryFormat += "LIMIT ?,?";
	
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}



module.exports =
{
	writeListKey: writeListKeySelect,
	writeDocumentFile: writeDocumentFileSelect,
	writeCaseKey: writeCaseKeySelect,
	writeLatestDeterminationDate: writeLatestDeterminationDateSelect,
	writeExportRow: writeExportRowSelect,
	writeUnknownEntries: writeUnknownEntriesSelect
};