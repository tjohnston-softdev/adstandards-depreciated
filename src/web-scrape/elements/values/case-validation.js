// Validates data scraped from advertisement case table cells (../table-case-cells.js)

const validator = require("validator");
const valueType = require("../../../common/value-type");
const dateTasks = require("../../../common/entry/date-tasks");
const entryErrorText = require("../../../common/entry/entry-error-text");


// Validates case report URL.
function validateCaseLinkString(givenValue, maxLength, valueDesc, caseObj, scrapeRes)
{
	var stringType = valueType.checkString(givenValue);
	var preparedLink = "";
	var correctSyntax = false;
	
	var validationResult = false;
	
	if (stringType === true)
	{
		// Sanitize text and validate format.
		preparedLink = valueType.sanitizeString(givenValue);
		correctSyntax = validator.isURL(preparedLink);
	}
	
	
	if (preparedLink.length > 0 && preparedLink.length <= maxLength && correctSyntax === true)
	{
		// Valid URL.
		caseObj.file = preparedLink;
		validationResult = true;
	}
	else if (preparedLink.length > 0 && preparedLink.length <= maxLength)
	{
		// Invalid URL.
		scrapeRes.messageText = entryErrorText.writeIncorrectType(valueDesc, "URL");
	}
	else if (preparedLink.length > maxLength)
	{
		// String too long.
		scrapeRes.messageText = entryErrorText.writeStringTooLong(valueDesc, maxLength);
	}
	else
	{
		// Invalid value.
		scrapeRes.messageText = entryErrorText.writeIncorrectType(valueDesc, "string");
	}
	
	return validationResult;
}


// Validates string in a way not covered by other functions. Saves value to target property.
function validateOtherString(givenValue, maxLength, valueDesc, caseProp, caseObj, scrapeRes)
{
	var stringType = valueType.checkString(givenValue);
	var preparedText = "";
	
	var validationResult = false;
	
	if (stringType === true)
	{
		// Sanitizes string text.
		preparedText = valueType.sanitizeString(givenValue);
	}
	
	
	if (preparedText.length > 0 && preparedText.length <= maxLength)
	{
		// Valid length.
		caseObj[caseProp] = preparedText;
		validationResult = true;
	}
	else if (preparedText.length > maxLength)
	{
		// Too long.
		scrapeRes.messageText = entryErrorText.writeStringTooLong(valueDesc, maxLength);
	}
	else
	{
		// Default.
		caseObj[caseProp] = "";
		validationResult = true;
	}
	
	return validationResult;
}


// Isolates the advertisement case ID from the report URL.
function isolateCaseNumberString(fullURL)
{
	var lastSlash = fullURL.lastIndexOf("/");
	var startIndex = -1;
	var dashSep = -1;
	var cutoffIndex = -1;
	
	var isolateRes = "";
	
	if (lastSlash >= 0 && lastSlash < fullURL.length)
	{
		// Start reading file name after last slash.
		startIndex = lastSlash + 1;
	}
	
	if (startIndex >= 0 && startIndex > lastSlash && startIndex < fullURL.length)
	{
		// Finds dash in file name.
		dashSep = fullURL.indexOf("-", lastSlash);
	}
	
	
	if (dashSep >= 0 && dashSep > lastSlash && dashSep < fullURL.length)
	{
		// Stops reading after certain number of characters from dash.
		cutoffIndex = dashSep + 3;
	}
	
	if (cutoffIndex >= 0 && cutoffIndex > dashSep && cutoffIndex < fullURL.length)
	{
		// Reads key string.
		isolateRes = fullURL.substring(startIndex, cutoffIndex);
	}
	
	
	return isolateRes;
}


// Prepares determination status text.
function prepareDeterminationString(givenValue)
{
	var stringType = valueType.checkString(givenValue);
	var prepRes = "";
	
	if (stringType === true)
	{
		prepRes = valueType.sanitizeString(givenValue);
		prepRes = prepRes.toLowerCase();
	}
	
	return prepRes;
}


// Prepares determination date text.
function prepareDateString(givenValue, caseObj)
{
	var stringType = valueType.checkString(givenValue);
	var preparedText = "";
	var validDateString = false;
	
	if (stringType === true)
	{
		// Checks if valid date.
		preparedText = valueType.sanitizeString(givenValue);
		preparedText = dateTasks.convertString(preparedText);
		validDateString = dateTasks.checkValidDate(preparedText);
	}
	
	if (validDateString === true)
	{
		caseObj.date = preparedText;
	}
	
}




module.exports =
{
	validateLink: validateCaseLinkString,
	validateOther: validateOtherString,
	isolateCaseNumber: isolateCaseNumberString,
	prepareDetermination: prepareDeterminationString,
	prepareDate: prepareDateString
};