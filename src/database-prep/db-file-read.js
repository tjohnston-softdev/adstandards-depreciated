/*
	This file is responsible for reading the database definition SQL file.
	The script file is executed in a separate task.
	Used in the 'create' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const fileExists = require("../common/file-management/file-exists");
const fileReadWrite = require("../common/file-management/file-read-write");
const fsDesc = require("../common/interface/general/fs-desc");
const sizeLimits = require("../common/file-management/size-limits");
const storedPaths = require("../../stored-paths");


function readDefinitionFile(dFileCallback)
{
	var fileSpinner = ora("Reading Database Definition").start();
	
	asyncModule.series(
	{
		"definitionExists": fileExists.checkRequired.bind(null, storedPaths.dbDefinition, fsDesc.dbDefinition, sizeLimits.databaseDefinition),
		"scriptContents": fileReadWrite.getContents.bind(null, storedPaths.dbDefinition, fsDesc.dbDefinition)
	},
	function (dbFileError, dbFileResult)
	{
		if (dbFileError !== null)
		{
			fileSpinner.fail("Definition File Error");
			return dFileCallback(dbFileError, null);
		}
		else
		{
			fileSpinner.succeed("Database Definition Read");
			return dFileCallback(null, dbFileResult.scriptContents);
		}
	});
	
}


module.exports =
{
	readDefinition: readDefinitionFile
};