// Functions write error text related to input validation.


function writeIncorrectTypeText(vDesc, vType)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " must be a valid ";
	writeRes += vType;
	
	return writeRes;
}


function writeStringTooLongText(vDesc, vMaxLength)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " length cannot be longer than ";
	writeRes += vMaxLength;
	writeRes += " characters.";
	
	return writeRes;
}


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



function writeEmptyText(vDesc)
{
	var writeRes = vDesc + " cannot be empty.";
	return writeRes;
}


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



function writePageMissingText(vDesc)
{
	var writeRes = "Page number parameter is missing from " + vDesc;
	return writeRes;
}


function writeInvalidNumberKeyText(vDesc)
{
	var writeRes = vDesc + " must be a valid positive whole number.";
	return writeRes;
}


function writeInvalidCaseCodeText(vCode)
{
	var writeRes = "";
	
	writeRes += "The string '";
	writeRes += vCode;
	writeRes += "' is not a valid case code. Must follow the format: ";
	writeRes += "'dddd-yy'";
	
	return writeRes;
}


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