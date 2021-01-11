/*
	This file is responsible for clearing archive data
	Used in the commands 'clear', 'read-lists', and 'import-data'
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



// Main function
function clearExistingArchiveData(clearToggleEnabled, clearArchiveCallback)
{
	if (clearToggleEnabled === true)
	{
		coordinateClear(clearArchiveCallback);
	}
	else
	{
		return clearArchiveCallback(null, true);
	}
}


// Coordinate archive clear.
function coordinateClear(clraCallback)
{
	var clearSpinner = ora("Clearing Archive Data").start();
	
	readClearScriptFile(function (dbClearError, dbClearResult)
	{
		if (dbClearError !== null)
		{
			clearSpinner.fail("Archive Clear Error");
			return clraCallback(dbClearError, null);
		}
		else
		{
			clearSpinner.succeed("Archive Cleared");
			return clraCallback(null, true);
		}
	});
	
}


// Read clear script file.
function readClearScriptFile(clearFileCallback)
{
	asyncModule.series(
	{
		"clearScriptExists": fileExists.checkRequired.bind(null, storedPaths.dbClearAll, fsDesc.dbClearAll, sizeLimits.clearAll),
		"scriptContents": fileReadWrite.getContents.bind(null, storedPaths.dbClearAll, fsDesc.dbClearAll)
	},
	function (scriptReadError, scriptReadRes)
	{
		if (scriptReadError !== null)
		{
			return clearFileCallback(scriptReadError, null);
		}
		else
		{
			openClearConnection(scriptReadRes.scriptContents, clearFileCallback);
		}
	});
}


// Opens database connection.
function openClearConnection(cScriptText, clearConnectionCallback)
{
	dbConnection.openConnection(true, function (openError, openRes)
	{
		if (openError !== null)
		{
			return clearConnectionCallback(openError, null);
		}
		else
		{
			callDeleteQuery(cScriptText, openRes, clearConnectionCallback);
		}
	});
}


// Runs clear script.
function callDeleteQuery(cTxt, clearConnectionObject, deleteQueryCallback)
{
	dbScripts.runClearAll(clearConnectionObject, cTxt, function (dQueryError, dQueryRes)
	{
		if (dQueryError !== null)
		{
			// Script error.
			dbConnection.resolveError(clearConnectionObject, dQueryError, deleteQueryCallback);
		}
		else
		{
			// Successful
			dbConnection.closeConnection(clearConnectionObject, deleteQueryCallback);
		}
	});
}



module.exports =
{
	clearData: clearExistingArchiveData
};