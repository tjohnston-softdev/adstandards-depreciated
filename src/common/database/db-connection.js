// This file contains database connection functions and stores login credentials.

const mysql = require("mysql");
const errorText = require("./errors/db-error-text");
var databaseCredsObject = null;


// Saves database credentials to memory.
function initializeCredentialsData(enteredCreds)
{
	databaseCredsObject = {};
	
	databaseCredsObject["host"] = enteredCreds.host;
	databaseCredsObject["user"] = enteredCreds.user;
	databaseCredsObject["password"] = enteredCreds.password;
}



// Opens database connection.
function openDatabaseConnection(scriptMode, connectionCallback)
{
	var preparedSettings = prepareConnectionSettings(scriptMode);
	var connRes = mysql.createConnection(preparedSettings);
	var flaggedMessage = "";
	
	connRes.connect(function(connError)
	{
		if (connError !== undefined && connError !== null)
		{
			flaggedMessage = errorText.writeConnection(connError.address, connError.port);
			return connectionCallback(new Error(flaggedMessage), null);
		}
		else
		{
			// Database connection object.
			return connectionCallback(null, connRes);
		}
	});
}


// Closes database connection with successful result.
function closeDatabaseConnection(finishedConnection, endCallback)
{
	var flaggedMessage = "";
	
	finishedConnection.end(function (disconnectError)
	{
		if (disconnectError !== undefined && disconnectError !== null)
		{
			flaggedMessage = errorText.writeDisconnect();
			return endCallback(new Error(flaggedMessage), null);
		}
		else
		{
			// Connection closed successfully.
			return endCallback(null, true);
		}
	});
}


// Aborts database connection after an error occurs.
function resolveConnectionError(badConnection, flaggedError, resolveCallback)
{
	var flaggedMessage = "";
	
	badConnection.end(function (disconnectError)
	{
		if (disconnectError !== undefined && disconnectError !== null)
		{
			// Error aborting connection.
			flaggedMessage = errorText.writeDisconnect();
			return resolveCallback(new Error(flaggedMessage), null);
		}
		else
		{
			// Connection aborted successfully. Return flagged error.
			return resolveCallback(flaggedError, null);
		}
	});
}



// Prepares database connection settings using stored credentials.
function prepareConnectionSettings(scpMode)
{
	var definitionText = JSON.stringify(databaseCredsObject);
	var settingsRes = JSON.parse(definitionText);
	
	if (scpMode === true)
	{
		// Executing script file. Allow multiple commands at once.
		settingsRes["multipleStatements"] = true;
	}
	else
	{
		// Executing data query. Connect to archive.
		settingsRes["database"] = "adstandardsArchive";
	}
	
	return settingsRes;
}




module.exports =
{
	initializeCreds: initializeCredentialsData,
	openConnection: openDatabaseConnection,
	closeConnection: closeDatabaseConnection,
	resolveError: resolveConnectionError
};