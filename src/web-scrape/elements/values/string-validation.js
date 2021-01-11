/*
	Validates strings scraped from HTML elements.
	For advertisement case specific elements, see 'case-validation.js'
	Used in '../page-count.js', 'select-basic.js', and 'table-case-cells.js'
*/


const valueType = require("../../../common/value-type");
const availabilityTasks = require("../../../common/entry/availability-tasks");
const entryErrorText = require("../../../common/entry/entry-error-text");



// String type.
function validateStringType(givenValue, valueDesc, scrapeRes)
{
	var validationResult = valueType.checkString(givenValue);
	
	if (validationResult !== true)
	{
		scrapeRes.messageText = entryErrorText.writeIncorrectType(valueDesc, "string");
	}
	
	return validationResult;
}


// String length.
function validateStringLength(charCount, maxCount, valueDesc, scrapeRes)
{
	var validationResult = false;
	
	if (charCount > 0 && charCount <= maxCount)
	{
		// Safe length.
		validationResult = true;
	}
	else if (charCount > maxCount)
	{
		// Too long.
		scrapeRes.messageText = entryErrorText.writeStringTooLong(valueDesc, maxCount);
	}
	else
	{
		// Empty.
		scrapeRes.messageText = entryErrorText.writeEmpty(valueDesc);
	}
	
	return validationResult;
}


// String item available in array.
function validateStringAvailability(givenValue, valueDesc, scrapeRes)
{
	var validationResult = availabilityTasks.checkTextAvailable(givenValue, scrapeRes.retrievedItems);
	
	if (validationResult !== true)
	{
		scrapeRes.messageText = entryErrorText.writeStringAlreadyTaken(valueDesc, givenValue);
	}
	
	return validationResult;
}





module.exports =
{
	validateType: validateStringType,
	validateLength: validateStringLength,
	validateAvailability: validateStringAvailability
};