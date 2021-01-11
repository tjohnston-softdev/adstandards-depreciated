/*
	This file is responsible for deleting saved report PDF files.
	Used in the 'download-reports' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const reportFolderDelete = require("./sub/report-folder-delete");
const downloadStatusReset = require("./sub/download-status-reset");


// Main function.
function removeCaseReportsFolder(clearToggleEnabled, reportFolderCallback)
{
	if (clearToggleEnabled === true)
	{
		coordinateRemove(reportFolderCallback);
	}
	else
	{
		return reportFolderCallback(null, true);
	}
}


// Deletes report folder and marks all database entries for download.
function coordinateRemove(cRemCallback)
{
	var reportSpinner = ora("Deleting Saved Report Files").start();
	
	asyncModule.parallel(
	[
		reportFolderDelete.deleteExisting.bind(null),
		downloadStatusReset.resetStatus.bind(null)
	],
	function (pRemoveError, pRemoveRes)
	{
		if (pRemoveError !== null)
		{
			reportSpinner.fail("Report Folder Delete Error");
			return cRemCallback(pRemoveError, null);
		}
		else
		{
			reportSpinner.succeed("Report Files Removed");
			return cRemCallback(null, true);
		}
	});
}





module.exports =
{
	removeCaseReports: removeCaseReportsFolder
};