const asyncModule = require("async");
const clear = require("clear");
const inpReadLists = require("./input/inp-read-lists");
const landReq = require("./web-request/land-req");
const listData = require("./web-scrape/list-data");
const updateListData = require("./database-prep/update-list-data");
const exitProgram = require("./common/exit-program");



/*
	Command: read-lists
	Description: Downloads and saves product category and media type list data into archive.
	Steps:
		* Validate console input.
		* Download adstandards landing page.
		* Scrape Product Category and Media Type data.
		* Insert list items into the database.
		* Activate current set of used list items.
		* Deactivate unused list items.
*/




function readDataOptionLists(cmdOptions)
{
	var preparedInputObject = inpReadLists.prepareArgs(cmdOptions);
	clear();
	
	landReq.requestLandingPage(function (dOptsError, dOptsRes)
	{
		if (dOptsError !== null)
		{
			exitProgram.callExit(dOptsError.message);
		}
		else
		{
			executeScrapeTasks(preparedInputObject, dOptsRes);
		}
	});
}



function executeScrapeTasks(preparedInput, landPageHTMLObject)
{
	listData.scrapeListData(landPageHTMLObject, preparedInput.ignoreScrape, function (scrapeTasksError, scrapeTasksRes)
	{
		if (scrapeTasksError !== null)
		{
			exitProgram.callExit(scrapeTasksError.message);
		}
		else
		{
			executeDataUpdate(scrapeTasksRes);
		}
	});
}



function executeDataUpdate(scrapedData)
{
	updateListData.updateData(scrapedData, function(dataInsertError, dataInsertRes)
	{
		if (dataInsertError !== null)
		{
			exitProgram.callExit(dataInsertError.message);
		}
		else
		{
			exitProgram.callSuccessful("Lists read successfully");
		}
	});
}





module.exports =
{
	performCommand: readDataOptionLists
};