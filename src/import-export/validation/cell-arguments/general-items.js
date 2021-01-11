/*
	Validates and prepares common properties before database import
	Used in '../list-rows.js' and '../case-rows.js'
*/

const valueType = require("../../../common/value-type");
const entryErrorText = require("../../../common/entry/entry-error-text");



// Validate ID number.
function checkEntryIdentificationNumber(eObject, keyColumnName, validRes)
{
	var givenValue = eObject[keyColumnName];
	var castNumber = Number(givenValue);
	var correctType = Number.isInteger(castNumber);
	
	var checkRes = false;
	
	if (correctType === true && givenValue > 0)
	{
		eObject[keyColumnName] = givenValue;
		checkRes = true;
	}
	else
	{
		validRes.invalidData = entryErrorText.writeInvalidNumberKey(keyColumnName);
	}
	
	return checkRes;
}



// Validates string length.
function checkStringPropertyCell(eObject, strPropName, strPropDesc, stringRequired, charLimit, validRes)
{
	var givenValue = eObject[strPropName];
	var checkRes = false;
	
	if (givenValue.length > 0 && givenValue.length <= charLimit.max)
	{
		// Valid.
		checkRes = true;
	}
	else if (givenValue.length > charLimit.max)
	{
		// Too long
		checkRes = false;
		validRes.invalidData = entryErrorText.writeStringTooLong(strPropDesc, charLimit.max);
	}
	else if (stringRequired === true)
	{
		// Cannot be empty.
		checkRes = false;
		validRes.invalidData = entryErrorText.writeEmpty(strPropDesc);
	}
	else
	{
		// Optional.
		checkRes = true;
	}
	
	return checkRes;
}


// Validates active flag. Must be 0 or 1.
function checkActiveFlagCell(eObject, validRes)
{
	var castNumber = Number(eObject.activeFlag);
	var correctType = valueType.checkTrueFalseFlag(castNumber);
	
	var checkRes = false;
	
	if (correctType === true)
	{
		eObject.activeFlag = castNumber;
		checkRes = true;
	}
	else
	{
		validRes.invalidData = entryErrorText.writeIncorrectType("Active Flag", "boolean");
	}
	
	return checkRes;
}




module.exports =
{
	checkEntryID: checkEntryIdentificationNumber,
	checkStringProperty: checkStringPropertyCell,
	checkActiveFlag: checkActiveFlagCell
};