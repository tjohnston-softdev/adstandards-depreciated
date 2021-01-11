/*
	This file is responsible for removing any existing case data.
	Used in the 'read-cases' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const fileExists = require("../common/file-management/file-exists");
const fileReadWrite = require("../common/file-management/file-read-write");
const fsDesc = require("../common/interface/general/fs-desc");
const sizeLimits = require("../common/file-management/size-limits");
const storedPaths = require("../../stored-paths");
const dbConnection = require("../common/database/db-connection");
const dbScripts = require("../common/database/db-scripts");



// Main function.
function clearExistingCaseData(clearToggleEnabled, clearCasesCallback)
{
	if (clearToggleEnabled === true)
	{
		coordinateClear(clearCasesCallback);
	}
	else
	{
		return clearCasesCallback(null, true);
	}
}


// Coordinate case data clear.
function coordinateClear(clrCaseCallback)
{
	var clearSpinner = ora("Clearing Case Data").start();
	
	readClearScriptFile(function (removeCaseError, removeCaseRes)
	{
		if (removeCaseError !== null)
		{
			clearSpinner.fail("Error Clearing Case Data");
			return clrCaseCallback(removeCaseError, null);
		}
		else
		{
			clearSpinner.succeed("Case Data Cleared");
			return clrCaseCallback(null, true);
		}
	});
	
	
}


// Reads 'clear cases' script file.
function readClearScriptFile(clearCaseFileCallback)
{
	asyncModule.series(
	{
		"clearCaseFileExists": fileExists.checkRequired.bind(null, storedPaths.dbClearCases, fsDesc.dbClearCases, sizeLimits.clearCases),
		"clearScriptContents": fileReadWrite.getContents.bind(null, storedPaths.dbClearCases, fsDesc.dbClearCases)
	},
	function (scriptReadError, scriptReadRes)
	{
		if (scriptReadError !== null)
		{
			return clearCaseFileCallback(scriptReadError, null);
		}
		else
		{
			openDatabaseConnection(scriptReadRes.clearScriptContents, clearCaseFileCallback);
		}
	});
}


// Establishes database connection.
function openDatabaseConnection(clearCaseScriptText, openConnectionCallback)
{
	dbConnection.openConnection(true, function (openError, openRes)
	{
		if (openError !== null)
		{
			return openConnectionCallback(openError, null);
		}
		else
		{
			executeClearCaseScript(clearCaseScriptText, openRes, openConnectionCallback);
		}
	});
}


// Runs 'clear case' script.
function executeClearCaseScript(cScrTxt, clearConnectionObject, executionCallback)
{
	dbScripts.runClearCases(clearConnectionObject, cScrTxt, function (cScriptError, cScriptRes)
	{
		if (cScriptError !== null)
		{
			// Script error.
			dbConnection.resolveError(clearConnectionObject, cScriptError, executionCallback);
		}
		else
		{
			// Successful.
			dbConnection.closeConnection(clearConnectionObject, executionCallback);
		}
	});
}





module.exports =
{
	clearData: clearExistingCaseData
};