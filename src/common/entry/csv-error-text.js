// Functions write error messages related to parsing .csv files.


// General error for unknown exceptions.
function writeGeneralErrorText(vDesc)
{
	var writeRes = "";
	
	writeRes += "Error executing ";
	writeRes += vDesc;
	writeRes += " CSV file parse.";
	
	return writeRes;
}


// Parses error object into readable message.
function writeParseErrorText(vDesc, vErrorObject)
{
	var writeRes = "";
	
	writeRes += "Error parsing ";
	writeRes += vDesc;
	writeRes += " CSV file.\n"
	
	writeRes += "Type: ";
	writeRes += vErrorObject.code;
	writeRes += "\n";
	
	writeRes += "Details: ";
	writeRes += vErrorObject.message;
	
	return writeRes;
}



module.exports =
{
	writeGeneralError: writeGeneralErrorText,
	writeParseError: writeParseErrorText
};