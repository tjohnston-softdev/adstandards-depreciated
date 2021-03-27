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


// Number already taken.
function writeNumberAlreadyTakenText(vDesc, vTakenNumber)
{
	var writeRes = "";
	
	writeRes += "The ";
	writeRes += vDesc;
	writeRes += " number ";
	writeRes += vTakenNumber;
	writeRes += " is already taken.";
	
	return writeRes;
}

// Unknown string.
function writeStringDoesNotExistText(vDesc, vUnknownString)
{
	var writeRes = "";
	
	writeRes += "The ";
	writeRes += vDesc;
	writeRes += " item '";
	writeRes += vUnknownString;
	writeRes += "' does not exist.";
	
	return writeRes;
}


// Page number parameter missing.
function writePageMissingText(vDesc)
{
	var writeRes = "Page number parameter is missing from " + vDesc;
	return writeRes;
}

// Invalid number key.
function writeInvalidNumberKeyText(vDesc)
{
	var writeRes = vDesc + " must be a valid positive whole number.";
	return writeRes;
}


// Invalid case code format.
function writeInvalidCaseCodeText(vCode)
{
	var writeRes = "";
	
	writeRes += "The string '";
	writeRes += vCode;
	writeRes += "' is not a valid case code. Must follow the format: ";
	writeRes += "'dddd-yy'";
	
	return writeRes;
}

// Invalid determination date.
function writeInvalidDeterminationDateText()
{
	var writeRes = "Invalid determination date. Must use the format 'yyyy-mm-dd'";
	return writeRes;
}





module.exports =
{
	writeIncorrectType: writeIncorrectTypeText,
	writeStringTooLong: writeStringTooLongText,
	writeNumberRange: writeNumberRangeText,
	writeEmpty: writeEmptyText,
	writeStringAlreadyTaken: writeStringAlreadyTakenText,
	writeNumberAlreadyTaken: writeNumberAlreadyTakenText,
	writeStringDoesNotExist: writeStringDoesNotExistText,
	writePageMissing: writePageMissingText,
	writeInvalidNumberKey: writeInvalidNumberKeyText,
	writeInvalidCaseCode: writeInvalidCaseCodeText,
	writeInvalidDeterminationDate: writeInvalidDeterminationDateText
};