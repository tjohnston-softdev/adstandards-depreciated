/*
	This file is responsible for writing exported table data as CSV files.
	Each table is exported into its own file. They can be used as a spreadsheet
	Used in the 'export' command.
*/

const asyncModule = require("async");
const ora = require("ora");
const fs = require("fs");
const fileReadWrite = require("../common/file-management/file-read-write");
const tblNames = require("../common/interface/schema/tbl-names");
const dataContents = require("./sub/data-contents");
const rowGroup = require("./sub/row-group");


// Main function
function writeExportDataFile(expPathString, expInfoObject, expDataCallback)
{
	var dataFileSpinner = ora(expInfoObject.baseMessage).start();
	
	coordinateDataFile(expPathString, expInfoObject, function (dataFileErr, dataFileRes)
	{
		if (dataFileErr !== null)
		{
			dataFileSpinner.fail(expInfoObject.failMessage);
			return expDataCallback(dataFileErr, null);
		}
		else
		{
			dataFileSpinner.succeed(expInfoObject.successMessage);
			return expDataCallback(null, true);
		}
	});
	
}


// Write CSV file.
function coordinateDataFile(expPathStr, expInfoObj, dataFileCallback)
{
	var writeOptions = fileReadWrite.getWriteStreamOptions();
	var dataStreamResult = {successful: true, errorText: ""};
	var dataStreamObject = fs.createWriteStream(expPathStr, writeOptions);
	
	
	// File created successfully - Write contents in loop.
	dataStreamObject.on("ready", function()
	{
		loopDataRows(dataStreamObject, expInfoObj, dataStreamResult);
	});
	
	
	// Data write error - Abort operation.
	dataStreamObject.on("error", function (writeErr)
	{
		dataStreamResult.successful = false;
		dataStreamResult.errorText = writeDataStreamError(expInfoObj.schemaDesc);
		dataStreamObject.end();
	});
	
	
	// Write operation finished.
	dataStreamObject.on("finish", function()
	{
		if (dataStreamResult.successful === true)
		{
			return dataFileCallback(null, true);
		}
		else
		{
			return dataFileCallback(new Error(dataStreamResult.errorText), null);
		}
	});
	
}


// Reads data rows and writes them to CSV file in a loop.
function loopDataRows(dataStreamObj, expInfo, dataStreamRes)
{
	var queryLoopObject = {"count": 0, "first": true, "canContinue": true};
	
	asyncModule.whilst(
	function (passCallback)
	{
		// Checks whether row loop can continue.
		return passCallback(null, queryLoopObject.canContinue);
	},
	function (iterationCallback)
	{
		// Iterate current row group.
		callArchiveDataRows(queryLoopObject, dataStreamObj, expInfo.schemaName, expInfo.schemaDesc, expInfo.schemaKey, iterationCallback);
	},
	function (dataLoopErr, dataLoopRes)
	{
		// Loop finished - Check for error.
		if (dataLoopErr !== null)
		{
			dataStreamRes.successful = false;
			dataStreamRes.errorText = dataLoopErr.message;
			dataStreamObj.end();
		}
		else
		{
			dataStreamObj.end();
		}
	});
	
}


// Queries current row group and writes to file.
function callArchiveDataRows(queryLoopObj, dataStream, dtNameString, dtDescriptionString, dtKeyString, rowGroupCallback)
{
	rowGroup.retrieveNext(queryLoopObj.count, dtNameString, dtDescriptionString, dtKeyString, function (dataRowsErr, dataRowsRes)
	{
		if (dataRowsErr !== null)
		{
			// Query error - Abort row loop.
			return rowGroupCallback(dataRowsErr, null);
		}
		else if (dataRowsRes.length > 0)
		{
			// Rows retrieved - Write to file.
			queryLoopObj.count += 1;
			handleCaseFileDates(dataRowsRes, dtNameString);
			dataContents.writeObjects(dataStream, dataRowsRes, queryLoopObj);
			return rowGroupCallback(null, true);
		}
		else
		{
			// No rows retrieved. End of table reached. Loop complete.
			queryLoopObj.canContinue = false;
			return rowGroupCallback(null, true);
		}
	});
}


// When exporting 'CaseFile' rows, call function to stringify date values.
function handleCaseFileDates(dRowRes, dtName)
{
	if (dtName === tblNames.caseFile)
	{
		dataContents.prepareCaseFileDates(dRowRes);
	}
}


// Error message.
function writeDataStreamError(vDesc)
{
	var writeRes = "Error writing " + vDesc + " export file.";	
	return writeRes;
}


module.exports =
{
	writeDataFile: writeExportDataFile
};