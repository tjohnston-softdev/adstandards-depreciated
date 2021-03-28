/*
	Scrapes last page link element.
	This is used to calculate the total number of pages.
	Used in '../search-page-count.js' and '../new-case-data.js'
*/

const scrapeHelpTasks = require("../../common/scrape/scrape-help-tasks");
const scrSingle = require("../../common/scrape/scr-single");
const htmlTags = require("../../common/scrape/html-tags");
const htmlSearch = require("../../common/scrape/html-search");
const valueType = require("../../common/value-type");
const valueLimits = require("../../common/value-limits");
const scrapeDesc = require("../../common/interface/general/scrape-desc");
const inputDesc = require("../../common/interface/general/input-desc");
const stringValidation = require("./values/string-validation");
const numberValidation = require("./values/number-validation");
const pageValidation = require("./values/page-validation");


// Main function.
function readPageCountNumber(searchPageObject, ignoreErrors, countNumberCallback)
{
	var scrapeResultObject = scrapeHelpTasks.initializeResult();
	var elementObjectExists = false;
	var elementTypeValid = false;
	var referenceAttributeExists = false;
	
	var extractedURL = "";
	var urlStringValid = false;
	var urlLengthValid = false;
	var countExistsFlag = NaN;
	
	var extractedNumber = "";
	var castNumber = NaN;
	var rangeValid = false;
	
	var readSuccessful = false;
	
	// Checks if last page element exists.
	elementObjectExists = scrSingle.checkExists(scrapeDesc.lastPage, htmlSearch.lastPage, searchPageObject, scrapeResultObject);
	
	
	if (elementObjectExists === true)
	{
		// Check URL element type.
		elementTypeValid = scrSingle.checkType(scrapeDesc.lastPage, htmlSearch.lastPage, htmlTags.linkTag, searchPageObject, scrapeResultObject);
	}
	
	if (elementTypeValid === true)
	{
		// Check URL attribute exists.
		referenceAttributeExists = callHrefExists(searchPageObject, scrapeResultObject);
	}
	
	if (referenceAttributeExists === true)
	{
		// Read URL and check string type.
		extractedURL = scrapeHelpTasks.extractAttribute(htmlSearch.lastPage, htmlTags.linkAttr, searchPageObject);
		urlStringValid = stringValidation.validateType(extractedURL, inputDesc.lastPageURL, scrapeResultObject);
	}
	
	if (urlStringValid === true)
	{
		// Sanitize URL and validate length.
		extractedURL = valueType.sanitizeString(extractedURL);
		urlLengthValid = stringValidation.validateLength(extractedURL.length, valueLimits.linkLength.max, inputDesc.lastPageURL, scrapeResultObject);
	}
	
	if (urlLengthValid === true)
	{
		// Checks if 'page' parameter exists in URL.
		countExistsFlag = pageValidation.validateParameter(extractedURL, inputDesc.lastPageURL, scrapeResultObject);
	}
	
	if (countExistsFlag !== NaN)
	{
		// Read and validate 'page' parameter number from URL.
		extractedNumber = pageValidation.extractNumberSubstring(extractedURL, countExistsFlag);
		castNumber = numberValidation.validateWhole(extractedNumber, inputDesc.pageNumber, scrapeResultObject);
	}
	
	if (castNumber !== NaN)
	{
		// Validate total page number.
		castNumber = castNumber + 1;
		rangeValid = numberValidation.validateRange(castNumber, valueLimits.pageNumber, inputDesc.pageNumber, scrapeResultObject);
	}
	
	if (rangeValid === true)
	{
		readSuccessful = true;
	}
	
	
	// Reading complete
	
	
	if (readSuccessful === true)
	{
		// Page count successful.
		return countNumberCallback(null, castNumber);
	}
	else if (ignoreErrors === true)
	{
		// Ignore errors - Use default.
		return countNumberCallback(null, 1);
	}
	else
	{
		// Page count scrape error.
		return countNumberCallback(new Error(scrapeResultObject.messageText), null);
	}
	
}


// Calls 'href' attribute check.
function callHrefExists(sPage, sResult)
{
	var existRes = scrSingle.checkAttribute(scrapeDesc.lastPage, htmlSearch.lastPage, htmlTags.linkTag, htmlTags.linkAttr, sPage, sResult);
	return existRes;
}




module.exports =
{
	readNumber: readPageCountNumber
};