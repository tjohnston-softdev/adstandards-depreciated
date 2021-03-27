// Initializes validation result object for when validating a set of imported data rows.

function initializeImportValidationObject()
{
	var intlRes = {canContinue: true, invalidData: ""};
	return intlRes;
}



module.exports =
{
	initializeObject: initializeImportValidationObject
};