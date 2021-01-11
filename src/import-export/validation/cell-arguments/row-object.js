/*
	Validates and prepares JSON objects before database import
	Used in '../list-rows.js' and '../case-rows.js'
*/

const valueType = require("../../../common/value-type");
const entryErrorText = require("../../../common/entry/entry-error-text");
const colNames = require("../../../common/interface/schema/col-names");


// Checks object type.
function checkBaseObjectType(eObject, baseObjectDesc, validRes)
{
	var correctType = valueType.checkObject(eObject);
	
	if (correctType !== true)
	{
		validRes.invalidData = entryErrorText.writeIncorrectType(baseObjectDesc, "object");
	}
	
	return correctType;
}


// Casts 'CaseFile' JSON objects as strings.
function prepareCaseObjectCells(caObject)
{
	handleCellPreperation(caObject, colNames.caseEntryIdentification);
	handleCellPreperation(caObject, colNames.caseCode);
	handleCellPreperation(caObject, colNames.advertiserNum);
	handleCellPreperation(caObject, colNames.descriptionText);
	handleCellPreperation(caObject, colNames.determinationFlag);
	handleCellPreperation(caObject, colNames.prodCatNum);
	handleCellPreperation(caObject, colNames.medTypeNum);
	handleCellPreperation(caObject, colNames.determinationDate);
	handleCellPreperation(caObject, colNames.archiveTimestamp);
	handleCellPreperation(caObject, colNames.documentLink);
	handleCellPreperation(caObject, colNames.downloadFlag);
	handleCellPreperation(caObject, "activeFlag");
}


// Cast individual cell as string.
function handleCellPreperation(caObj, cellPropName)
{
	var givenValue = caObj[cellPropName];
	var correctType = valueType.checkString(givenValue);
	
	if (correctType === true)
	{
		caObj[cellPropName] = valueType.sanitizeString(givenValue);
	}
	else
	{
		caObj[cellPropName] = "";
	}
}



module.exports =
{
	checkBaseType: checkBaseObjectType,
	prepareCaseCells: prepareCaseObjectCells
};