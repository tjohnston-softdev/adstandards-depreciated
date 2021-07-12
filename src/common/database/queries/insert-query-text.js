// Functions prepare MySQL queries for inserting data into the archive. (../db-insert.js)

const mysql = require("mysql");


// Insert items into list table, ignoring duplicates.
function writeCommonListInsert(vTableName, vKeyName, vEntryList)
{
	var queryFormat = "INSERT IGNORE INTO ?? (??) VALUES ?;";
	var queryParameters = [vTableName, vKeyName, vEntryList];
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Insert advertiser.
function writeAdvertiserInsert(vAdvertiserName)
{
	var queryFormat = "INSERT INTO Advertiser (advertiserName) VALUES (?)";
	var queryParameters = [vAdvertiserName];
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}


// Insert advertisement cases. Duplicate entries will be overwritten.
function writeCaseDataInsert(vEntryList)
{
	var queryFormat = "";
	var queryParameters = [vEntryList];
	
	queryFormat += "INSERT INTO CaseFile ";
	queryFormat += getCaseColumns();
	queryFormat += " VALUES ? ";
	queryFormat += "ON DUPLICATE KEY UPDATE ";
	
	// When a duplicate entry is found, the following column values are overwritten
	queryFormat += getUpdateColumn("advertiserID");
	queryFormat += getUpdateColumn("descriptionText");
	queryFormat += getUpdateColumn("determinationFlag");
	queryFormat += getUpdateColumn("productCategoryID");
	queryFormat += getUpdateColumn("mediaTypeID");
	queryFormat += getUpdateColumn("determinationDate");
	queryFormat += getUpdateColumn("documentFileURL");
	queryFormat += "downloadFlag = 1;";
	
	var writeRes = mysql.format(queryFormat, queryParameters);
	return writeRes;
}



// Writes column list for inserting case data.
function getCaseColumns()
{
	var cList = [];
	var colPart = "";
	
	cList.push("caseCode", "advertiserID", "descriptionText", "determinationFlag");
	cList.push("productCategoryID", "mediaTypeID", "determinationDate", "documentFileURL");
	
	colPart += "(";
	colPart += cList.join();
	colPart += ")";
	
	return colPart;	
}


// Writes update column for handling duplicate entries.
function getUpdateColumn(cName)
{
	var updatePart = "";
	
	updatePart += cName;
	updatePart += " = VALUES(";
	updatePart += cName;
	updatePart += "), ";
	
	return updatePart;
}



module.exports =
{
	writeCommonList: writeCommonListInsert,
	writeAdvertiser: writeAdvertiserInsert,
	writeCases: writeCaseDataInsert
};