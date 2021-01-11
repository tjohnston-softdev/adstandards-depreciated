/*
	This file is responsible for reading exported table data.
	The data rows are then imported into the database.
	The file is read line-by-line and processed in groups.
	Used in the 'import' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const lineByLine = require("line-by-line");
const tblNames = require("../common/interface/schema/tbl-names");
const valueLimits = require("../common/value-limits");
const ioErrorText = require("../common/file-management/errors/io-error-text");
const importHelp = require("./sub/import-help");
const parseCsv = require("./sub/parse-csv");
const rowInsert = require("./sub/row-insert");
const listRows = require("./validation/list-rows");
const caseRows = require("./validation/case-rows");


// Main function
function readImportDataFile(impPathString, impFileExists, impInfoObject, impIgnoreErrors, impDataCallback)
{
	if (impFileExists === true)
	{
		// Read and import.
		coordinateDataFile(impPathString, impInfoObject, impIgnoreErrors, impDataCallback);
	}
	else
	{
		// Skip without error.
		skipDataFile(impInfoObject, impDataCallback);
	}
}


// Coordinate data file read.
function coordinateDataFile(impPathStr, impInfoObj, impIgnoreErrs, dataFileCallback)
{
	var dataFileSpinner = ora(impInfoObj.baseMessage).start();
	
	streamDataFileContents(impPathStr, impInfoObj, impIgnoreErrs, function (streamFileErr, streamFileRes)
	{
		if (streamFileErr !== null)
		{
			dataFileSpinner.fail(impInfoObj.failMessage);
			return dataFileCallback(streamFileErr, null);
		}
		else
		{
			dataFileSpinner.succeed(impInfoObj.successMessage);
			return dataFileCallback(null, true);
		}
	});
}


// Skip file.
function skipDataFile(impInfoObj, skipCallback)
{
	var skipSpinner = ora("Importing").start();
	skipSpinner.info(impInfoObj.skipMessage);
	return skipCallback(null, true);
}



// Read data file line-by-line.
function streamDataFileContents(impPath, impInfo, impIgnErrors, streamContentsCallback)
{
	var lineReadResult = initializeReadResult();
	var lineStreamObject = new lineByLine(impPath);
	
	
	// Read error - Abort operation.
	lineStreamObject.on("error", function (readErr)
	{
		lineReadResult.successful = false;
		lineReadResult.errorText = ioErrorText.writeFileAction(readErr.code, "reading", impInfo.fileDesc, impPath)
		lineReadResult.close();
		lineStrObject.resume();
	});
	
	
	// Read current line.
	lineStreamObject.on("line", function (currentLineText)
	{
		if (lineReadResult.successful === true)
		{
			lineStreamObject.pause();
			readLineText(currentLineText, impInfo, lineReadResult, impIgnErrors, lineStreamObject);
		}
	});
	
	
	// Read operation finished.
	lineStreamObject.on("end", function()
	{
		if (lineReadResult.successful === true && lineReadResult.cachedLines.length > 1)
		{
			// Process any remaining lines saved to memory.
			manageFinalInsert(impInfo, lineReadResult, impIgnErrors, streamContentsCallback);
		}
		else if (lineReadResult.successful === true)
		{
			// No remaining lines - Successful.
			return streamContentsCallback(null, true);
		}
		else
		{
			// Return flagged error.
			return streamContentsCallback(new Error(lineReadResult.errorText), null);
		}
	});
	
}


// Read current data line.
function readLineText(currentLine, schemaInfoObject, lineReadRes, ignoreReadErrors, lineStreamObj)
{
	// Sanitize line text.
	var preparedLine = importHelp.prepareLine(currentLine);
	
	if (preparedLine.length > 0 && lineReadRes.cachedLines.length > valueLimits.rowCacheSize)
	{
		// Line cache full - Validate and insert data as group.
		manageNextInsert(preparedLine, schemaInfoObject, lineReadRes, ignoreReadErrors, lineStreamObj);
	}
	else if (preparedLine.length > 0)
	{
		// Cache line and continue.
		lineReadRes.cachedLines.push(preparedLine);
		lineStreamObj.resume();
	}
	else
	{
		// Ignore empty line.
		lineStreamObj.resume();
	}
	
}


// Calls processing for current group of cached lines.
function manageNextInsert(strayLineText, schemaInfoObj, overallReadResult, ignoreReadErrs, lineStrObject)
{
	callCacheParse(strayLineText, schemaInfoObj, overallReadResult, ignoreReadErrs, function (manageErr, manageRes)
	{
		if (manageErr !== null)
		{
			// Group processing error.
			overallReadResult.errorText = manageErr.message;
			lineStrObject.close();
			lineStrObject.resume();
		}
		else
		{
			// Successful
			lineStrObject.resume();
		}
	});
}


// Calls processing for last group of cached lines. Does not use stream.
function manageFinalInsert(schemaInfoObj, overallReadResult, ignoreReadErrs, finalInsertCallback)
{
	callCacheParse(null, schemaInfoObj, overallReadResult, ignoreReadErrs, function (manageErr, manageRes)
	{
		if (manageErr !== null)
		{
			return finalInsertCallback(new Error(manageErr.message), null);
		}
		else
		{
			return finalInsertCallback(null, true);
		}
	});
}


// Parses cached CSV lines into JSON objects.
function callCacheParse(strayLineTxt, schemaInfo, overallReadRes, ignReadErrors, cacheParseCallback)
{
	parseCsv.parseCachedLines(overallReadRes.cachedLines, schemaInfo.schemaDesc, function (caParseErr, caParseRes)
	{
		if (caParseErr !== null)
		{
			return cacheParseCallback(caParseErr, null);
		}
		else
		{
			// Validate objects.
			callDirectValidation(caParseRes, strayLineTxt, schemaInfo, overallReadRes, ignReadErrors, cacheParseCallback);
		}
	});
}


// Directs parsed data validation. Each table is validated differently.
function callDirectValidation(parsedObjectArray, strayText, schInfoObject, overallResultObject, ignoreErrors, directValidationCallback)
{
	var directRes = null;
	
	if (schInfoObject.schemaName === tblNames.advertiser)
	{
		// Advertiser
		directRes = listRows.validateObjects(parsedObjectArray, schInfoObject, ignoreErrors);
	}
	else if (schInfoObject.schemaName === tblNames.prodCat)
	{
		// ProductCategory
		directRes = listRows.validateObjects(parsedObjectArray, schInfoObject, ignoreErrors);
	}
	else if (schInfoObject.schemaName === tblNames.medType)
	{
		// MediaType
		directRes = listRows.validateObjects(parsedObjectArray, schInfoObject, ignoreErrors);
	}
	else if (schInfoObject.schemaName === tblNames.caseFile)
	{
		// CaseFile
		directRes = caseRows.validateObjects(parsedObjectArray, schInfoObject, ignoreErrors);
	}
	else
	{
		// Unknown - Flag error.
		directRes = importHelp.flagUnknownTable(schInfoObject.schemaName);
	}
	
	
	
	if (directRes.canContinue === true)
	{
		// Data validated successfully - Insert to table.
		callCacheInsert(parsedObjectArray, strayText, schInfoObject, overallResultObject, directValidationCallback);
	}
	else
	{
		// Validation error.
		return directValidationCallback(new Error(directRes.invalidData), null);
	}
	
}



// Inserts imported JSON objects to database.
function callCacheInsert(parsedObjectArr, strayTxt, schInfo, overallResObj, cacheInsertCallback)
{
	rowInsert.insertCurrentGroup(parsedObjectArr, schInfo, function (caInsertErr, caInsertRes)
	{
		if (caInsertErr !== null)
		{
			// Insert error.
			return cacheInsertCallback(caInsertErr, null);
		}
		else
		{
			// Cleans line cache - Add current line.
			importHelp.cleanLineCache(strayTxt, overallResObj.cachedLines);
			return cacheInsertCallback(null, true);
		}
	});
}


// Result object
function initializeReadResult()
{
	var intlRes = {};
	
	intlRes["successful"] = true;
	intlRes["errorText"] = "";
	intlRes["cachedLines"] = [];
	
	return intlRes;
}




module.exports =
{
	readDataFile: readImportDataFile
};