/*
	These functions are responsible for reading  the database credentials login file (../../db-creds.json)
	Used in: '../read-runtime-files.js'
*/


const fs = require("fs");
const fsDesc = require("../common/interface/general/fs-desc");
const sizeLimits = require("../common/file-management/size-limits");
const fsGeneralText = require("../common/file-management/errors/fs-general-text");
const ioErrorText = require("../common/file-management/errors/io-error-text");
const storedPaths = require("../../stored-paths");



// Checks if the login file exists.
function checkLoginFileExists()
{
	var existRes = {"dataObject": null, "successful": false};
	var flaggedMessage = "";
	
	try
	{
		// Reads file system entry object.
		existRes.dataObject = fs.statSync(storedPaths.dbCreds);
		existRes.successful = true;
	}
	catch(fileError)
	{
		// Error checking file system.
		flaggedMessage = ioErrorText.writeFileAction(fileError.code, "checking", fsDesc.dbCreds, storedPaths.dbCreds);
		throw new Error(flaggedMessage);
	}
	
	return existRes;
}



// Validates login file size.
function checkLoginFileSize(dataObj)
{
	var upperLimit = sizeLimits.creds.maxSize;
	var validFile = dataObj.isFile();
	var flaggedMessage = "";
	var sizeRes = false;
	
	
	if (validFile === true && dataObj.size > 0 && dataObj.size <= upperLimit)
	{
		// Valid file with safe size.
		sizeRes = true;
	}
	else if (validFile === true && dataObj.size > upperLimit)
	{
		// File too large.
		sizeRes = false;
		flaggedMessage = fsGeneralText.writeFileTooLarge(fsDesc.dbCreds, sizeLimits.creds.sizeLabel);
		throw new Error(flaggedMessage);
	}
	else if (validFile === true)
	{
		// File empty.
		sizeRes = false;
		flaggedMessage = fsGeneralText.writeFileEmpty(fsDesc.dbCreds);
		throw new Error(flaggedMessage);
	}
	else
	{
		// Invalid file.
		sizeRes = false;
		flaggedMessage = fsGeneralText.writeInvalidFile(fsDesc.dbCreds, storedPaths.dbCreds);
		throw new Error(flaggedMessage);
	}
	
	return sizeRes;
}



// This function actually reads the login file after it has been checked.
function getLoginFileContents()
{
	var contentRes = {"retrievedData": null, "successful": false};
	var flaggedMessage = "";
	
	try
	{
		// Read file.
		contentRes.retrievedData = fs.readFileSync(storedPaths.dbCreds, "utf8");
		contentRes.successful = true;
	}
	catch(readError)
	{
		// Error flagged.
		flaggedMessage = readErrorText.writeRead(readError.code, "reading", fsDesc.dbCreds, storedPaths.dbCreds);
		throw new Error(flaggedMessage);
	}
	
	return contentRes;
}




// Parses the login file contents into a JSON object.
function parseLoginFileContents(definitionText)
{
	var parseRes = {"dataObject": null, "successful": false};
	var flaggedMessage = "";
	
	try
	{
		// Attempts JSON parse.
		parseRes.dataObject = JSON.parse(definitionText);
		parseRes.successful = true;
	}
	catch(parseError)
	{
		// Parse error.
		flaggedMessage = fsGeneralText.writeInvalidJson(fsDesc.dbCreds, storedPaths.dbCreds);
		throw new Error(flaggedMessage);
	}
	
	return parseRes;
}





module.exports =
{
	checkFileExists: checkLoginFileExists,
	checkSize: checkLoginFileSize,
	getContents: getLoginFileContents,
	parseContents: parseLoginFileContents
};