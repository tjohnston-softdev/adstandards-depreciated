const asyncModule = require("async");
const clear = require("clear");
const inpReadCases = require("./input/inp-read-cases");
const caseClear = require("./database-prep/case-clear");
const searchSavedPages = require("./file-prep/search-saved-pages");
const caseData = require("./web-scrape/case-data");
const pageClear = require("./file-prep/page-clear");
const tickPlaceholders = require("./common/interface/tick-placeholders");
const exitProgram = require("./common/exit-program");



/*
	Command: read-cases
	Description: Scrapes case report data from saved page files.
	Steps:
		* Validate console input.
		* Clear existing cases from database. (optional)
		* Retrieve page HTML file paths.
		* Scrape and validate advertisement case data from page files.
		* Delete page files after scrape complete. (optional)
*/



function readCachedSearchPages(cmdOptions)
{
	var preparedInputObject = inpReadCases.prepareArgs(cmdOptions);
	clear();
	
	asyncModule.series(
	{
		"clearSuccessful": caseClear.clearData.bind(null, preparedInputObject.clearExistingCases),
		"pageFilePaths": searchSavedPages.findSavedFiles.bind(null)
	},
	function (readCacheError, readCacheRes)
	{
		if (readCacheError !== null)
		{
			exitProgram.callExit(readCacheError.message);
		}
		else
		{
			executeScrapeTasks(preparedInputObject, readCacheRes.pageFilePaths);
		}
	});
	
}



function executeScrapeTasks(preparedInputObj, pFilePaths)
{
	caseData.scrapeCaseData(pFilePaths, preparedInputObj, function (scrapeTasksErr, scrapeTasksRes)
	{
		if (scrapeTasksErr !== null)
		{
			tickPlaceholders.displayFailed("Search Page Scrape Error");
			exitProgram.callExit(scrapeTasksErr.message);
		}
		else
		{
			tickPlaceholders.displaySuccessful("Search Pages Scraped");
			executeCacheClear(preparedInputObj);
		}
	});
}


function executeCacheClear(preparedInput)
{
	pageClear.removePagesFolder(preparedInput.deletePageFiles, function (cacheClearError, cacheClearRes)
	{
		if (cacheClearError !== null)
		{
			exitProgram.callExit(cacheClearError.message);
		}
		else
		{
			exitProgram.callSuccessful("Cases read successfully");
		}
	});
}





module.exports =
{
	performCommand: readCachedSearchPages
};