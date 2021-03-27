// This file is responsible for writing the output file when running the 'unknown' command.

const asyncModule = require("async");
const ora = require("ora");
const fs = require("fs");
const valueLimits = require("../common/value-limits");
const fileReadWrite = require("../common/file-management/file-read-write");
const blankEntryGroup = require("./sub/blank-entry-group");
const blankEntryContents = require("./sub/blank-entry-contents");


// Main function.
function writeUnknownEntriesSpreadsheet(oPathString, entrySheetCallback)
{
	var sheetSpinner = ora("Exporting Unknown Entries").start();
	
	coordinateSpreadsheet(oPathString, function (eSheetErr, eSheetRes)
	{
		if (eSheetErr !== null)
		{
			sheetSpinner.fail("Unknown Entry Export Error");
			return entrySheetCallback(eSheetErr, null);
		}
		else
		{
			sheetSpinner.succeed("Unknown Entries Exported");
			return entrySheetCallback(null, true);
		}
	});
	
	
}


// Write unknown entry data file.
function coordinateSpreadsheet(oPathStr, spreadsheetCallback)
{
	var writeOptions = fileReadWrite.getWriteStreamOptions();
	var sheetWriteResult = initializeSheetResult();
	var dataStreamObject = fs.createWriteStream(oPathStr, writeOptions);
	
	
	// File created successfully - Write contents in loop.
	dataStreamObject.on("ready", function()
	{
		loopEntries(dataStreamObject, sheetWriteResult);
	});
	
	
	// Data write error - Abort operation.
	dataStreamObject.on("error", function (writeErr)
	{
		sheetWriteResult.fileWritten = false;
		sheetWriteResult.sheetError = "Error writing unknown entries spreadsheet file.";
		dataStreamObject.end();
	});
	
	
	// Write operation finished.
	dataStreamObject.on("finish", function()
	{
		if (sheetWriteResult.fileWritten === true)
		{
			return spreadsheetCallback(null, true);
		}
		else
		{
			return spreadsheetCallback(new Error(sheetWriteResult.sheetError), null);
		}
	});
	
}


// Reads data rows and writes them to CSV file in a loop.
function loopEntries(dataStreamObj, sheetWriteRes)
{
	var queryLoopObject = {"groupIndex": 0, "firstGroup": true, "canContinue": true};
	
	asyncModule.whilst(
	function (passCallback)
	{
		// Checks whether row loop can continue.
		return passCallback(null, queryLoopObject.canContinue);
	},
	function (iterationCallback)
	{
		// Iterate current row group.
		callUnknownEntryRowGroup(queryLoopObject, dataStreamObj, iterationCallback);
	},
	function (entryLoopErr, entryLoopRes)
	{
		// Loop finished - Check for error.
		if (entryLoopErr !== null)
		{
			sheetWriteRes.fileWritten = false;
			sheetWriteRes.sheetError = entryLoopErr.message;
			dataStreamObj.end();
		}
		else
		{
			dataStreamObj.end();
		}
	});
	
}


// Queries current row group and writes to file.
function callUnknownEntryRowGroup(queryLoopObj, dataStream, rowGroupCallback)
{
	blankEntryGroup.retrieveGroup(queryLoopObj.groupIndex, valueLimits.rowCacheSize, function (dataRowErr, dataRowRes)
	{
		if (dataRowErr !== null)
		{
			// Query error - Abort row loop.
			return rowGroupCallback(dataRowErr, null);
		}
		else if (dataRowRes.length > 0)
		{
			// Rows retrieved - Write to file.
			queryLoopObj.groupIndex += 1;
			blankEntryContents.preparedDates(dataRowRes);
			blankEntryContents.writeLines(dataStream, dataRowRes, queryLoopObj);
			return rowGroupCallback(null, true);
		}
		else
		{
			// No more query results. Loop complete
			queryLoopObj.canContinue = false;
			return rowGroupCallback(null, true);
		}
	});
}



// Result object.
function initializeSheetResult()
{
	var intlRes = {fileWritten: true, sheetError: ""};
	return intlRes;
}





module.exports =
{
	writeSpreadsheet: writeUnknownEntriesSpreadsheet
};