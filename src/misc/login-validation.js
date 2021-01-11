/*
	Validates database credentials login file (../../db-creds.json)
	Used in: '../read-runtime-files.js'
*/


const dbConnection = require("../common/database/db-connection");
const valueType = require("../common/value-type");
const loginErrorText = require("../common/database/errors/login-error-text");


// Main function
function validateLoginCredentials(dbCredObject)
{
	var objectValid = false;
	
	var hostValid = false;
	var userValid = false;
	var passValid = false;
	
	var validationResult = false;
	
	// Check base object type.
	objectValid = handleBaseObject(dbCredObject);
	
	
	if (objectValid === true)
	{
		// Checks individual properties.
		hostValid = handleRequiredString(dbCredObject, "host");
		userValid = handleRequiredString(dbCredObject, "user");
		passValid = handlePassword(dbCredObject);
	}
	
	
	if (hostValid === true && userValid === true && passValid === true)
	{
		// Valid login - Save to memory.
		dbConnection.initializeCreds(dbCredObject);
		validationResult = true;
	}
	
	return validationResult;
}



// JSON object type.
function handleBaseObject(cObject)
{
	var correctType = valueType.checkObject(cObject);
	var flaggedMessage = "";
	
	if (correctType !== true)
	{
		flaggedMessage = loginErrorText.writeInvalidObject();
		throw new Error(flaggedMessage);
	}
	
	return correctType;
}


// Required string property.
function handleRequiredString(cObject, pName)
{
	var givenValue = cObject[pName];
	var correctType = valueType.checkString(givenValue);
	var handleRes = false;
	var flaggedMessage = "";
	
	if (correctType === true && givenValue.length > 0)
	{
		handleRes = true;
	}
	else
	{
		handleRes = false;
		flaggedMessage = loginErrorText.writeMissingString(pName);
		throw new Error(flaggedMessage);
	}
	
	return handleRes;
}



// Password string property (optional)
function handlePassword(cObject)
{
	var correctType = valueType.checkString(cObject.password);
	var handleRes = true;
	
	if (correctType !== true)
	{
		cObject.password = "";
	}
	
	return handleRes;
}





module.exports =
{
	validateCreds: validateLoginCredentials
};