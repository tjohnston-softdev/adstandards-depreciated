const asyncModule = require("async");
const clear = require("clear");
const folderIntl = require("./file-prep/folder-intl");
const exportPaths = require("./import-export/export-paths");
const exportInfo = require("./import-export/export-info");
const writeExportFiles = require("./import-export/write-export-files");
const storedPaths = require("../stored-paths");
const exitProgram = require("./common/exit-program");


/*
	Command: export-data
	Description: Exports archive database to .csv files
	Steps:
		* Validate target folder path input.
		* Read 'overwrite' input.
		* Initialize target folder.
		* Verify export file paths.
		* Export Advertiser table data.
		* Export ProductCategory table data.
		* Export MediaType table data.
		* Export CaseFile table data.
*/



function executeDataExportTasks(prepInput)
{
	asyncModule.series(
	[
		folderIntl.initializeTarget.bind(null, prepInput.targetFolderPath),
		exportPaths.verifyPaths.bind(null, prepInput),
		writeExportFiles.writeDataFile.bind(null, prepInput.advertiserPath, exportInfo.advertiser),
		writeExportFiles.writeDataFile.bind(null, prepInput.productCategoryPath, exportInfo.productCategory),
		writeExportFiles.writeDataFile.bind(null, prepInput.mediaTypesPath, exportInfo.mediaType),
		writeExportFiles.writeDataFile.bind(null, prepInput.casesPath, exportInfo.cases)
	],
	function (exportTasksErr, exportTasksRes)
	{
		if (exportTasksErr !== null)
		{
			exitProgram.callExit(exportTasksErr.message);
		}
		else
		{
			exitProgram.callSuccessful("Export Successful");
		}
	});
}



module.exports =
{
	performCommand: exportArchiveDatabase
};