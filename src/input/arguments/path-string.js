// These functions are used to validate path strings.

const path = require("path");
const entryErrorText = require("../../common/entry/entry-error-text");
const valueType = require("../../common/value-type");
const valueLimits = require("../../common/value-limits");
const exitProgram = require("../../common/exit-program");


// Short, relative path.
function validateRelativePathString(givenValue, defaultValue, argProp, pathDescription, resultObject)
{
	var correctType = valueType.checkString(givenValue);
	var defaultSet = valueType.checkString(defaultValue);
	var validationResult = false;
	var flaggedMessage = "";
	
	if (correctType === true && givenValue.length > 0 && givenValue.length <= valueLimits.maxPathLength)
	{
		// Path valid.
		resultObject[argProp] = path.resolve(givenValue);
		validationResult = true;
	}
	else if (correctType === true && givenValue.length > valueLimits.maxPathLength)
	{
		// Too long.
		validationResult = false;
		flaggedMessage = entryErrorText.writeStringTooLong(pathDescription, valueLimits.maxPathLength);
		exitProgram.callExit(flaggedMessage);
	}
	else if (defaultSet === true)
	{
		// Use default.
		resultObject[argProp] = path.resolve(defaultValue);
		validationResult = true;
	}
	else
	{
		// Path empty. No error for now.
		resultObject[argProp] = null;
		validationResult = true;
	}
	
	return validationResult;
}



// Full, absolute path.
function validateAbsolutePathString(givenValue, pathDescription)
{
	var correctType = valueType.checkString(givenValue);
	var validationResult = false;
	var flaggedMessage = "";
	
	if (correctType === true && givenValue.length > 0 && givenValue.length <= valueLimits.maxPathLength)
	{
		// Path valid.
		validationResult = true;
	}
	else if (correctType === true && givenValue.length > valueLimits.maxPathLength)
	{
		// Too long.
		flaggedMessage = entryErrorText.writeStringTooLong(pathDescription, valueLimits.maxPathLength);
		exitProgram.callExit(flaggedMessage);
	}
	else if (correctType === true)
	{
		// Path empty.
		flaggedMessage = entryErrorText.writeEmpty(pathDescription);
		exitProgram.callExit(flaggedMessage);
	}
	else
	{
		// Incorrect type.
		flaggedMessage = entryErrorText.writeIncorrectType(pathDescription, "string");
		exitProgram.callExit(flaggedMessage);
	}
	
	return validationResult;
}




module.exports =
{
	validateRelative: validateRelativePathString,
	validateAbsolute: validateAbsolutePathString
};