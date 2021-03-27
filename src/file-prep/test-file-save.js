/*
	This file is responsible for saving downloaded test files.
	Used in the 'test-http' command.
*/

const asyncModule = require("async");
const ora = require("ora");
const storedPaths = require("../../stored-paths");
const fileReadWrite = require("../common/file-management/file-read-write");
const fsDesc = require("../common/interface/general/fs-desc");


// Main function.
function writeDownloadedTestFiles(downloadedFiles, fileSaveCallback)
{
	var fileSpinner = ora("Saving Files").start();
	
	asyncModule.series(
	[
		handleWrite.bind(null, storedPaths.testPage, downloadedFiles.htmlPage, true, fsDesc.exampleHtmlFile),
		handleWrite.bind(null, storedPaths.testReport, downloadedFiles.pdfFile, false, fsDesc.exampleReportFile)
	],
	function (testSaveErr, testSaveRes)
	{
		if (testSaveErr !== null)
		{
			fileSpinner.fail("Test Files Error");
			return fileSaveCallback(testSaveErr, null);
		}
		else
		{
			fileSpinner.succeed("Test Files Saved");
			return fileSaveCallback(null, true);
		}
	});
	
}

// Save file.
function handleWrite(tFilePath, tFileConts, tFilePlain, tFileDesc, handleCallback)
{
	fileReadWrite.writeContents(tFilePath, tFileConts.retrievedBody, tFilePlain, tFileDesc, function (fwError, fwResult)
	{
		return handleCallback(fwError, fwResult);
	});
}



module.exports =
{
	writeTestFiles: writeDownloadedTestFiles
};