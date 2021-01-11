/*
	This file is responsible for scraping case data from advertisement case page files.
	Used in the 'read-cases' command.
*/


const asyncModule = require("async");
const cheerio = require("cheerio");
const fileExists = require("../common/file-management/file-exists");
const fileReadWrite = require("../common/file-management/file-read-write");
const progBars = require("../common/interface/prog-bars");
const progDesc = require("../common/interface/general/prog-desc");
const fsDesc = require("../common/interface/general/fs-desc");
const sizeLimits = require("../common/file-management/size-limits");
const tableCaseRows = require("./elements/table-case-rows");
const tableCaseCells = require("./elements/table-case-cells");
const prepReference = require("./storage/prep-reference");
const prepAdvertiser = require("./storage/prep-advertiser");
const insCases = require("./storage/ins-cases");


// Main function
function scrapeAdvertisingCaseData(pageFileListObject, scrapeInputObject, scrapeCallback)
{
	var barSyntax = "";
	var fileProgressBar = null;
	
	// Prepares and displays scrape progress bar.
	barSyntax = progBars.writeSyntax("Files Scraped");
	fileProgressBar = progBars.initializeBar(barSyntax);
	progBars.displayHeader(progDesc.scrapeSearchPage);
	fileProgressBar.start(pageFileListObject.length, 0, null);
	
	
	// Order from oldest to newest.
	pageFileListObject.reverse();
	
	
	// Page scrape loop.
	asyncModule.eachSeries(pageFileListObject,
	function (fileEntryObject, iterationCallback)
	{
		// Read current page.
		callCurrentFile(fileEntryObject.pathString, scrapeInputObject, fileProgressBar, iterationCallback);
	},
	function (loopErr, loopRes)
	{
		// Loop complete.
		
		fileProgressBar.stop();
		
		if (loopErr !== null)
		{
			return scrapeCallback(loopErr, null);
		}
		else
		{
			return scrapeCallback(null, true);
		}
	});
}


// Reads current HTML page file.
function callCurrentFile(pFilePath, scrapeInpObj, fileProgress, pageFileCallback)
{
	asyncModule.series(
	{
		"pageExists": fileExists.checkRequired.bind(null, pFilePath, fsDesc.searchPageFile, sizeLimits.webPage),
		"pageContents": fileReadWrite.getContents.bind(null, pFilePath, fsDesc.searchPageFile)
	},
	function (fileCheckError, fileCheckRes)
	{
		if (fileCheckError !== null)
		{
			// File read error.
			return pageFileCallback(fileCheckError, null);
		}
		else
		{
			// File read successfully.
			callRowRead(fileCheckRes.pageContents, scrapeInpObj, fileProgress, pageFileCallback);
		}
	});
}



// Scrapes table cell elements from current page.
function callRowRead(pFileContents, scrInpObj, fileProgBar, rowReadCallback)
{
	var parsedHTMLObject = cheerio.load(pFileContents);
	
	tableCaseRows.readObjects(parsedHTMLObject, scrInpObj.ignoreScrape, function (rowErr, rowRes)
	{
		if (rowErr !== null)
		{
			// Table row scrape error.
			return rowReadCallback(rowErr, null);
		}
		else
		{
			// Table cells read successfully.
			callCellRead(parsedHTMLObject, rowRes, scrInpObj, fileProgBar, rowReadCallback);
		}
	});
}



// Scrapes and validates case information from table cells.
function callCellRead(parsedHTML, dataRowArray, sInpObj, fileProg, cellReadCallback)
{
	tableCaseCells.readData(parsedHTML, dataRowArray, sInpObj.ignoreScrape, function (dCellErr, dCellRes)
	{
		if (dCellErr !== null)
		{
			// Cell scrape error.
			return cellReadCallback(dCellErr, null);
		}
		else
		{
			// Case information scraped successfully.
			callDataProcessing(dCellRes, sInpObj, fileProg, cellReadCallback);
		}
	});
}



// Prepares list reference IDs and inserts case data into database.
function callDataProcessing(scrapedCaseList, sInput, pbFile, dataCallback)
{
	scrapedCaseList.reverse();
	
	asyncModule.series(
	[
		prepReference.prepareReferenceItems.bind(null, scrapedCaseList),
		prepAdvertiser.prepareAdvertiserItems.bind(null, scrapedCaseList),
		insCases.insertCaseData.bind(null, scrapedCaseList)
	],
	function (dataProcessErr, dataProcessRes)
	{
		if (dataProcessErr !== null)
		{
			// Case data processing error.
			return dataCallback(dataProcessErr, null);
		}
		else
		{
			// Insert successful - Increment progress.
			pbFile.increment();
			return dataCallback(null, true);
		}
	});
}






module.exports =
{
	scrapeCaseData: scrapeAdvertisingCaseData
};