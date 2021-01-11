/*
	Checks whether a given report file already exists.
	Searches the '../../../reports' folder and children
	Used in '../report-req.js'
*/


const fileNames = require("../../common/file-management/file-names");
const fileSearch = require("../../common/file-management/file-search");
const fileExists = require("../../common/file-management/file-exists");
const fsDesc = require("../../common/interface/general/fs-desc");
const storedPaths = require("../../../stored-paths");


// Main function.
function checkReportFileExists(repFileName, reportFileCallback)
{
	var repSearchSyntax = fileNames.getReportFileSyntax(storedPaths.reportsFolder, repFileName);
	
	// Searches for file from target folder onwards.
	fileSearch.getSavedReport(repSearchSyntax, fsDesc.reportFolder, function (reportSearchErr, reportPathRes)
	{
		if (reportSearchErr !== null)
		{
			// Search error.
			return reportFileCallback(reportSearchErr, null);
		}
		else if (reportPathRes.length > 0)
		{
			// Path found - Verify file.
			handleFileEntry(reportPathRes, reportFileCallback);
		}
		else
		{
			// Path unknown.
			return reportFileCallback(null, false);
		}
	});
}



// Checks whether report file actually exists at retrieved path.
function handleFileEntry(entryPath, repFileCallback)
{
	fileExists.checkOptional(entryPath, fsDesc.reportFile, function (entryErr, entryRes)
	{
		if (entryErr !== null)
		{
			// Path check error.
			return repFileCallback(entryErr, null);
		}
		else
		{
			// Path checked successfully.
			return repFileCallback(null, entryRes);
		}
	});
}





module.exports =
{
	checkReportExists: checkReportFileExists
};