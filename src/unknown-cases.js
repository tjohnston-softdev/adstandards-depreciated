const asyncModule = require("async");
const unkFileCheck = require("./misc/unk-file-check");
const unkFileWrite = require("./misc/unk-file-write");
const exitProgram = require("./common/exit-program");



function executeExportTasks(prepInp)
{
	asyncModule.series(
	[
		unkFileCheck.verifyFilePath.bind(null, prepInp.targetOutputPath, prepInp.overwriteExistingFile),
		unkFileWrite.writeSpreadsheet.bind(null, prepInp.targetOutputPath)
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
	performCommand: getUnknownCaseData
};