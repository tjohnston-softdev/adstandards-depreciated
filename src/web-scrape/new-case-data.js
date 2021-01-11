/*
	This file is responsible for scraping data from newly determined advertising cases.
	Unlike 'case-data.js', the pages are downloaded and scraped until the cutoff date.
	Pages are read in 'most recent' order.
	Used in the 'add-new-cases' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const cheerio = require("cheerio");
const linkPrep = require("../common/web/link-prep");
const axiosRequest = require("../common/web/axios-request");
const retryLimits = require("../common/web/retry-limits");
const webDesc = require("../common/interface/general/web-desc");
const pageCount = require("./elements/page-count");
const tableCaseRows = require("./elements/table-case-rows");
const tableCaseCells = require("./elements/table-case-cells");
const filterDate = require("./storage/filter-date");



// Main function.
function scrapeNewCaseData(cutoffDateObject, allowScrapeError, scrapeCallback)
{
	var scrapeSpinner = ora("Downloading New Cases").start();
	
	coordinateNewPageLoop(cutoffDateObject, allowScrapeError, function (pLoopErr, pLoopRes)
	{
		if (pLoopErr !== null)
		{
			scrapeSpinner.fail("Case Download Error");
			return scrapeCallback(pLoopErr, null);
		}
		else
		{
			scrapeSpinner.succeed("New Cases Downloaded");
			return scrapeCallback(null, pLoopRes);
		}
	});
	
}


// Coordinate new page scrape.
function coordinateNewPageLoop(cutoffDateObj, allowScrapeErr, pageLoopCallback)
{
	var pageLoopObject = {};
	var savedCasesArray = [];
	var currentLinkObject = initializePageLink();
	var currentPageURL = "";
	
	// Initialize page loop.
	pageLoopObject["pageNum"] = 1;
	pageLoopObject["totalCount"] = 500;
	pageLoopObject["canContinue"] = true;
	pageLoopObject["cutoffDate"] = cutoffDateObj;
	pageLoopObject["allowErrors"] = allowScrapeErr;
	
	
	// Page download-scrape loop.
	asyncModule.whilst(
	function (pagePassCallback)
	{
		// Checks whether the page loop can continue.
		var loopIndex = pageLoopObject.pageNum;
		var loopCutoff = pageLoopObject.totalCount;
		var loopCont = pageLoopObject.canContinue;
		
		var passStatus = (loopIndex >= 1 && loopIndex <= loopCutoff && loopCont === true);
		return pagePassCallback(null, passStatus);
	},
	function (pageIterationCallback)
	{
		// Writes current page URL.
		currentLinkObject[3] = pageLoopObject.pageNum - 1;
		currentPageURL = linkPrep.combineParts(currentLinkObject);
		
		// Downloads and scrapes current page.
		callPageDownload(pageLoopObject, currentPageURL, savedCasesArray, pageIterationCallback);
	},
	function (loopErr, loopRes)
	{
		// Loop complete.
		if (loopErr !== null)
		{
			return pageLoopCallback(loopErr, null);
		}
		else
		{
			savedCasesArray.reverse();
			return pageLoopCallback(null, savedCasesArray);
		}
	});
}


// Downloads current page.
function callPageDownload(pageLoopObj, pageLinkString, savedCasesArr, downloadCallback)
{
	axiosRequest.getFile(pageLinkString, webDesc.casesPage, retryLimits.casePage, true, function (dlErr, dlRes)
	{
		if (dlErr !== null)
		{
			// General HTTP request error.
			return downloadCallback(dlErr, null);
		}
		else if (dlRes.retryAfter > 0)
		{
			// Too many requests error.
			axiosRequest.displayTooManyRequests(downloadCallback);
		}
		else
		{
			// Download successful.
			callScrapeDirect(pageLoopObj, savedCasesArr, dlRes, downloadCallback);
		}
	});
}


// Decides how the current page should be scraped depending on page number.
function callScrapeDirect(pageLoop, savedCases, pageRequestObject, directCallback)
{
	var parsedHtmlObject = cheerio.load(pageRequestObject.retrievedBody);
	
	if (pageLoop.pageNum > 1)
	{
		// Second page onwards - Scrape normally.
		callNewCaseRowRead(pageLoop, savedCases, parsedHtmlObject, directCallback);
	}
	else
	{
		// First page - Read total page count before scrape.
		updateTotalPageCount(pageLoop, savedCases, parsedHtmlObject, directCallback);
	}
}


// Reads total page count on first page.
function updateTotalPageCount(pLoopObject, sCasesArray, parsedHtmlObj, totalPageCallback)
{
	pageCount.readNumber(parsedHtmlObj, pLoopObject.allowErrors, function (pCountErr, pCountRes)
	{
		if (pCountErr !== null)
		{
			// Count error.
			return totalPageCallback(pCountErr, null);
		}
		else
		{
			// Store page count and continue scraping.
			pLoopObject.totalCount = pCountRes;
			callNewCaseRowRead(pLoopObject, sCasesArray, parsedHtmlObj, totalPageCallback);
		}
	});
}


// Scrapes table cell elements from current page.
function callNewCaseRowRead(pLoopObj, sCasesArr, parsedHtml, rowReadCallback)
{
	tableCaseRows.readObjects(parsedHtml, pLoopObj.allowErrors, function (rReadErr, rReadRes)
	{
		if (rReadErr !== null)
		{
			// Table row scrape error.
			return rowReadCallback(rReadErr, null);
		}
		else
		{
			// Table cells read successfully.
			callNewCaseCellRead(pLoopObj, rReadRes, sCasesArr, parsedHtml, rowReadCallback);
		}
	});
}


// Scrapes and validates case information from table cells.
function callNewCaseCellRead(pLoop, rowObjectArray, sCases, parHtml, cellReadCallback)
{
	tableCaseCells.readData(parHtml, rowObjectArray, pLoop.allowErrors, function (nErr, nRes)
	{
		if (nErr !== null)
		{
			// Cell scrape error.
			return cellReadCallback(nErr, null);
		}
		else
		{
			// Case information scraped successfully.
			filterDate.filterNewCases(nRes, sCases, pLoop);
			pLoop.pageNum += 1;
			return cellReadCallback(null, true);
		}
	});
}



// Initializes page URL object.
function initializePageLink()
{
	var intlRes = linkPrep.createPath();
	linkPrep.addPageNumber(intlRes, 0);
	return intlRes;
}





module.exports =
{
	scrapeData: scrapeNewCaseData
};