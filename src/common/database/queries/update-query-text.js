// Functions prepare MySQL queries for modifying data in the archive (../db-update.js)

const mysql = require("mysql");


// Set the following list item rows as active
function writeActivateItemsUpdate(vTableName, vKeyName, vEntryList)
{
	var queryFormat = "";
	var queryParameters = [vTableName, vKeyName, vEntryList];
	
	queryFormat += "UPDATE ?? ";
	queryFormat += "SET activeFlag = 1 ";
	queryFormat += "WHERE ?? IN (?)";
	
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Set the following list item rows as inactive
function writeDeactivateItemsUpdate(vTableName, vKeyName, vEntryList)
{
	var queryFormat = "";
	var queryParameters = [vTableName, vKeyName, vEntryList];
	
	queryFormat += "UPDATE ?? ";
	queryFormat += "SET activeFlag = 0 ";
	queryFormat += "WHERE ?? NOT IN (?)";
	
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Mark the following report files as downloaded.
function writeCaseFileDownloadUpdate(vTargetList)
{
	var queryFormat = "";
	var queryParameters = [vTargetList];
	
	queryFormat += "UPDATE CaseFile ";
	queryFormat += "SET downloadFlag = 0 ";
	queryFormat += "WHERE caseCode IN (?) AND ";
	queryFormat += "documentFileURL IS NOT NULL AND ";
	queryFormat += "downloadFlag = 1";
	
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Mark all case report files for download.
function writeCaseFileResetUpdate()
{
	var writeRes = "";
	
	writeRes += "UPDATE CaseFile ";
	writeRes += "SET downloadFlag = 1 " ;
	writeRes += "WHERE documentFileURL IS NOT NULL";
	
	return writeRes;
}




module.exports =
{
	writeActivateItems: writeActivateItemsUpdate,
	writeDeactivateItems: writeDeactivateItemsUpdate,
	writeCaseFileDownload: writeCaseFileDownloadUpdate,
	writeCaseFileReset: writeCaseFileResetUpdate
};