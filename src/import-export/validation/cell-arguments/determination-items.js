// Validates 'determinationFlag' and 'determinationDate' columns before database import (../case-rows.js)


const dateTasks = require("../../../common/entry/date-tasks");
const entryErrorText = require("../../../common/entry/entry-error-text");
const colNames = require("../../../common/interface/schema/col-names");


// Validate determination flag.
function checkDeterminationFlagProperty(eObject, validRes)
{
	var givenValue = eObject[colNames.determinationFlag];
	var castNumber = NaN;
	var valueExists = false;
	var correctType = false;
	
	var checkRes = false;
	
	
	if (givenValue.length > 0)
	{
		// String exists - Check if number.
		castNumber = Number(givenValue);
		valueExists = true;
		correctType = Number.isFinite(castNumber);
	}
	
	if (valueExists === true && correctType === true)
	{
		// Valid flag number.
		eObject[colNames.determinationFlag] = castNumber;
		checkRes = true;
	}
	else if (valueExists === true)
	{
		// Invalid flag number.
		checkRes = false;
		validRes.invalidData = entryErrorText.writeIncorrectType("Determination Flag", "number");
	}
	else
	{
		// Flag missing.
		eObject[colNames.determinationFlag] = null;
		checkRes = true;
	}
	
	return checkRes;
}


// Validate determination date.
function checkDeterminationDateProperty(eObject, validRes)
{
	var givenValue = eObject[colNames.determinationDate];
	var castDate = null;
	var timeValue = null;
	var valueExists = false;
	var correctType = false;
	
	var checkRes = false;
	
	if (givenValue.length > 0)
	{
		// String exists - Check if valid date.
		castDate = dateTasks.castUtcDate(givenValue);
		timeValue = castDate.getTime();
		valueExists = true;
		correctType = Number.isInteger(timeValue);
	}
	
	
	if (valueExists === true && correctType === true)
	{
		// Valid date.
		checkRes = true;
	}
	else if (valueExists === true)
	{
		// Invalid date.
		checkRes = false;
		validRes.invalidData = entryErrorText.writeInvalidDeterminationDate();
	}
	else
	{
		// Unknown date.
		eObject[colNames.determinationDate] = "";
		checkRes = true;
	}
	
	return checkRes;
}




module.exports =
{
	checkFlag: checkDeterminationFlagProperty,
	checkDate: checkDeterminationDateProperty
};