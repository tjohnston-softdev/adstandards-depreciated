// Functions write error text related to input validation.


// Incorrect value type.
function writeIncorrectTypeText(vDesc, vType)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " must be a valid ";
	writeRes += vType;
	
	return writeRes;
}


// String too long.
function writeStringTooLongText(vDesc, vMaxLength)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " length cannot be longer than ";
	writeRes += vMaxLength;
	writeRes += " characters.";
	
	return writeRes;
}


// Number range.
function writeNumberRangeText(vDesc, vMinValue, vMaxValue)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " must be between ";
	writeRes += vMinValue;
	writeRes += " and ";
	writeRes += vMaxValue;
	
	return writeRes;
}


// Empty value.
function writeEmptyText(vDesc)
{
	var writeRes = vDesc + " cannot be empty.";
	return writeRes;
}


// String already taken.
function writeStringAlreadyTakenText(vDesc, vTakenItem)
{
	var writeRes = "";
	
	writeRes += "The ";
	writeRes += vDesc;
	writeRes += " item '";
	writeRes += vTakenItem;
	writeRes += "' is already taken.";
	
	return writeRes;
}


// Page number parameter missing.
function writePageMissingText(vDesc)
{
	var writeRes = "Page number parameter is missing from " + vDesc;
	return writeRes;
}


module.exports =
{
	writeIncorrectType: writeIncorrectTypeText,
	writeStringTooLong: writeStringTooLongText,
	writeNumberRange: writeNumberRangeText,
	writeEmpty: writeEmptyText,
	writeStringAlreadyTaken: writeStringAlreadyTakenText,
	writePageMissing: writePageMissingText
};