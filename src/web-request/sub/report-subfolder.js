/*
	Decides which subfolder the current report file should be downloaded into.
	This refers to '../../../reports' folder and children.
	Files are sorted into subfolders of limited size to manage entry counts.
	Used in '../report-req.js'
*/


const path = require("path");
const asyncModule = require("async");
const fileSearch = require("../../common/file-management/file-search");
const fsDesc = require("../../common/interface/general/fs-desc");
const valueLimits = require("../../common/value-limits");
const storedPaths = require("../../../stored-paths");



// Main function.
function decideReportFolderPath(repFileName, reportFolderCallback)
{
	var subfolderLoopObject = initializeSubfolderLoop();
	
	// Loops numbered subfolder names until one is available.
	asyncModule.until(
	function (subfolderPassCallback)
	{
		// Checks if subfolder found.
		var pathFound = (subfolderLoopObject.chosenPath.length > 0);
		return subfolderPassCallback(null, pathFound);
	},
	function (subfolderIterationCallback)
	{
		// Check current numbered subfolder name.
		iterateCurrentSubfolder(subfolderLoopObject, subfolderIterationCallback);
	},
	function (sLoopErr, sLoopRes)
	{
		// Loop complete.
		if (sLoopErr !== null)
		{
			return reportFolderCallback(sLoopErr, null);
		}
		else
		{
			return reportFolderCallback(null, subfolderLoopObject.chosenPath);
		}
	});
}



// Checks whether current subfolder has an available slot for file
function iterateCurrentSubfolder(subfolderLoop, subfolderCallback)
{
	// Writes current subfolder name and path.
	var folderName = "group" + subfolderLoop.subfolderID;
	var folderPath = path.join(storedPaths.reportsFolder, folderName);
	var folderSyntax = path.join(folderPath, "*");
	
	// Counts number of files in current subfolder.
	fileSearch.getMatchCount(folderSyntax, fsDesc.reportFolder, function(fileCountErr, fileCountRes)
	{
		if (fileCountErr !== null)
		{
			// Count error.
			return subfolderCallback(fileCountErr, null);
		}
		else if (fileCountRes >= 0 && fileCountRes < valueLimits.fileGroupSize)
		{
			// Subfolder available - Save path and end loop.
			subfolderLoop.chosenPath = folderPath;
			return subfolderCallback(null, true);
		}
		else
		{
			// Subfolder not available - Keep searching.
			subfolderLoop.subfolderID = subfolderLoop.subfolderID + 1;
			return subfolderCallback(null, false);
		}
	});
	
	
}


// Loop object.
function initializeSubfolderLoop()
{
	var intlRes = {};
	
	intlRes["subfolderID"] = 1;
	intlRes["chosenPath"] = "";
	
	return intlRes;
}




module.exports =
{
	decidePath: decideReportFolderPath
};