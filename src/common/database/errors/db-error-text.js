// Functions write database error messages.


// Database connection.
function writeConnectionErrorText(vAddress, vPort)
{
	var writeRes = "";
	
	writeRes += "Error connecting to database at ";
	writeRes += vAddress;
	writeRes += ":";
	writeRes += vPort;
	
	return writeRes;
}


// Terminate connection.
function writeDisconnectErrorText()
{
	var writeRes = "Error closing database connection.";
	return writeRes;
}


// Begin transaction.
function writeTransactionError()
{
	var writeRes = "Error initializing database transaction.";
	return writeRes;
}


// Commit transaction.
function writeSaveError()
{
	var writeRes = "Error saving changes to database.";
	return writeRes;
}


// Script execution
function writeScriptExecutionError(vDesc, vErrorObject)
{
	var fullContext = "executing " + vDesc + " script";
	var writeRes = getMysqlErrorText(fullContext, vErrorObject);
	return writeRes;
}


// INSERT data query
function writeInsertError(vDesc, vErrorObject)
{
	var fullContext = "inserting " + vDesc + " data";
	var writeRes = getMysqlErrorText(fullContext, vErrorObject);
	return writeRes;
}


// SELECT data query
function writeSelectError(vDesc, vErrorObject)
{
	var fullContext = "retrieving " + vDesc + " data";
	var writeRes = getMysqlErrorText(fullContext, vErrorObject);
	return writeRes;
}


// Count rows query
function writeCountError(vDesc, vErrorObject)
{
	var fullContext = "counting " + vDesc + " rows";
	var writeRes = getMysqlErrorText(fullContext, vErrorObject);
	return writeRes;
}


// UPDATE data query
function writeUpdateError(vDesc, vErrorObject)
{
	var fullContext = "updating " + vDesc + " rows";
	var writeRes = getMysqlErrorText(fullContext, vErrorObject);
	return writeRes;
}




// Parses a MySQL error object into a readable message with a given context.
function getMysqlErrorText(msContext, msErrorObject)
{
	var formattedError = "";
	
	formattedError += "Error ";
	formattedError += msContext;
	formattedError += "\n";
	
	formattedError += "Type: ";
	formattedError += msErrorObject.code;
	formattedError += " (";
	formattedError += msErrorObject.errno;
	formattedError += ")";
	formattedError += "\n";
	
	formattedError += "Details: ";
	formattedError += msErrorObject.sqlMessage;
	
	return formattedError;
}




module.exports =
{
	writeConnection: writeConnectionErrorText,
	writeDisconnect: writeDisconnectErrorText,
	writeTransaction: writeTransactionError,
	writeSave: writeSaveError,
	writeScriptExecution: writeScriptExecutionError,
	writeInsert: writeInsertError,
	writeSelect: writeSelectError,
	writeCount: writeCountError,
	writeUpdate: writeUpdateError
};