// Initializes validation result object for when validating a set of imported data rows.

function initializeImportValidationObject()
{
	var intlRes = {};
	
	intlRes["canContinue"] = true;
	intlRes["invalidData"] = "";
	
	return intlRes;
}



module.exports =
{
	initializeObject: initializeImportValidationObject
};