const asyncModule = require("async");
const writeExportFiles = require("./import-export/write-export-files");
const exitProgram = require("./common/exit-program");



function executeDataExportTasks(prepInput)
{
	asyncModule.series(
	[
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