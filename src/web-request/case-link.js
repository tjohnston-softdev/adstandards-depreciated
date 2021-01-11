/*
	This file is responsible for preparing the advertisement case page URLs.
	This is done by reading the total page count and writing the URLs in a loop.
	Used for the 'download-pages' command.
*/

const ora = require("ora");
const linkPrep = require("../common/web/link-prep");
const httpErrorText = require("../common/web/errors/http-error-text");



// Main function.
function prepareCaseSearchPageURLs(totalPageCount, textCallback)
{
	var pageSpinner = ora("Preparing Page URLs").start();
	
	coordinateLinks(totalPageCount, function (prepLoopError, prepLoopRes)
	{
		if (prepLoopError !== null)
		{
			pageSpinner.fail("URL Preperation Error");
			return textCallback(prepLoopError, null);
		}
		else
		{
			pageSpinner.succeed("Page URLs Prepared");
			return textCallback(null, prepLoopRes);
		}
	});
	
}


// URL writing loop function.
function coordinateLinks(tPageCount, linkCallback)
{
	var linkObject = linkPrep.createPath();
	
	// The landing page has already been downloaded. Start at page 2.
	var pageNumber = 2;
	var currentURL = "";
	var savedLinks = [];
	
	var flaggedMessage = "";
	
	
	// Initialize URL object.
	linkPrep.addPageNumber(linkObject, 0);
	
	
	// Loop for each known page.
	for (pageNumber = 2; pageNumber <= tPageCount; pageNumber = pageNumber + 1)
	{
		linkObject[3] = pageNumber - 1;									// Set page number (Index starts at 0)
		currentURL = linkPrep.combineParts(linkObject);					// Write current URL
		savedLinks.push(currentURL);									// Add to result list.
	}
	
	
	if (savedLinks.length > 0)
	{
		// URL write successful.
		return linkCallback(null, savedLinks);
	}
	else
	{
		// No pages error.
		flaggedMessage = httpErrorText.writeLinkPreperation("Case Search");
		return linkCallback(new Error(flaggedMessage), null);
	}
}



module.exports =
{
	prepareURLs: prepareCaseSearchPageURLs
};