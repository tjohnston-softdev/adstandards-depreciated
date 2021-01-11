/*
	Scrapes and validates advertisement case information from table rows.
	The cell elements were previously retrieved in 'table-case-rows.js'
	Used in '../case-data.js' and '../new-case-data.js'
*/


const scrapeHelpTasks = require("../../common/scrape/scrape-help-tasks");
const caseHelpTasks = require("../../common/scrape/case-help-tasks");
const scrSingle = require("../../common/scrape/scr-single");
const scrIteration = require("../../common/scrape/scr-iteration");
const htmlTags = require("../../common/scrape/html-tags");
const htmlSearch = require("../../common/scrape/html-search");
const scrapeDesc = require("../../common/interface/general/scrape-desc");
const inputDesc = require("../../common/interface/general/input-desc");
const valueLimits = require("../../common/value-limits");
const valueType = require("../../common/value-type");
const stringValidation = require("./values/string-validation");
const caseValidation = require("./values/case-validation");



// Main function.
function readCellObjectData(searchPageObject, rowArrayObject, ignoreCaseErrors, cellDataCallback)
{
	var rowIndex = 0;
	var currentRowObject = {};
	var currentAdded = false;
	
	var canContinue = true;
	var scrapeResultObject = scrapeHelpTasks.initializeResult();
	
	// Loop saved rows until end reached or error found.
	while (rowIndex >= 0 && rowIndex < rowArrayObject.length && canContinue === true)
	{
		currentRowObject = rowArrayObject[rowIndex];
		currentAdded = addCurrentRow(searchPageObject, currentRowObject, ignoreCaseErrors, scrapeResultObject);
		
		if (currentAdded !== true)
		{
			canContinue = false;
		}
		
		rowIndex = rowIndex + 1;
	}
	
	
	if (canContinue === true || ignoreCaseErrors === true)
	{
		// Data scrape successful.
		return cellDataCallback(null, scrapeResultObject.retrievedItems);
	}
	else
	{
		// Scrape error.
		return cellDataCallback(new Error(scrapeResultObject.messageText), null);
	}
	
}



// Reads and validates current case row.
function addCurrentRow(searchPageObj, tblRowObj, skipBadCases, scrapeResultObj)
{
	var preparedCaseObject = caseHelpTasks.initializeCase();
	
	var keyCellValid = false;
	var summaryCellValid = false;
	var determinationCellValid = false;
	var categoryCellValid = false;
	var mediaCellValid = false;
	var dateCellValid = false;
	
	var canAdd = false;
	var codeFormatValid = false;
	var readRes = false;
	
	
	// Reads 'Case number' cell (caseCodeKey, file)
	keyCellValid = handleKeyCell(searchPageObj, tblRowObj.keyCell, preparedCaseObject, scrapeResultObj);
	
	
	if (keyCellValid === true)
	{
		// Reads 'Ad Standards description' cell (advertiser, description)
		summaryCellValid = handleSummaryCell(searchPageObj, tblRowObj.summaryCell, preparedCaseObject, scrapeResultObj);
	}
	
	if (summaryCellValid === true)
	{
		// Reads 'determination' cell (determinedStatus)
		determinationCellValid = handleDeterminationCell(searchPageObj, tblRowObj.determinationCell, preparedCaseObject, scrapeResultObj);
	}
	
	if (determinationCellValid === true)
	{
		// Reads 'category' cell (product)
		categoryCellValid = handleCategoryCell(searchPageObj, tblRowObj.categoryCell, preparedCaseObject, scrapeResultObj);
	}
	
	if (categoryCellValid === true)
	{
		// Reads 'media' cell (media)
		mediaCellValid = handleMediaCell(searchPageObj, tblRowObj.mediaCell, preparedCaseObject, scrapeResultObj);
	}
	
	if (mediaCellValid === true)
	{
		// Reads 'date' cell (date)
		dateCellValid = handleDateCell(searchPageObj, tblRowObj.dateCell, preparedCaseObject, scrapeResultObj);
	}
	
	if (dateCellValid === true)
	{
		// All cells read successfully. Validate case code format.
		canAdd = true;
		codeFormatValid = valueType.checkCaseNumberSyntax(preparedCaseObject.caseCodeKey);
	}
	
	
	
	if (canAdd === true && codeFormatValid === true)
	{
		// Save case object.
		scrapeResultObj.retrievedItems.push(preparedCaseObject);
		readRes = true;
	}
	else if (canAdd === true || skipBadCases === true)
	{
		// Ignore bad case.
		readRes = true;
	}
	else
	{
		// Error found.
		readRes = false;
	}
	
	
	return readRes;
}



