/*
	Scrapes the cell elements in advertisement case table rows.
	This file only reads elements. It does not read any of the contents.
	The cell contents are scraped in 'table-case-cells.js'
	Used in '../case-data.js' and '../new-case-data.js'
*/


const scrapeHelpTasks = require("../../common/scrape/scrape-help-tasks");
const caseHelpTasks = require("../../common/scrape/case-help-tasks");
const scrSingle = require("../../common/scrape/scr-single");
const scrIteration = require("../../common/scrape/scr-iteration");
const htmlTags = require("../../common/scrape/html-tags");
const htmlSearch = require("../../common/scrape/html-search");
const scrapeDesc = require("../../common/interface/general/scrape-desc");



// Main function.
function readRowObjects(searchPageObject, ignoreCaseErrors, rowCallback)
{
	var scrapeResultObject = scrapeHelpTasks.initializeResult();
	
	var caseRowsExist = false;
	var caseRowsCount = -1;
	var rowLoopSuccessful = false;
	
	// Checks if the page has any case rows.
	caseRowsExist = scrSingle.checkExists(scrapeDesc.caseRow, htmlSearch.caseRows, searchPageObject, scrapeResultObject);
	
	if (caseRowsExist === true)
	{
		// Counts row elements.
		caseRowsCount = scrapeHelpTasks.countElements(scrapeDesc.caseRow, htmlSearch.caseRows, searchPageObject, scrapeResultObject);
	}
	
	if (caseRowsCount > 0)
	{
		// Scrapes row elements in a loop.
		rowLoopSuccessful = loopCaseRows(caseRowsCount, searchPageObject, ignoreCaseErrors, scrapeResultObject);
		scrapeResultObject.scrapeSuccessful = rowLoopSuccessful;
	}
	
	// Scrape complete.
	
	if (scrapeResultObject.scrapeSuccessful === true || ignoreCaseErrors === true)
	{
		// Row scrape successful.
		return rowCallback(null, scrapeResultObject.retrievedItems);
	}
	else
	{
		// Row scrape error.
		return rowCallback(new Error(scrapeResultObject.messageText), null);
	}
}


// Loops case row elements until end reached or error found.
function loopCaseRows(caRowCount, searchPageObj, skipBadRows, scrapeResObj)
{
	var rowElementIndex = 0;
	var currentRowObject = null;
	var currentAdded = false;
	
	var loopResult = true;
	
	
	while (rowElementIndex >= 0 && rowElementIndex < caRowCount && loopResult === true)
	{
		currentRowObject = searchPageObj(htmlSearch.caseRows).get(rowElementIndex);
		currentAdded = readCurrentRow(currentRowObject, searchPageObj, skipBadRows, scrapeResObj);
		
		if (currentAdded !== true)
		{
			// Error.
			loopResult = false;
		}
		
		rowElementIndex = rowElementIndex + 1;
	}
	
	return loopResult;
}


// Scrapes cell elements from current row.
function readCurrentRow(rowElement, searchPage, skipBad, scrapeResult)
{
	var rowObjectExists = false;
	var correctElementType = false;
	
	var keyCellSaved = false;
	var summaryCellSaved = false;
	var determinationCellSaved = false;
	var categoryCellSaved = false;
	var mediaCellSaved = false;
	var dateCellSaved = false;
	
	var canAdd = false;
	var preparedRowObject = caseHelpTasks.initializeRow();
	var readRes = false;
	
	
	// Checks if row element is valid.
	rowObjectExists = scrIteration.checkExists(scrapeDesc.caseRow, htmlSearch.caseRows, rowElement, searchPage, scrapeResult);
	
	
	if (rowObjectExists === true)
	{
		// Check row type.
		correctElementType = scrIteration.checkType(scrapeDesc.caseRow, htmlSearch.caseRows, rowElement, htmlTags.tableRowTag, searchPage, scrapeResult);
	}
	
	if (correctElementType === true)
	{
		// Reads 'Case number' cell.
		keyCellSaved = saveCell(rowElement, 0, "Case Number Cell", "keyCell", preparedRowObject, searchPage, scrapeResult);
	}
	
	if (keyCellSaved === true)
	{
		// Ad Standards description.
		summaryCellSaved = saveCell(rowElement, 1, "Ad Standards Description Cell", "summaryCell", preparedRowObject, searchPage, scrapeResult);
	}
	
	if (summaryCellSaved === true)
	{
		// Determination.
		determinationCellSaved = saveCell(rowElement, 2, "Determination Cell", "determinationCell", preparedRowObject, searchPage, scrapeResult);
	}
	
	if (determinationCellSaved === true)
	{
		// Category.
		categoryCellSaved = saveCell(rowElement, 3, "Category Cell", "categoryCell", preparedRowObject, searchPage, scrapeResult);
	}
	
	if (categoryCellSaved === true)
	{
		// Media.
		mediaCellSaved = saveCell(rowElement, 4, "Media Cell", "mediaCell", preparedRowObject, searchPage, scrapeResult);
	}
	
	if (mediaCellSaved === true)
	{
		// Determination date.
		dateCellSaved = saveCell(rowElement, 5, "Determination Date Cell", "dateCell", preparedRowObject, searchPage, scrapeResult);
	}
	
	if (dateCellSaved === true)
	{
		canAdd = true;
	}
	
	
	// Reading complete.
	
	
	if (canAdd === true)
	{
		// Row scrape successful.
		scrapeResult.retrievedItems.push(preparedRowObject);
		readRes = true;
	}
	else if (skipBad === true)
	{
		// Skip row.
		readRes = true;
	}
	else
	{
		// Error found.
		readRes = false;
	}
	
	return readRes;
}



// This function is used to read an individual cell element from a table row.
function saveCell(rElement, saveCellIndex, saveCellDesc, saveCellProp, rowObj, sPage, sResult)
{
	var cellSelector = "";
	var cellObject = null;
	
	var cellExists = false;
	var typeValid = false;
	
	var saveRes = false;
	
	// Searches target cell.
	cellSelector = scrapeHelpTasks.getCellSelector(htmlSearch.caseRows, saveCellIndex);
	cellObject = sPage(rElement).children(htmlTags.tableCellTag).get(saveCellIndex);
	
	
	// Check cell found.
	cellExists = scrIteration.checkExists(saveCellDesc, cellSelector, cellObject, sPage, sResult);
	
	
	if (cellExists === true)
	{
		// Check cell type.
		typeValid = scrIteration.checkType(saveCellDesc, cellSelector, cellObject, htmlTags.tableCellTag, sPage, sResult);
	}
	
	if (typeValid === true)
	{
		// Save cell.
		rowObj[saveCellProp] = cellObject;
		saveRes = true;
	}
	
	return saveRes;
}


module.exports =
{
	readObjects: readRowObjects
};