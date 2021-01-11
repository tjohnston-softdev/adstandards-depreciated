// Validates case code key format before database import (../case-rows.js)

const valueType = require("../../../common/value-type");
const entryErrorText = require("../../../common/entry/entry-error-text");
const colNames = require("../../../common/interface/schema/col-names");


function checkCaseCodePropertySyntax(eObject, validRes)
{
	var givenValue = eObject[colNames.caseCode];
	var checkRes = valueType.checkCaseNumberSyntax(givenValue);
	
	if (checkRes !== true)
	{
		validRes.invalidData = entryErrorText.writeInvalidCaseCode(givenValue);
	}
	
	return checkRes;
}



module.exports =
{
	checkPropertySyntax: checkCaseCodePropertySyntax
};