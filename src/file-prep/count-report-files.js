/*
	This file is responsible for counting the number of saved report PDF files.
	Referring to actual files and not database entries.
	Used in the 'log-database' command.
*/

const ora = require("ora");
const storedPaths = require("../../stored-paths");
const fileNames = require("../common/file-management/file-names");
const fileSearch = require("../common/file-management/file-search");
const fsDesc = require("../common/interface/general/fs-desc");


// Main function.
function countSavedReportFiles(savedReportFilesCallback)
{
	var reportSpinner = ora("Counting Saved Report Files").start();
	
	coordinateFileCount(function (retrievalError, retrievalResult)
	{
		if (retrievalError !== null)
		{
			reportSpinner.fail("Error counting Saved Report Files");
			return savedReportFilesCallback(retrievalError, null);
		}
		else
		{
			reportSpinner.succeed("Saved Report Files Counted");
			return savedReportFilesCallback(null, retrievalResult);
		}
	});
}


// Search for PDF files.
function coordinateFileCount(csrCallback)
{
	var targetSyntaxDefinition = fileNames.getReportNestSyntax(storedPaths.reportsFolder);
	
	fileSearch.getMatchCount(targetSyntaxDefinition, fsDesc.reportFolder, function (countErr, countRes)
	{
		return csrCallback(countErr, countRes);
	});
}




module.exports =
{
	countFiles: countSavedReportFiles
};