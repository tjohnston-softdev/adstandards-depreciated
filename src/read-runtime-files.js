/*
	Reads database credentials file when program starts.
	This is executed in runtime before the command.
*/
	

const loginIO = require("./misc/login-io");
const loginValidation = require("./misc/login-validation");

requireDatabaseLogin();


function requireDatabaseLogin()
{
	var credFile = loginIO.checkFileExists();
	var credSizeValid = false;
	var credContents = null;
	var credParse = null;
	var credValid = false;
	
	if (credFile.successful === true)
	{
		// Validate file size.
		credSizeValid = loginIO.checkSize(credFile.dataObject);
	}
	
	if (credSizeValid === true)
	{
		// Read file contents.
		credContents = loginIO.getContents();
	}
	
	if (credContents.successful === true)
	{
		// Parse contents into JSON object.
		credParse = loginIO.parseContents(credContents.retrievedData);
	}
	
	if (credParse.successful === true)
	{
		// Validate JSON object.
		credValid = loginValidation.validateCreds(credParse.dataObject);
	}
	
	
	// Erase local variables.
	credFile = null;
	credContents = null;
	credParse = null;
}