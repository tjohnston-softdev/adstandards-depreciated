/*
	Downloads the Advertisement Case report PDF files in a loop
	Used for the 'download-reports' command.
*/

const path = require("path");
const asyncModule = require("async");
const retryLimits = require("../common/web/retry-limits");
const needleRequest = require("../common/web/needle-request");
const folderTasks = require("../common/file-management/folder-tasks");
const progBars = require("../common/interface/prog-bars");
const fsDesc = require("../common/interface/general/fs-desc");
const progDesc = require("../common/interface/general/prog-desc");
const delayWait = require("./sub/delay-wait");
const reportGroup = require("./sub/report-group");
const savedReportFile = require("./sub/saved-report-file");
const reportSubfolder = require("./sub/report-subfolder");
const reportUpdate = require("./sub/report-update");
const replyOutput = require("./sub/reply-output");


// Main function
function requestCaseReportFiles(totalFileCountNumber, downloadInputObject, caseReportsCallback)
{
	var loopProgressObject = {};
	var barSyntax = "";
	var fileProgressBar = null;
	
	// Initializes loop progress.
	loopProgressObject["overall"] = {"num": 0};										// Progress bar index.
	loopProgressObject["queries"] = {"count": 0, "canContinue": true};				// Query index loop.
	loopProgressObject["files"] = {"index": 0};										// Entry index loop.
	loopProgressObject["total"] = totalFileCountNumber;								// Total files.
	
	// Prepares and displays download progress bar.
	barSyntax = progBars.writeSyntax("Reports Downloaded");
	fileProgressBar = progBars.initializeBar(barSyntax);
	progBars.displayHeader(progDesc.downloadReportFiles);
	displayDownloadProgress(loopProgressObject.total, 0, fileProgressBar);
	
	
	// Download report files loop.
	asyncModule.whilst(
	function (queryPassCallback)
	{
		// Checks whether there are additional report entries to read.
		return queryPassCallback(null, loopProgressObject.queries.canContinue);
	},
	function (queryIterationCallback)
	{
		// Read current report entry group.
		callGroupQuery(downloadInputObject, loopProgressObject, fileProgressBar, queryIterationCallback);
	},
	function (overallLoopError, overallLoopRes)
	{
		// Loop complete.
		
		fileProgressBar.stop();
		
		if (overallLoopError !== null)
		{
			return caseReportsCallback(overallLoopError, null);
		}
		else
		{
			return caseReportsCallback(null, true);
		}
	});
}


// Queries current group of report entries.
function callGroupQuery(downloadInputObj, loopProgressObj, fileProgress, gQueryCallback)
{
	reportGroup.getGroup(loopProgressObj.queries, function (gQueryErr, gQueryRes)
	{
		if (gQueryErr !== null)
		{
			// Query error.
			return gQueryCallback(gQueryErr, null);
		}
		else if (gQueryRes.length > 0)
		{
			// Results found - Read entries.
			callGroupContents(gQueryRes, downloadInputObj, loopProgressObj, fileProgress, gQueryCallback);
		}
		else
		{
			// No more results - Loop complete.
			loopProgressObj.queries.canContinue = false;
			return gQueryCallback(null, false);
		}
	});
}


// Reads queried report entries from current group.
function callGroupContents(reportEntryArray, downloadInput, loopProgress, fileProgBarObject, gContentsCallback)
{
	var currentEntryObject = {};
	var currentURL = "";
	var currentFileName = "";
	
	// Resets file index.
	loopProgress.files.index = 0;
	
	// Loop entries.
	asyncModule.whilst(
	function (contentPassCallback)
	{
		// Checks if entry loop complete.
		var passStatus = (loopProgress.files.index >= 0 && loopProgress.files.index < reportEntryArray.length);
		return contentPassCallback(null, passStatus);
	},
	function (contentIterationCallback)
	{
		// Download current report.
		currentEntryObject = reportEntryArray[loopProgress.files.index];
		currentURL = currentEntryObject.downloadLink;
		currentFileName = currentEntryObject.caseName + ".pdf";
		
		callReportExists(currentURL, currentFileName, downloadInput, loopProgress, fileProgBarObject, contentIterationCallback);
	},
	function (contentLoopErr, contentLoopRes)
	{
		// File loop complete.
		
		if (contentLoopErr !== null)
		{
			// Error flagged.
			return gContentsCallback(contentLoopErr, null);
		}
		else
		{
			// Update entry status.
			markSuccessfulFiles(reportEntryArray, loopProgress.queries, gContentsCallback);
		}
	});
	
}


// Marks the current group of report entries as downloaded.
function markSuccessfulFiles(reportEntryArr, queryLoop, markFilesCallback)
{
	reportUpdate.updateDownloadStatus(reportEntryArr, function (markErr, markRes)
	{
		if (markErr !== null)
		{
			// Update query error.
			return markFilesCallback(markErr, null);
		}
		else
		{
			// Increment query index and continue reading groups.
			queryLoop.count += 1;
			return markFilesCallback(null, true);
		}
	});
}



