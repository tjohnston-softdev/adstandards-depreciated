// Parses collection of CSV data lines into JSON objects (../read-import-files.js)

const papaparse = require("papaparse");
const charShortcuts = require("../../common/char-shortcuts");
const valueType = require("../../common/value-type");
const csvErrorText = require("../../common/entry/csv-error-text");


// Main function.
function parseCachedDataLines(lineArr, parseDesc, parseCallback)
{
	var fullCacheText = lineArr.join(charShortcuts.lineBreak);						// Combine cache lines into full text.
	var parseOptions = {"header": true};											// Use header line.
	var parseResult = papaparse.parse(fullCacheText, parseOptions);					// Convert text to JSON
	var resultExists = valueType.checkObject(parseResult);							// Check object returned.
	
	var parseErrorMessage = "";
	
	if (resultExists === true)
	{
		// Parse object returned.
		verifyParseSuccessful(parseResult, parseDesc, parseCallback);
	}
	else
	{
		// Object missing.
		parseErrorMessage = csvErrorText.writeGeneralError(parseDesc);
		return parseCallback(new Error(parseErrorMessage), null);
	}
	
}


// Verify results.
function verifyParseSuccessful(pResult, pDesc, pCallback)
{
	// Check result arrays exist.
	var dataArrayValid = Array.isArray(pResult.data);
	var errorArrayValid = Array.isArray(pResult.errors);
	var flaggedErrorObject = null;
	
	var verifyErrorMessage = "";
	
	
	if (errorArrayValid === true && pResult.errors.length > 0)
	{
		// Error found.
		flaggedErrorObject = pResult.errors[0];
		verifyErrorMessage = csvErrorText.writeParseError(pDesc, flaggedErrorObject);
		return pCallback(new Error(verifyErrorMessage), null);
	}
	else if (dataArrayValid === true)
	{
		// Parse successful.
		return pCallback(null, pResult.data);
	}
	else
	{
		// General error.
		verifyErrorMessage = csvErrorText.writeGeneralError(pDesc);
		return pCallback(new Error(verifyErrorMessage), null);
	}
	
}




module.exports =
{
	parseCachedLines: parseCachedDataLines
};