// Performs input validation for the 'unknown' command.

const storedPaths = require("../../stored-paths");
const valueType = require("../common/value-type");
const inputDesc = require("../common/interface/general/input-desc");
const pathString = require("./arguments/path-string");
const optionalItems = require("./arguments/optional-items");


// Main function.
function prepareUnknownArguments(givenPathValue, optArgsObj)
{
	var argumentResult = initializeResults();
	var validOutputEntry = false;
	var validOutputPath = false;
	
	// Validates target output file path as entered.
	validOutputEntry = pathString.validateRelative(givenPathValue, storedPaths.unknownOutputFile, "targetOutputPath", inputDesc.outputFilePath, argumentResult);
	
	
	if (validOutputEntry === true)
	{
		// Validates full target output path.
		validOutputPath = pathString.validateAbsolute(argumentResult.targetOutputPath, inputDesc.outputFilePath);
	}
	
	if (validOutputPath === true)
	{
		// Validation successful - Read overwrite option.
		handleOverwriteOption(optArgsObj, argumentResult);
		argumentResult.valid = true;
	}
	
	return argumentResult;
}


// Reads overwrite file option.
function handleOverwriteOption(optArgs, argResult)
{
	var optionsObjectPassed = optionalItems.readContainer(optArgs);
	
	if (optionsObjectPassed === true)
	{
		optionalItems.setToggle(optArgs, "overwrite", argResult, "overwriteExistingFile");
	}
}


// Validation result object.
function initializeResults()
{
	var intlRes = {};
	
	intlRes["targetOutputPath"] = null;
	intlRes["overwriteExistingFile"] = false;
	intlRes["valid"] = false;
	
	return intlRes;
}




module.exports =
{
	prepareArgs: prepareUnknownArguments
};