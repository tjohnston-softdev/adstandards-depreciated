// Functions write database credentials error text (db-creds.json)


// Invalid JSON object.
function writeInvalidObjectText()
{
	var writeRes = "Database credentials JSON is not a valid object.";
	return writeRes;
}


// Missing string property.
function writeMissingStringText(vProp)
{
	var writeRes = "";
	
	writeRes += "Invalid database credentials - ";
	writeRes += vProp;
	writeRes += " string is missing.";
	
	return writeRes;
}



module.exports =
{
	writeInvalidObject: writeInvalidObjectText,
	writeMissingString: writeMissingStringText
};