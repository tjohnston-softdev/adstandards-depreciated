const asyncModule = require("async");
const clear = require("clear");
const inpUnknown = require("./input/inp-unknown");
const unkFileCheck = require("./misc/unk-file-check");
const unkFileWrite = require("./misc/unk-file-write");
const exitProgram = require("./common/exit-program");


/*
	Command: unknown
	Description: Exports case entries with missing advertiser, product, etc to a .csv file.
	Steps:
		* Validate output file path.
		* Verify output path.
		* Query matching rows and write to output.
*/




function getUnknownCaseData(cmdOutputPath, cmdOptions)
{
	var preparedInputObject = inpUnknown.prepareArgs(cmdOutputPath, cmdOptions);
	
	if (preparedInputObject.valid === true)
	{
		clear();
		executeExportTasks(preparedInputObject);
	}
	
}



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