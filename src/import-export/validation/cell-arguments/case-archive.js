// Validates 'archiveTimestamp' column before database import (../case-rows.js)

const valueType = require("../../../common/value-type");
const entryErrorText = require("../../../common/entry/entry-error-text");
const colNames = require("../../../common/interface/schema/col-names");
const inputDesc = require("../../../common/interface/general/input-desc");


function checkArchiveTimestampProperty(eObject, validRes)
{
	var givenValue = eObject[colNames.archiveTimestamp];
	var castDate = null;
	var timeValue = null;
	var timestampExists = false;
	var timestampValid = false;
	
	var checkRes = false;
	
	if (givenValue.length > 0)
	{
		// String exists - Check if valid timestamp.
		castDate = new Date(givenValue);
		timeValue = castDate.getTime();
		timestampExists = true;
		timestampValid = Number.isInteger(timeValue);
	}
	
	if (timestampExists === true && timestampValid === true)
	{
		// Valid timestamp.
		checkRes = true;
	}
	else if (timestampExists === true)
	{
		// Invalid timestamp.
		validRes.invalidData = entryErrorText.writeIncorrectType(inputDesc.archiveTimestamp, "timestamp string");
	}
	else
	{
		// Missing entry.
		validRes.invalidData = entryErrorText.writeEmpty(inputDesc.archiveTimestamp);
	}
	
	return checkRes;
}



module.exports =
{
	checkTimestamp: checkArchiveTimestampProperty
};