// Validates the 'Case number' cell
function handleKeyCell(searchPage, keyCellObject, prepCase, scrapeResult)
{
	var cellSelect = "";
	var linkSelector = "";
	
	var linkObject = null;
	var linkExists = false;
	
	var handleRes = false;
	
	
	// Writes element selector strings.
	cellSelect = scrapeHelpTasks.getCellSelector(htmlSearch.caseRows, 0);
	linkSelector = scrapeHelpTasks.getSubselector(cellSelect, htmlTags.linkTag);
	
	// Checks if the case number has a link element.
	linkObject = searchPage(keyCellObject).children(htmlTags.linkTag).get(0);
	linkExists = scrIteration.checkOptional(linkObject, searchPage);
	
	
	if (linkExists === true)
	{
		// Case row has attatched document - Parse URL.
		handleRes = parseKeyWithDocument(linkObject, linkSelector, prepCase, searchPage, scrapeResult);
	}
	else
	{
		// No attatched document - Parse text.
		handleRes = parseKeyWithoutDocument(keyCellObject, prepCase, searchPage, scrapeResult);
	}
	
	return handleRes;
}



// Validates the 'Ad Standards description' cell.
function handleSummaryCell(searchPage, sCell, prepCase, scrapeResult)
{
	var cellSelect = "";
	var headMax = -1;
	var bodyMax = -1;
	
	var headValid = false;
	var bodyValid = false;
	
	var handleRes = false;
	
	// Retrieves cell selector text and max string lengths.
	cellSelect = scrapeHelpTasks.getCellSelector(htmlSearch.caseRows, 1);
	headMax = valueLimits.advertiser.max;
	bodyMax = valueLimits.description.max;
	
	
	// Parses advertiser name element.
	headValid = parseAdvertiser(sCell, cellSelect, "strong", scrapeDesc.adName, inputDesc.advertiser, headMax, "advertiser", prepCase, searchPage, scrapeResult);
	
	
	if (headValid === true)
	{
		// Parses description element.
		bodyValid = parseAdvertiser(sCell, cellSelect, "section", scrapeDesc.adSummary, inputDesc.summary, bodyMax, "description", prepCase, searchPage, scrapeResult);
	}
	
	if (bodyValid === true)
	{
		handleRes = true;
	}
	
	return handleRes;
}


// Validates 'Determination' cell.
function handleDeterminationCell(searchPage, detCellObject, prepCase, scrapeResult)
{
	var extractedText = "";	
	
	// Reads and sanitizes cell text.
	extractedText = scrapeHelpTasks.extractText(detCellObject, searchPage);
	extractedText = caseValidation.prepareDetermination(extractedText);	
	
	// Parses cell text into flag number.
	caseHelpTasks.parseDetermination(extractedText, prepCase);
	
	return true;
}


// Validates 'Product' cell.
function handleCategoryCell(searchPage, catCell, prepCase, scrapeResult)
{
	var prodMaxLength = valueLimits.productCategory.max;
	var handleRes = parseListItem(catCell, inputDesc.productCategory, prodMaxLength, "product", prepCase, searchPage, scrapeResult);
	return handleRes;
}


// Validates 'Media' cell.
function handleMediaCell(searchPage, mediaCell, prepCase, scrapeResult)
{
	var medMaxLength = valueLimits.mediaType.max;
	var handleRes = parseListItem(mediaCell, inputDesc.mediaType, medMaxLength, "media", prepCase, searchPage, scrapeResult);
	return handleRes;
}


// Validates 'Determination date' cell.
function handleDateCell(searchPage, dateCellObject, prepCase, scrapeResult)
{
	var cellSelect = "";
	var spanSelect = "";
	
	var fieldObject = null;
	var fieldExists = false;
	
	var handleRes = false;
	
	// Writes element selector text.
	cellSelect = scrapeHelpTasks.getCellSelector(htmlSearch.caseRows, 5);
	spanSelect = scrapeHelpTasks.getSubselector(cellSelect, htmlTags.spanTag);
	
	// Checks whether the date is wrapped inside a 'span'
	fieldObject = searchPage(dateCellObject).children(htmlTags.spanTag).get(0);
	fieldExists = scrIteration.checkOptional(fieldObject, searchPage);
	
	
	// Parses date accordingly.
	if (fieldExists === true)
	{
		handleRes = parseDateWithSpan(fieldObject, spanSelect, prepCase, searchPage, scrapeResult)
	}
	else
	{
		handleRes = parseDateWithoutSpan(dateCellObject, prepCase, searchPage);
	}
	
	return handleRes;
}



