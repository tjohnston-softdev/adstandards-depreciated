/*
	Validates numbers scraped from HTML elements.
	For advertisement case specific elements, see 'case-validation.js'
	Used in '../page-count.js'
*/


const valueType = require("../../../common/value-type");
const entryErrorText = require("../../../common/entry/entry-error-text");
const availabilityTasks = require("../../../common/entry/availability-tasks");


// General number.
function validateGeneralType(givenNumber, numberDesc, scrapeRes)
{
	var castValue = Number(givenNumber);
	var correctType = Number.isFinite(castValue);
	var validationResult = NaN;
	
	if (correctType === true)
	{
		validationResult = castValue;
	}
	else
	{
		scrapeRes.messageText = entryErrorText.writeIncorrectType(numberDesc, "number");
	}
	
	return validationResult;
}



// Whole number.
function validateWholeType(givenNumber, numberDesc, scrapeRes)
{
	var castValue = Number(givenNumber);
	var correctType = Number.isInteger(castValue);
	var validationResult = NaN;
	
	if (correctType === true)
	{
		validationResult = castValue;
	}
	else
	{
		scrapeRes.messageText = entryErrorText.writeIncorrectType(numberDesc, "whole number");
	}
	
	return validationResult;
}


// Number range.
function validateNumberRange(givenNumber, rangeLimit, numberDesc, scrapeRes)
{
	var validationResult = false;
	
	if (givenNumber >= rangeLimit.min && givenNumber <= rangeLimit.max)
	{
		validationResult = true;
	}
	else
	{
		scrapeRes.messageText = entryErrorText.writeNumberRange(numberDesc, rangeLimit.min, rangeLimit.max);
	}
	
	return validationResult;
}





module.exports =
{
	validateGeneral: validateGeneralType,
	validateWhole: validateWholeType,
	validateRange: validateNumberRange
};