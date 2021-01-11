/*
	Validates and prepares ProductCategory and MediaType reference IDs before database import
	Columns: 'ProductCategoryID' and 'MediaTypeID'
	File: ../case-rows.js
*/

const entryErrorText = require("../../../common/entry/entry-error-text");


function checkReferenceIDNumber(eObject, refPropName, refPropDesc, validRes)
{
	var givenValue = eObject[refPropName];
	var castNumber = NaN;
	var valueExists = false;
	var correctType = false;
	
	var checkRes = false;
	
	
	if (givenValue.length > 0)
	{
		// String exists - Check if number.
		castNumber = Number(givenValue);
		valueExists = true;
		correctType = Number.isInteger(castNumber);
	}
	
	
	if (valueExists === true && correctType === true && castNumber > 0)
	{
		// Valid ID number.
		eObject[refPropName] = castNumber;
		checkRes = true;
	}
	else if (valueExists === true)
	{
		// Invalid number.
		checkRes = false;
		validRes.invalidData = entryErrorText.writeIncorrectType(refPropDesc, "positive whole number");
	}
	else
	{
		// Reference ID missing.
		eObject[refPropName] = null;
		checkRes = true;
	}
	
	return checkRes;
}



module.exports =
{
	checkReferenceID: checkReferenceIDNumber
};