// Checks whether the target file path already exists before downloading report.
function callReportExists(downloadURLText, fileNameText, downloadInpObject, loopProgObject, fileProgBarObj, repExistsCallback)
{
	savedReportFile.checkReportExists(fileNameText, function (rExistErr, rExistRes)
	{
		if (rExistErr !== null)
		{
			// Exist check error.
			return repExistsCallback(rExistErr, null);
		}
		else if (rExistRes === true && downloadInpObject.overwriteExistingFiles === true)
		{
			// File already exists - Can overwrite.
			callReportSubfolder(downloadURLText, fileNameText, downloadInpObject, loopProgObject, fileProgBarObj, repExistsCallback);
		}
		else if (rExistRes === true)
		{
			// File already exists - Skip without overwrite.
			incrementProgress(loopProgObject, fileProgBarObj, repExistsCallback);
		}
		else
		{
			// File does not exist - Download as normal.
			callReportSubfolder(downloadURLText, fileNameText, downloadInpObject, loopProgObject, fileProgBarObj, repExistsCallback);
		}
	});
}


// Determines which subfolder the report file will be downloaded into.
function callReportSubfolder(downloadURLTxt, fileNameTxt, downloadInpObj, loopProgObj, fileProgBar, repSubfolderCallback)
{
	reportSubfolder.decidePath(fileNameTxt, function (rSubErr, rSubRes)
	{
		if (rSubErr !== null)
		{
			// Error making decision.
			return repSubfolderCallback(rSubErr, null);
		}
		else
		{
			// Subfolder decided.
			callDownload(downloadURLTxt, rSubRes, fileNameTxt, downloadInpObj, loopProgObj, fileProgBar, repSubfolderCallback);
		}
	});
}


// Prepares chosen subfolder and downloads report file.
function callDownload(tDownloadLink, tFolderPath, tFileName, downloadInp, loopProg, fileProg, downloadCallback)
{
	asyncModule.series(
	{
		"folderPrepared": folderTasks.preparePath.bind(null, tFolderPath, fsDesc.reportFolder),
		"requestOutcome": needleRequest.getFile.bind(null, tDownloadLink, "Case File", retryLimits.caseFile, false)
	},
	function (dlErr, dlRes)
	{
		if (dlErr !== null)
		{
			// Error found.
			return downloadCallback(dlErr, null);
		}
		else if (dlRes.requestOutcome.retryAfter > 0 && downloadInp.allowRequestDelay === true)
		{
			// Too many requests - Wait for delay before trying again.
			handleDelay(loopProg, dlRes.requestOutcome.retryAfter, fileProg, downloadCallback);
		}
		else if (dlRes.requestOutcome.retryAfter > 0)
		{
			// Delay not allowed.
			needleRequest.displayTooManyRequests(downloadCallback);
		}
		else
		{
			// Write full path and save file.
			var outputPathString = path.join(tFolderPath, tFileName);
			callReportFileSave(loopProg, outputPathString, dlRes.requestOutcome.retrievedBody, fileProg, downloadCallback);
		}
	});
}


// Used to enforce delay after 'Too Many Requests' error.
function handleDelay(loopObject, delayLength, pFileBar, delayCallback)
{
	// Hides download progress bar for now.
	pFileBar.stop();
	
	delayWait.enforceRequestDelay(delayLength, function()
	{
		// Delay finished - Show download progress bar and continue.
		progBars.displayHeader(progDesc.downloadReportFiles);
		displayDownloadProgress(loopObject.total, loopObject.overall.num, pFileBar);
		return delayCallback(null, true);
	});
	
}

// Saves report file after it has been downloaded.
function callReportFileSave(loopObject, completeFilePath, reportData, pFile, repFileSaveCallback)
{
	replyOutput.saveFile(reportData, completeFilePath, fsDesc.reportFile, false, function (rSaveErr, rSaveRes)
	{
		if (rSaveErr !== null)
		{
			// File save error
			return repFileSaveCallback(rSaveErr, null);
		}
		else
		{
			// Save successful.
			incrementProgress(loopObject, pFile, repFileSaveCallback);
		}
	});
}



// Increments file download progress.
function incrementProgress(loopObj, pbFile, incrementCallback)
{
	loopObj.overall.num += 1;
	loopObj.files.index += 1;
	pbFile.increment();
	return incrementCallback(null, true);
}



// Displays download progress bar at current value.
function displayDownloadProgress(repLinkCount, pNum, pbFile)
{
	pbFile.start(repLinkCount, pNum, null);
}




module.exports =
{
	requestCaseFiles: requestCaseReportFiles
};