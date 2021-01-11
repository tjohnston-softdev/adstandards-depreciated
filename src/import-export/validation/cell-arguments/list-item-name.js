// Validates and prepares list item name before database import (../list-rows.js)

const valueType = require("../../../common/value-type");
const entryErrorText = require("../../../common/entry/entry-error-text");


// Validate string type.
function checkNameType(eObject, infoObj, validRes)
{
	var givenValue = eObject[infoObj.nameCol];
	var correctType = valueType.checkString(givenValue);
	var preparedName = "";
	var checkRes = false;
	
	if (correctType === true)
	{
		// Sanitize string text - Valid type.
		preparedName = valueType.sanitizeString(givenValue);
		eObject[infoObj.nameCol] = preparedName;
		checkRes = true;
	}
	else
	{
		// Invalid type.
		validRes.invalidData = entryErrorText.writeIncorrectType(infoObj.nameDesc, "string");
	}
	
	return checkRes;
}


// Validate string length.
function checkNameLength(eObject, infoObj, validRes)
{
	var givenText = eObject[infoObj.nameCol];
	var checkRes = false;
	
	if (givenText.length > 0 && givenText.length <= infoObj.maxNameLength)
	{
		checkRes = true;
	}
	else if (givenText.length > infoObj.maxNameLength)
	{
		validRes.invalidData = entryErrorText.writeStringTooLong(infoObj.nameDesc, infoObj.maxNameLength);
	}
	else
	{
		validRes.invalidData = entryErrorText.writeEmpty(infoObj.nameDesc);
	}
	
	return checkRes;
}




module.exports =
{
	checkType: checkNameType,
	checkLength: checkNameLength
};