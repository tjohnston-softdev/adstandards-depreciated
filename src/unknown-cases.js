const asyncModule = require("async");
const unkFileWrite = require("./misc/unk-file-write");



function executeExportTasks(prepInp)
{
	asyncModule.series(
	[
		unkFileCheck.verifyFilePath.bind(null, prepInp.targetOutputPath, prepInp.overwriteExistingFile),
		unkFileWrite.writeSpreadsheet.bind(null, prepInp.targetOutputPath)
	],
	function (exportTasksErr, exportTasksRes)
	{
		console.log("");
	});
}



module.exports =
{
	performCommand: getUnknownCaseData
};