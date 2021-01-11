const asyncModule = require("async");
const clear = require("clear");
const inpDownload = require("./input/inp-download");
const reportClear = require("./file-prep/report-clear");
const folderIntl = require("./file-prep/folder-intl");
const reportCount = require("./database-prep/report-count");
const reportReq = require("./web-request/report-req");
const tickPlaceholders = require("./common/interface/tick-placeholders");
const exitProgram = require("./common/exit-program");



/*
	Command: download-reports
	Description: Downloads known case report .pdf files from adstandards.
	Steps:
		* Validate console input.
		* Remove existing report PDF files. (optional)
		* Initialize reports root folder.
		* Retrieve number of advertisement case entries with report files.
		* Download report files.
*/




function downloadCaseReportFiles(cmdOptions)
{
	var preparedInputObject = inpDownload.prepareArgs(cmdOptions);
	clear();
	
	asyncModule.series(
	{
		"reportFolderCleared": reportClear.removeCaseReports.bind(null, preparedInputObject.removeExistingFiles),
		"reportFolderInitialized": folderIntl.initializeReports.bind(null),
		"entryCount": reportCount.getCount.bind(null)
	},
	function (downloadPrepError, downloadPrepRes)
	{
		if (downloadPrepError !== null)
		{
			exitProgram.callExit(downloadPrepError.message);
		}
		else
		{
			executeReportDownloadTasks(preparedInputObject, downloadPrepRes.entryCount);
		}
	});
}



function executeReportDownloadTasks(prepInput, knownFileCount)
{
	reportReq.requestCaseFiles(knownFileCount, prepInput, function(downloadTaskError, downloadTaskRes)
	{
		if (downloadTaskError !== null)
		{
			tickPlaceholders.displayFailed("Report Download Error");
			exitProgram.callExit(downloadTaskError.message);
		}
		else
		{
			tickPlaceholders.displaySuccessful("Report Files Downloaded");
			exitProgram.callSuccessful();
		}
	});
}




module.exports =
{
	performCommand: downloadCaseReportFiles
};