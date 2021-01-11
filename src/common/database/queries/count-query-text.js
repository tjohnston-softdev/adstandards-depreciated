// Functions prepare MySQL queries for counting data rows in the archive (../db-count.js)

const mysql = require("mysql");


// Count total rows in table.
function writeTotalRowCount(vTableName)
{
	var queryFormat = "SELECT COUNT(*) AS total FROM ??";
	var queryParameters = [vTableName];
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Count active rows in table.
function writeActiveRowCount(vTableName)
{
	var queryFormat = "";
	var queryParameters = [vTableName];
	
	queryFormat += "SELECT COUNT(*) AS activeCount ";
	queryFormat += "FROM ?? ";
	queryFormat += "WHERE activeFlag = 1";
	
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Count inactive rows in table.
function writeInactiveRowCount(vTableName)
{
	var queryFormat = "";
	var queryParameters = [vTableName];
	
	queryFormat += "SELECT COUNT(*) AS inactiveCount ";
	queryFormat += "FROM ?? ";
	queryFormat += "WHERE activeFlag = 0";
	
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Count number of advertisement case entries with known report files.
function writeTotalDocumentFileCount()
{
	var writeRes = "";
	
	writeRes += "SELECT COUNT(*) AS totalDocumentCount ";
	writeRes += "FROM CaseFile ";
	writeRes += "WHERE documentFileURL IS NOT NULL";
	
	return writeRes;
}


// Count number of report files marked for download.
function writeFlaggedDocumentFileCount()
{
	var writeRes = "";
	
	writeRes += "SELECT COUNT(*) AS flaggedDocumentCount ";
	writeRes += "FROM CaseFile ";
	writeRes += "WHERE documentFileURL IS NOT NULL AND ";
	writeRes += "downloadFlag = 1";
	
	return writeRes;
}


// Count number of report files that are not marked for download.
function writeInactiveDocumentFileCount()
{
	var writeRes = "";
	
	writeRes += "SELECT COUNT(*) AS inactiveDocumentCount ";
	writeRes += "FROM CaseFile ";
	writeRes += "WHERE documentFileURL IS NOT NULL AND ";
	writeRes += "downloadFlag = 0";
	
	return writeRes;
}


// Count number of advertisement case entries without known report files.
function writeMissingDocumentFileCount()
{
	var writeRes = "";
	
	writeRes += "SELECT COUNT(*) AS missingDocumentCount ";
	writeRes += "FROM CaseFile ";
	writeRes += "WHERE documentFileURL IS NULL";
	
	return writeRes;
}





module.exports =
{
	writeTotalRows: writeTotalRowCount,
	writeActiveRows: writeActiveRowCount,
	writeInactiveRows: writeInactiveRowCount,
	writeTotalDocumentFiles: writeTotalDocumentFileCount,
	writeFlaggedDocumentFiles: writeFlaggedDocumentFileCount,
	writeInactiveDocumentFiles: writeInactiveDocumentFileCount,
	writeMissingDocumentFiles: writeMissingDocumentFileCount
};