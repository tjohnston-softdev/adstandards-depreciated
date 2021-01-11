/*
	Functions that help scrape HTML elements based on selectors.
	This is more to do with stand-alone items.
*/

const scrapeErrorText = require("./errors/scrape-error-text");
const cheerioItem = require("./errors/cheerio-item");


// Checks whether a HTML element exists for the given selector.
function checkElementExists(eDesc, eSelector, parsedPage, scrapeRes)
{
	var searchResult = parsedPage(eSelector).html();
	var checkRes = cheerioItem.verifyResult(searchResult);
	
	if (checkRes !== true)
	{
		scrapeRes.messageText = scrapeErrorText.writeMissingElement(eDesc, eSelector);
	}
	
	return checkRes;
}


// Same as 'checkElementExists', but does not flag any error.
function checkElementOptional(eSelector, parsedPage)
{
	var searchResult = parsedPage(eSelector).html();
	var checkRes = cheerioItem.verifyResult(searchResult);
	return checkRes;
}



// Checks whether an element at the given selector is a particular type.
function checkElementType(eDesc, eSelector, eType, parsedPage, scrapeRes)
{
	var checkRes = parsedPage(eSelector).is(eType);
	
	if (checkRes !== true)
	{
		scrapeRes.messageText = scrapeErrorText.writeInvalidType(eDesc, eType, eSelector);
	}
	
	return checkRes;
}


// Checks whether an element at the given selector has a particular attribute.
function checkElementAttribute(eDesc, eSelector, eType, eProp, parsedPage, scrapeRes)
{
	var searchResult = parsedPage(eSelector).attr(eProp);
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