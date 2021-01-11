/*
	Downloads the Advertisement Cases list pages in a loop
	Used for the 'download-pages' command.
	The landing page has already been downloaded.
*/


const path = require("path");
const asyncModule = require("async");
const retryLimits = require("../common/web/retry-limits");
const axiosRequest = require("../common/web/axios-request");
const fileNames = require("../common/file-management/file-names");
const fileExists = require("../common/file-management/file-exists");
const progBars = require("../common/interface/prog-bars");
const fsDesc = require("../common/interface/general/fs-desc");
const webDesc = require("../common/interface/general/web-desc");
const progDesc = require("../common/interface/general/prog-desc");
const storedPaths = require("../../stored-paths");
const delayWait = require("./sub/delay-wait");
const replyOutput = require("./sub/reply-output");


// Main function
function requestCasePages(retrievedLinks, downloadInputObject, searchPageCallback)
{
	var barSyntax = "";
	var fileProgressBar = null;
	
	var loopIndexObject = {"num": 0};
	var currentPageNumber = -1;
	var currentURL = "";
	var currentFileName = "";
	var currentFilePath = "";
	
	// Prepares and displays download progress bar.
	barSyntax = progBars.writeSyntax("Pages Downloaded");
	fileProgressBar = progBars.initializeBar(barSyntax);
	progBars.displayHeader(progDesc.downloadSearchPage);
	displayDownloadProgress(retrievedLinks.length, 1, fileProgressBar);
	
	
	// Download pages loop.
	asyncModule.whilst(
	function (passCallback)
	{
		// Checks if loop can continue.
		var passStatus = (loopIndexObject.num >= 0 && loopIndexObject.num < retrievedLinks.length);
		return passCallback(null, passStatus);
	},
	function (iterationCallback)
	{
		// Download current page.
		currentPageNumber = loopIndexObject.num + 2;
		currentURL = retrievedLinks[loopIndexObject.num];
		currentFileName = fileNames.writePage(currentPageNumber);
		currentFilePath = path.join(storedPaths.pageFolder, currentFileName);
		
		callPageFile(loopIndexObject, currentURL, currentFilePath, downloadInputObject, retrievedLinks.length, fileProgressBar, iterationCallback);
	},
	function (loopError, loopResult)
	{
		// Loop complete.
		
		fileProgressBar.stop();
		
		if (loopError !== null)
		{
			return searchPageCallback(loopError, null);
		}
		else
		{
			return searchPageCallback(null, true);
		}
	});
	
}


// Checks whether the target file path already exists before downloading page.
function callPageFile(loopIndexObj, pageLinkString, outputPathString, downloadInput, totalLinkCount, fileProgBar, pageFileCallback)
{
	fileExists.checkOptional(outputPathString, fsDesc.searchPageFile, function (pExistErr, pExistRes)
	{
		if (pExistErr !== null)
		{
			// Exist check error.
			return pageFileCallback(pExistErr, null);
		}
		else if (pExistRes === true && downloadInput.overwriteExistingFiles === true)
		{
			// Page already exists - Can overwrite.
			callDownload(loopIndexObj, pageLinkString, outputPathString, downloadInput.allowRequestDelay, totalLinkCount, fileProgBar, pageFileCallback);
		}
		else if (pExistRes === true)
		{
			// Page already exists - Skip without overwrite.
			incrementProgress(loopIndexObj, fileProgBar, pageFileCallback);
		}
		else
		{
			// Page does not exist - Download as normal.
			callDownload(loopIndexObj, pageLinkString, outputPathString, downloadInput.allowRequestDelay, totalLinkCount, fileProgBar, pageFileCallback);
		}
	});
}



// Downloads page file from given URL.
function callDownload(loopIndex, pageLinkStr, outputPathStr, useDelay, linkCount, fileBar, downloadCallback)
{
	axiosRequest.getFile(pageLinkStr, webDesc.casesPage, retryLimits.casePage, true, function (dlErr, dlRes)
	{
		if (dlErr !== null)
		{
			// HTTP request error.
			return downloadCallback(dlErr, null);
		}
		else if (dlRes.retryAfter > 0 && useDelay === true)
		{
			// Too many requests - Wait for delay before trying again.
			handleDelay(loopIndex, dlRes.retryAfter, linkCount, fileBar, downloadCallback);
		}
		else if (dlRes.retryAfter > 0)
		{
			// Delay not allowed.
			axiosRequest.displayTooManyRequests(downloadCallback);
		}
		else
		{
			// Save page file.
			callPageFileSave(loopIndex, outputPathStr, dlRes.retrievedBody, fileBar, downloadCallback);
		}
	});
}


// Saves page file after it has been downloaded.
function callPageFileSave(loopInd, completeFilePath, requestedHtmlData, pFileBar, pFileSaveCallback)
{
	replyOutput.saveFile(requestedHtmlData, completeFilePath, "", true, function (pSaveErr, pSaveRes)
	{
		if (pSaveErr !== null)
		{
			// File save error.
			return pFileSaveCallback(pSaveErr, null);
		}
		else
		{
			// Save successful.
			incrementProgress(loopInd, pFileBar, pFileSaveCallback);
		}
	});
}


// Used to enforce delay after 'Too Many Requests' error.
function handleDelay(loopInd, delayLength, cLinks, pFileBar, delayCallback)
{
	// Hides download progress bar for now.
	pFileBar.stop();
	
	
	delayWait.enforceRequestDelay(delayLength, function()
	{
		// Delay finished - Show download progress bar and continue.
		var updatedPageNumber = loopInd.num + 1;
		progBars.displayHeader(progDesc.downloadSearchPage);
		displayDownloadProgress(cLinks, updatedPageNumber, pFileBar);
		return delayCallback(null, true);
	});
	
}


// Increments page loop index and download progress bar.
function incrementProgress(incrementObject, pbFile, incrementCallback)
{
	incrementObject.num += 1;
	pbFile.increment();
	return incrementCallback(null, true);
}


// Displays download progress bar at current value.
function displayDownloadProgress(retLinkCount, pNum, pbFile)
{
	var totalPages = retLinkCount + 1;
	pbFile.start(totalPages, pNum, null);
}


module.exports =
{
	requestPages: requestCasePages
};