/*
	This file is responsible for initializing the archive database.
	The script file is read in a separate task.
	Used in the 'create' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const dbConnection = require("../common/database/db-connection");
const dbScripts = require("../common/database/db-scripts");


// Main function.
function initializeArchiveDatabase(ddlScriptText, intlArchiveCallback)
{
	var definitionSpinner = ora("Initializing Database").start();
	
	callOpenConnection(ddlScriptText, function (dbDefineError, dbDefineRes)
	{
		if (dbDefineError !== null)
		{
			definitionSpinner.fail("Database Initialization Error");
			return intlArchiveCallback(dbDefineError, null);
		}
		else
		{
			definitionSpinner.succeed("Database Initialized");
			return intlArchiveCallback(null, true);
		}
	});
	
}


// Establishes database connection
function callOpenConnection(dScriptTxt, openConnectionCallback)
{
	dbConnection.openConnection(true, function (openError, openRes)
	{
		if (openError !== null)
		{
			return openConnectionCallback(openError, null);
		}
		else
		{
			callExecutionQuery(dScriptTxt, openRes, openConnectionCallback);
		}
	});
}


// Executes initialization script.
function callExecutionQuery(dsTxt, defConnectionObject, executionQueryCallback)
{
	dbScripts.runDefinition(defConnectionObject, dsTxt, function (eQueryError, eQueryRes)
	{
		if (eQueryError !== null)
		{
			// Script error
			dbConnection.resolveError(defConnectionObject, eQueryError, executionQueryCallback);
		}
		else
		{
			// Successful
			dbConnection.closeConnection(defConnectionObject, executionQueryCallback);
		}
	});
}




module.exports =
{
	initializeArchive: initializeArchiveDatabase
};