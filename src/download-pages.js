const asyncModule = require("async");
const clear = require("clear");
const inpDownload = require("./input/inp-download");
const landReq = require("./web-request/land-req");
const searchPageCount = require("./web-scrape/search-page-count");
const pageClear = require("./file-prep/page-clear");
const folderIntl = require("./file-prep/folder-intl");
const landSave = require("./file-prep/land-save");
const caseLink = require("./web-request/case-link");
const pageReq = require("./web-request/page-req");
const tickPlaceholders = require("./common/interface/tick-placeholders");
const exitProgram = require("./common/exit-program");



/*
	Command: download-pages
	Description: Downloads page .html files from adstandards
	Steps:
		* Validate console input.
		* Download adstandards landing page.
		* Scrape total number of pages.
		* Remove existing page HTML files (optional)
		* Initialize pages folder
		* Save landing page HTML file.
		* Write remaining page URLs.
		* Download remaining HTML pages.
*/



function downloadSearchPageFiles(cmdOptions)
{
	var preparedInputObject = inpDownload.prepareArgs(cmdOptions);
	clear();
	
	landReq.requestLandingPage(function (dPageErr, dPageRes)
	{
		if (dPageErr !== null)
		{
			exitProgram.callExit(dPageErr.message);
		}
		else
		{
			extractSearchPageCount(preparedInputObject, dPageRes);
		}
	});
	
}



function extractSearchPageCount(preparedInput, searchPageRequest)
{
	searchPageCount.scrapePageCount(searchPageRequest, false, function (spError, spRes)
	{
		if (spError !== null)
		{
			exitProgram.callExit(spError.message);
		}
		else
		{
			executeCacheTasks(preparedInput, searchPageRequest, spRes);
		}
	});
}




function executeCacheTasks(prepInput, sPageReq, sPageCount)
{
	asyncModule.series(
	{
		"pageFolderCleared": pageClear.removePagesFolder.bind(null, prepInput.removeExistingFiles),
		"pageFolderInitialized": folderIntl.initializePages.bind(null),
		"landingFileSaved": landSave.writeLandingPage.bind(null, sPageReq.retrievedBody, prepInput.overwriteExistingFiles),
		"otherPages": caseLink.prepareURLs.bind(null, sPageCount)
	},
	function (cacheTasksErr, cacheTasksRes)
	{
		if (cacheTasksErr !== null)
		{
			exitProgram.callExit(cacheTasksErr.message);
		}
		else
		{
			executePageDownload(prepInput, cacheTasksRes.otherPages);
		}
	});
}


function executePageDownload(prepInp, downloadLinkList)
{
	pageReq.requestPages(downloadLinkList, prepInp, function (pageDownloadError, pageDownloadRes)
	{
		if (pageDownloadError !== null)
		{
			tickPlaceholders.displayFailed("Page Download Error");
			exitProgram.callExit(pageDownloadError.message);
		}
		else
		{
			tickPlaceholders.displaySuccessful("Search Pages Downloaded");
			exitProgram.callSuccessful();
		}
	});
}




module.exports =
{
	performCommand: downloadSearchPageFiles
};