const asyncModule = require("async");
const clear = require("clear");
const inpAddNewCases = require("./input/inp-add-new-cases");
const determinationDate = require("./database-prep/determination-date");
const newCaseData = require("./web-scrape/new-case-data");
const newCasePreperation = require("./web-scrape/new-case-preperation");
const exitProgram = require("./common/exit-program");


/*
	Command: add-new-cases
	
	Description:
		Reads any new case report entries after the previous determination date.
		Use 'download-reports' to retrieve .pdf files.
		
	Steps:
		* Find most recent determination date.
		* Read 'ignore-scrape-errors' argument.
		* Download pages and scrape cases until cutoff date reached.
		* Prepare advertiser references for scraped cases.
		* Prepare product category and media type references for scraped cases.
		* Insert new cases into the database.
*/


function addNewAdvertisementCases(cmdOptions)
{
	clear();
	
	determinationDate.getLatest(function (detErr, detRes)
	{
		if (detErr !== null)
		{
			exitProgram.callExit(detErr.message);
		}
		else
		{
			executeNewCaseRead(cmdOptions, detRes);
		}
	});
	
}


function executeNewCaseRead(cmdOpts, latestKnownDate)
{
	var scrapeInput = inpAddNewCases.prepareArg(cmdOpts);
	
	newCaseData.scrapeData(latestKnownDate, scrapeInput, function (newCaseReadErr, newCaseReadRes)
	{
		if (newCaseReadErr !== null)
		{
			exitProgram.callExit(newCaseReadErr.message);
		}
		else
		{
			executeNewCasePreperationTasks(newCaseReadRes);
		}
	});
	
}


function executeNewCasePreperationTasks(newCaseRead)
{
	asyncModule.series(
	[
		newCasePreperation.ensureReferences.bind(null, newCaseRead),
		newCasePreperation.insertObjects.bind(null, newCaseRead)
	],
	function (caseTasksErr, caseTasksRes)
	{
		if (caseTasksErr !== null)
		{
			exitProgram.callExit(caseTasksErr.message);
		}
		else
		{
			exitProgram.callSuccessful("New Cases Added");
		}
	});
}




module.exports =
{
	performCommand: addNewAdvertisementCases
};