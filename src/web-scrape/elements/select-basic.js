/*
	Scrapes Product Category and Media Type dropdown boxes.
	Used in '../list-data.js'
*/


const scrapeHelpTasks = require("../../common/scrape/scrape-help-tasks");
const scrSingle = require("../../common/scrape/scr-single");
const scrIteration = require("../../common/scrape/scr-iteration");
const htmlTags = require("../../common/scrape/html-tags");
const objectReduction = require("../../common/database/object-reduction");
const valueType = require("../../common/value-type");
const stringValidation = require("./values/string-validation");


// Main function.
function readSelectListData(selectDesc, optionDesc, inputDesc, listElementSelector, maxListItemLength, searchPageObject, ignoreErrors, basicListCallback)
{
	var scrapeResultObject = scrapeHelpTasks.initializeResult();
	var listObjectExists = false;
	var listCorrectType = false;
	
	var listItemSelector = "";
	var listItemCount = -1;
	
	var listItemsRead = false;
	
	// Checks if target dropdown element exists.
	listObjectExists = scrSingle.checkExists(selectDesc, listElementSelector, searchPageObject, scrapeResultObject);
	
	
	if (listObjectExists === true)
	{
		// Checks dropdown type.
		listCorrectType = scrSingle.checkType(selectDesc, listElementSelector, "select", searchPageObject, scrapeResultObject);
	}
	
	if (listCorrectType === true)
	{
		// Counts number of options.
		listItemSelector = scrapeHelpTasks.getSubselector(listElementSelector, htmlTags.optionTag);
		listItemCount = scrapeHelpTasks.countElements(inputDesc, listItemSelector, searchPageObject, scrapeResultObject);
	}
	
	
	if (listItemCount > 0)
	{
		// Reads individual list options.
		listItemsRead = loopListItems(optionDesc, listItemSelector, listItemCount, maxListItemLength, searchPageObject, ignoreErrors, scrapeResultObject);
	}
	
	if (listItemsRead === true)
	{
		scrapeResultObject.scrapeSuccessful = true;
	}
	
	
	
	if (scrapeResultObject.scrapeSuccessful === true || ignoreErrors === true)
	{
		// Prepare list items for database insert - Successful result.
		objectReduction.reduceListData(scrapeResultObject.retrievedItems);
		return basicListCallback(null, scrapeResultObject.retrievedItems);
	}
	else
	{
		// List scrape error.
		return basicListCallback(new Error(scrapeResultObject.messageText), null);
	}
	
}


// Loops through option elements in the dropdown list.
function loopListItems(optDesc, optSelector, optionCount, maxItemLength, searchPage, skipBadOptions, scrapeResObj)
{
	var optionIndex = 0;
	var currentElement = null;
	var currentAdded = false;
	
	var loopResult = true;
	
	
	// Loop until all options read or error found.
	while (optionIndex >= 0 && optionIndex < optionCount && loopResult === true)
	{
		// Reads current element.
		currentElement = searchPage(optSelector).get(optionIndex);
		currentAdded = readCurrentOption(optDesc, optSelector, currentElement, maxItemLength, searchPage, skipBadOptions, scrapeResObj);
		
		
		if (currentAdded !== true)
		{
			// Error found.
			loopResult = false;
		}
		
		optionIndex = optionIndex + 1;
	}
	
	
	return loopResult;
}


// Reads current dropdown option element.
function readCurrentOption(oDesc, oSelect, optElement, mLength, sPage, skipBad, scrapeResult)
{
	var optionExists = false;
	var typeValid = false;
	var optionText = "";
	var textValid = false;
	var safeLength = false;
	var itemAvailable = false;
	
	var canAdd = false;
	var readRes = false;
	
	
	// Check element valid.
	optionExists = scrIteration.checkExists(oDesc, oSelect, optElement, sPage, scrapeResult);
	
	
	if (optionExists === true)
	{
		// Check option type.
		typeValid = scrIteration.checkType(oDesc, oSelect, optElement, htmlTags.optionTag, sPage, scrapeResult);
	}
	
	if (typeValid === true)
	{
		// Read option text and validate string type.
		optionText = scrapeHelpTasks.extractText(optElement, sPage);
		textValid = stringValidation.validateType(optionText, oDesc, scrapeResult);
	}
	
	if (textValid === true)
	{
		// Sanitize text and validate length.
		optionText = valueType.sanitizeString(optionText);
		safeLength = stringValidation.validateLength(optionText.length, mLength, oDesc, scrapeResult);
	}
	
	if (safeLength === true)
	{
		// Check available.
		itemAvailable = stringValidation.validateAvailability(optionText, oDesc, scrapeResult);
	}
	
	if (itemAvailable === true)
	{
		canAdd = true;
	}
	
	
	if (canAdd === true)
	{
		// Add list item.
		scrapeResult.retrievedItems.push(optionText);
		readRes = true;
	}
	else if (skipBad === true)
	{
		// Skip invalid list item.
		readRes = true;
	}
	else
	{
		// Invalid item.
		readRes = false;
	}
	
	return readRes;
}


module.exports =
{
	readData: readSelectListData
};