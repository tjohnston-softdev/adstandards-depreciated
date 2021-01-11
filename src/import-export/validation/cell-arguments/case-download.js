/*
	Validates and prepares 'documentFileURL' and 'downloadFlag'
	from 'CaseFile' before database import (../case-rows.js)
*/


const validator = require("validator");
const valueType = require("../../../common/value-type");
const entryErrorText = require("../../../common/entry/entry-error-text");
const colNames = require("../../../common/interface/schema/col-names");
const inputDesc = require("../../../common/interface/general/input-desc");


// Validate case file report URL.
function checkDocumentFileLink(eObject, validRes)
{
	var givenValue = eObject[colNames.documentLink];
	var urlExists = false;
	var urlValid = false;
	
	var checkRes = false;
	
	
	if (givenValue.length > 0)
	{
		// String exists - Check if valid URL.
		urlExists = true;
		urlValid = validator.isURL(givenValue);
	}
	
	
	if (urlExists === true && urlValid === true)
	{
		// Valid URL.
		checkRes = true;
	}
	else if (urlExists === true)
	{
		// Invalid URL.
		checkRes = false;
		validRes.invalidData = entryErrorText.writeIncorrectType(inputDesc.caseFile, "URL");
	}
	else
	{
		// Missing entry.
		eObject[colNames.documentLink] = null;
		checkRes = true;
	}
	
	
	return checkRes;
}



// Validate download flag.
function checkDownloadFlagProperty(eObject, validRes)
{
	var givenValue = eObject[colNames.downloadFlag];
	var castNumber = Number(givenValue);
	var correctType = valueType.checkTrueFalseFlag(castNumber);
	
	var checkRes = false;
	
	if (correctType === true)
	{
		eObject[colNames.downloadFlag] = castNumber;
		checkRes = true;
	}
	else
	{
		validRes.invalidData = entryErrorText.writeIncorrectType("Download Flag", "boolean");
	}
	
	return checkRes;
}




module.exports =
{
	checkLink: checkDocumentFileLink,
	checkFlag: checkDownloadFlagProperty
};