// Parses case code number and document URL from elements with attatched document.
function parseKeyWithDocument(linkElement, linkSelect, pCase, sPage, sResult)
{
	var linkType = false;
	var urlExists = false;
	var extractedCaseLink = "";
	var linkValid = false;
	
	var extractedCaseNumber = "";
	var numberCorrectType = false;
	var numberSafeLength = false;
	
	var parseRes = false;
	
	
	// Check link element type.
	linkType = scrIteration.checkType(scrapeDesc.caseLink, linkSelect, linkElement, htmlTags.linkTag, sPage, sResult);
	
	
	if (linkType === true)
	{
		// Check URL attribute exists.
		urlExists = scrIteration.checkAttribute(scrapeDesc.caseLink, linkSelect, linkElement, htmlTags.linkTag, htmlTags.linkAttr, sPage, sResult);
	}
	
	if (urlExists === true)
	{
		// Reads and validates URL string.
		extractedCaseLink = scrapeHelpTasks.extractAttribute(linkElement, htmlTags.linkAttr, sPage);
		linkValid = caseValidation.validateLink(extractedCaseLink, valueLimits.linkLength.max, inputDesc.caseFile, pCase, sResult);
	}
	
	if (linkValid === true)
	{
		// Reads case number text and validates string type.
		extractedCaseNumber = caseValidation.isolateCaseNumber(pCase.file);
		numberCorrectType = stringValidation.validateType(extractedCaseNumber, inputDesc.caseNumber, sResult);
	}
	
	if (numberCorrectType === true)
	{
		// Validates case number text length.
		numberSafeLength = stringValidation.validateLength(extractedCaseNumber.length, valueLimits.caseCodeLength.max, inputDesc.caseNumber, sResult);
	}
	
	if (numberSafeLength === true)
	{
		// Successful.
		pCase.caseCodeKey = extractedCaseNumber;
		parseRes = true;
	}
	
	
	return parseRes;
}



// Parses case code number from elements without an attatched document.
function parseKeyWithoutDocument(cellElement, pCase, sPage, sResult)
{
	var extractedKey = "";
	var validKeyType = false;
	var validKeyLength = false;
	
	var parseRes = false;
	
	
	// Reads text and validates string type.
	extractedKey = scrapeHelpTasks.extractText(cellElement, sPage);
	validKeyType = stringValidation.validateType(extractedKey, inputDesc.caseNumber, sResult);
	
	
	if (validKeyType === true)
	{
		// Sanitizes text and validates length.
		extractedKey = valueType.sanitizeString(extractedKey);
		validKeyLength = stringValidation.validateLength(extractedKey.length, valueLimits.caseCodeLength.max, inputDesc.caseNumber, sResult);
	}
	
	if (validKeyLength === true)
	{
		// Successful.
		pCase.caseCodeKey = extractedKey;
		parseRes = true;
	}
	
	
	return parseRes;
}



// Parses text elements from the 'Ad Standards description' cell.
function parseAdvertiser(parentCellElement, baseSelect, subTag, elementDesc, valDesc, subMaxLength, pProp, pCase, sPage, sResult)
{
	var childSelector = "";
	var childElement = null;
	var elementExists = false;
	var typeChecked = false;
	var typeValid = false;
	var extractedItem = "";
	
	var parseRes = false;
	
	
	// Retrieves target element.
	childSelector = scrapeHelpTasks.getSubselector(baseSelect, subTag);
	childElement = sPage(parentCellElement).children(subTag).get(0);
	elementExists = scrIteration.checkOptional(childElement, sPage);
	
	
	if (elementExists === true)
	{
		// Check element type.
		typeChecked = true;
		typeValid = scrIteration.checkType(elementDesc, childSelector, childElement, subTag, sPage, sResult);
	}
	
	if (typeChecked === true && typeValid === true)
	{
		// Read and validate element text.
		extractedItem = scrapeHelpTasks.extractText(childElement, sPage);
		parseRes = caseValidation.validateOther(extractedItem, subMaxLength, valDesc, pProp, pCase, sResult);
	}
	else if (typeChecked === true)
	{
		// Invalid type error.
		parseRes = false;
	}
	else
	{
		// Element missing - Ignore without error.
		parseRes = true;
	}
	
	return parseRes;
}



// Parses 'Product' and 'Media' name text from cells.
function parseListItem(listItemElement, valDesc, itemMaxLength, pProp, pCase, sPage, sResult)
{
	var extractedText = extractedText = scrapeHelpTasks.extractText(listItemElement, sPage);
	var parseRes = caseValidation.validateOther(extractedText, itemMaxLength, valDesc, pProp, pCase, sResult);
	return parseRes;
}


// Parses determination date wrapped in 'span' element.
function parseDateWithSpan(childElement, childSelector, pCase, sPage, sResult)
{
	var typeValid = scrIteration.checkType(scrapeDesc.dateContents, childSelector, childElement, htmlTags.spanTag, sPage, sResult);
	var extractedItem = "";
	
	var parseRes = false;
	
	if (typeValid === true)
	{
		extractedItem = scrapeHelpTasks.extractText(childElement, sPage);
		caseValidation.prepareDate(extractedItem, pCase);
		parseRes = true;
	}
	
	return parseRes;
}


// Parses determination date from cells without a 'span' element.
function parseDateWithoutSpan(cellElement, pCase, sPage)
{
	var extractedItem = scrapeHelpTasks.extractText(cellElement, sPage);
	caseValidation.prepareDate(extractedItem, sPage);
	return true;
}





module.exports =
{
	readData: readCellObjectData
};