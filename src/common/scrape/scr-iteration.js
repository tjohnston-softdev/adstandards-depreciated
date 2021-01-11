/*
	Functions that help scrape HTML elements based on their objects, not selectors.
	This is more to do with elements in a collection.
*/

const scrapeErrorText = require("./errors/scrape-error-text");
const cheerioItem = require("./errors/cheerio-item");


// Checks whether element object exists. 
function checkElementExists(eDesc, eSelector, eObject, parsedPage, scrapeRes)
{
	var searchResult = parsedPage(eObject).html();
	var checkRes = cheerioItem.verifyResult(searchResult);
	
	if (checkRes !== true)
	{
		scrapeRes.messageText = scrapeErrorText.writeMissingElement(eDesc, eSelector);
	}
	
	
	return checkRes;
}


// Same as 'checkElementExists' but does not flag an error.
function checkElementOptional(eObject, parsedPage)
{
	var searchResult = parsedPage(eObject).html();
	var checkRes = cheerioItem.verifyResult(searchResult);
	return checkRes;
}



// Checks whether element object is a particular type.
function checkElementType(eDesc, eSelector, eObject, eType, parsedPage, scrapeRes)
{
	var checkRes = parsedPage(eObject).is(eType);
	
	if (checkRes !== true)
	{
		scrapeRes.messageText = scrapeErrorText.writeInvalidType(eDesc, eType, eSelector);
	}
	
	return checkRes;
}


// Checks whether element object has a particular attribute.
function checkElementAttribute(eDesc, eSelector, eObject, eType, eProp, parsedPage, scrapeRes)
{
	var searchResult = parsedPage(eObject).attr(eProp);
	var checkRes = cheerioItem.verifyResult(searchResult);
	
	if (checkRes !== true)
	{
		scrapeRes.messageText = scrapeErrorText.writeMissingAttribute(eDesc, eType, eProp, eSelector);
	}
	
	return checkRes;
}



module.exports =
{
	checkExists: checkElementExists,
	checkOptional: checkElementOptional,
	checkType: checkElementType,
	checkAttribute: checkElementAttribute
};