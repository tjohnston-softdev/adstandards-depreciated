const asyncModule = require("async");
const clear = require("clear");
const archiveClear = require("./database-prep/archive-clear");
const folderIntl = require("./file-prep/folder-intl");
const readImportFiles = require("./import-export/read-import-files");
const exitProgram = require("./common/exit-program");



function executeImportPreperationTasks(prepInput)
{
	asyncModule.series(
	{
		"archiveCleared": archiveClear.clearData.bind(null, true),
		"folderReady": folderIntl.initializeTarget.bind(null, prepInput.targetFolderPath),
		"filesFound": importPaths.verifyPaths.bind(null, prepInput)
	},
	function (importPrepErr, importPrepRes)
	{
		if (importPrepErr !== null)
		{
			exitProgram.callExit(importPrepErr.message);
		}
		else
		{
			executeImportDataTasks(prepInput, importPrepRes.filesFound);
		}
	});
}


function executeImportDataTasks(prepInp, foundObject)
{
	var pIgnoreErr = prepInp.ignoreInputErrors;
	
	asyncModule.series(
	[
		readImportFiles.readDataFile.bind(null, prepInp.advertiserPath, foundObject.advertiserData, importInfo.advertiser, pIgnoreErr),
		readImportFiles.readDataFile.bind(null, prepInp.productCategoryPath, foundObject.productData, importInfo.productCategory, pIgnoreErr),
		readImportFiles.readDataFile.bind(null, prepInp.mediaTypesPath, foundObject.mediaData, importInfo.mediaType, pIgnoreErr),
		readImportFiles.readDataFile.bind(null, prepInp.casesPath, foundObject.caseData, importInfo.cases, pIgnoreErr)
	],
	function (importDataErr, importDataRes)
	{
		if (importDataErr !== null)
		{
			exitProgram.callExit(importDataErr.message);
		}
		else
		{
			exitProgram.callSuccessful("Data Imported Successfully");
		}
	});
}



module.exports =
{
	performCommand: importSavedData
};