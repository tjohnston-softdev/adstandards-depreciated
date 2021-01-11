// General help functions for web scraping.

const scrapeErrorText = require("./errors/scrape-error-text");


// Scrape result object.
function initializeScrapeResultObject()
{
	var intlRes = {};
	
	intlRes["retrievedItems"] = [];
	intlRes["scrapeSuccessful"] = false;
	intlRes["messageText"] = "";
	
	return intlRes;
}


// Writes selector string from parent and child element.
function getSubselectorString(rootText, subText)
{
	var subRes = rootText + " " + subText;
	return subRes;
}


// Writes selector string for individual cell in a table row.
function getCellSelectorString(rootText, subIndex)
{
	var cellSelectRes = "";
	
	cellSelectRes += rootText;
	cellSelectRes += " td:eq(";
	cellSelectRes += subIndex;
	cellSelectRes += ")";
	
	return cellSelectRes;
}


// Counts number of elements that match a given selector.
function countMatchedElements(countDesc, countSelector, parsedPage, scrapeRes)
{
	var matchCount = parsedPage(countSelector).get().length;
	var safeType = Number.isInteger(matchCount);
	var countRes = -1;
	
	if (safeType === true && matchCount > 0)
	{
		countRes = matchCount;
	}
	else
	{
		scrapeRes.messageText = scrapeErrorText.writeMatchElementCount(countDesc, countSelector);
	}
	
	return countRes;
}



// Reads text from element.
function extractElementText(eObject, parsedPage)
{
	var extractRes = parsedPage(eObject).text();
	return extractRes;
}


// Reads value from element.
function extractElementValue(eObject, parsedPage)
{
	var extractRes = parsedPage(eObject).val();
	return extractRes;
}


// Reads attribute value from element.
function extractElementAttribute(eObject, eProp, parsedPage)
{
	var extractRes = parsedPage(eObject).attr(eProp);
	return extractRes;
}





module.exports =
{
	initializeResult: initializeScrapeResultObject,
	getSubselector: getSubselectorString,
	getCellSelector: getCellSelectorString,
	countElements: countMatchedElements,
	extractText: extractElementText,
	extractValue: extractElementValue,
	extractAttribute: extractElementAttribute
};