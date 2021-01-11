// Validates data scraped from the 'last page' link element (../page-count.js)

const entryErrorText = require("../../../common/entry/entry-error-text");


// Checks if the 'page' parameter exists in a given URL.
function validatePageParameter(fullURL, urlDesc, scrapeRes)
{
	var paraStart = -1;
	var existFlag = -1;
	var validationResult = NaN;
	
	// Finds start of URL parameter list.
	paraStart = fullURL.indexOf("?");
	
	
	if (paraStart >= 0 && paraStart < fullURL.length)
	{
		// Finds page parameter.
		existFlag = fullURL.indexOf("page=", paraStart);
	}
	
	
	if (existFlag >= 0 && existFlag > paraStart && existFlag < fullURL.length)
	{
		// Value found.
		validationResult = existFlag;
	}
	else
	{
		// Value missing.
		scrapeRes.messageText = entryErrorText.writePageMissing(urlDesc);
	}
	
	
	return validationResult;
}


// Reads the 'page' parameter from URL.
function extractPageNumberSubstring(fullURL, propStart)
{
	var characterIndex = -1;
	var currentChar = "";
	var currentNumber = -1;
	var currentCast = false;
	
	var extractRes = "";
	var canRead = true;
	
	// Loop starts after 'page='
	characterIndex = propStart + 5;
	
	
	// Loops through URL characters until non-number found or end reached.
	while (characterIndex >= 0 && characterIndex > propStart && characterIndex < fullURL.length && canRead === true)
	{
		// Reads current character.
		currentChar = fullURL.charAt(characterIndex);
		currentNumber = NaN;
		currentCast = false;
		
		if (currentChar.length === 1)
		{
			// If character read, cast as number.
			currentNumber = Number(currentChar);
			currentCast = Number.isInteger(currentNumber);
		}
		
		
		if (currentCast === true)
		{
			// Add number to result.
			extractRes += currentChar;
			currentAppend = true;
		}
		
		if (currentAppend !== true)
		{
			// End loop.
			canRead = false;
		}
		
		characterIndex = characterIndex + 1;
	}
	
	
	if (extractRes.length === 0)
	{
		// Number empty.
		extractRes = null;
	}
	
	
	
	return extractRes;
}




module.exports =
{
	validateParameter: validatePageParameter,
	extractNumberSubstring: extractPageNumberSubstring
};