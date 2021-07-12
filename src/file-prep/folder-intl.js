// These functions are used to create folders.

const ora = require("ora");
const storedPaths = require("../../stored-paths");
const folderTasks = require("../common/file-management/folder-tasks");
const fsDesc = require("../common/interface/general/fs-desc");


// Saved advertisement case page HTML files.
function initializePagesCacheFolder(pagesCallback)
{
	var cacheSpinner = ora("Initializing Page Folder").start();
	
	folderTasks.preparePath(storedPaths.pageFolder, fsDesc.pagesFolder, function (prepErr, prepRes)
	{
		if (prepErr !== null)
		{
			cacheSpinner.fail("Page Folder Error");
			return pagesCallback(prepErr, null);
		}
		else
		{
			cacheSpinner.succeed("Page Folder Initialized");
			return pagesCallback(null, true);
		}
	});
}


// Saved case report PDF files.
function initializeReportFolder(reportFolderCallback)
{
	var reportFolderSpinner = ora("Initializing Report Folder").start();
	
	folderTasks.preparePath(storedPaths.reportsFolder, fsDesc.reportFolder, function (rPathErr, rPathRes)
	{
		if (rPathErr !== null)
		{
			reportFolderSpinner.fail("Report Folder Error");
			return reportFolderCallback(rPathErr, null);
		}
		else
		{
			reportFolderSpinner.succeed("Report Folder Initialized");
			return reportFolderCallback(null, true);
		}
	});
}


// HTTP test folder.
function initializeHttpTestFolder(testFolderCallback)
{
	var testFolderSpinneer = ora("Initializing Output Folder").start();
	
	folderTasks.preparePath(storedPaths.testDownloadFolder, "HTTP Test Folder", function (tPathErr, tPathRes)
	{
		if (tPathErr !== null)
		{
			testFolderSpinneer.fail("Output Folder Error");
			return testFolderCallback(tPathErr, null);
		}
		else
		{
			testFolderSpinneer.succeed("Output Folder Initialized");
			return testFolderCallback(null, true);
		}
	});
}




module.exports =
{
	initializePages: initializePagesCacheFolder,
	initializeReports: initializeReportFolder
	initializeHttpTest: initializeHttpTestFolder
};