// Functions used for executing database script files.

const dbErrorText = require("./errors/db-error-text");


// Database definition.
function runDatabaseDefinitionScript(connObj, scriptContents, definitionCallback)
{
	handleScriptExecution(connObj, scriptContents, "database definition", definitionCallback);
}


// Clear existing data.
function runDatabaseClearAllScript(connObj, scriptContents, clearScriptCallback)
{
	handleScriptExecution(connObj, scriptContents, "clear database", clearScriptCallback);
}


// Clear existing cases.
function runDatabaseClearCasesScript(connObj, scriptContents, clearCasesScriptCallback)
{
	handleScriptExecution(connObj, scriptContents, "clear archived cases", clearCasesScriptCallback);
}



// Script execution function.
function handleScriptExecution(cObject, sContents, sDescription, scriptExecutionCallback)
{
	var flaggedMessage = "";
	
	cObject.query(sContents, function (execError)
	{
		if (execError !== undefined && execError !== null)
		{
			flaggedMessage = dbErrorText.writeScriptExecution(sDescription, execError);
			return scriptExecutionCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return scriptExecutionCallback(null, true);
		}
	});
	
}




module.exports =
{
	runDefinition: runDatabaseDefinitionScript,
	runClearAll: runDatabaseClearAllScript,
	runClearCases: runDatabaseClearCasesScript
};