// These functions are used to help read exported files for import (../read-import-files.js)


const valueType = require("../../common/value-type");
const entryErrorText = require("../../common/entry/entry-error-text");
const importValidationResult = require("../../common/entry/import-validation-result");


// Sanitizes data line text.
function prepareImportLineString(origLineStr)
{
	var correctType = valueType.checkString(origLineStr);
	var prepRes = "";
	
	if (correctType === true && origLineStr.length > 0)
	{
		prepRes = valueType.sanitizeString(origLineStr);
	}
	
	return prepRes;
}


// Cleans data line cache.
function cleanLineCacheArray(rolloverLineText, lineArr)
{
	var removeCount = lineArr.length - 1;						// Retain header line.
	lineArr.splice(1, removeCount, rolloverLineText);			// Remove others - Replace with current line.
}


// Unknown table error.
function flagUnknownTableName(unkName)
{
	var flagRes = importValidationResult.initializeObject();
	
	flagRes.canContinue = false;
	flagRes.invalidData = entryErrorText.writeStringDoesNotExist("table", unkName);
	
	return flagRes;
}


module.exports =
{
	prepareLine: prepareImportLineString,
	cleanLineCache: cleanLineCacheArray,
	flagUnknownTable: flagUnknownTableName
};