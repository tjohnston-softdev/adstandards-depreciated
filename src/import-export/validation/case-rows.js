/*
	Validates collection of JSON objects before they can be imported into the 'CaseFile' table
	Used in: ../read-import-files.js
*/


const valueLimits = require("../../common/value-limits");
const importValidationResult = require("../../common/entry/import-validation-result");
const objectReduction = require("../../common/database/object-reduction");
const colNames = require("../../common/interface/schema/col-names");
const inputDesc = require("../../common/interface/general/input-desc");
const rowObject = require("./cell-arguments/row-object");
const generalItems = require("./cell-arguments/general-items");
const caseCodeSyntax = require("./cell-arguments/case-code-syntax");
const refNum = require("./cell-arguments/ref-num");
const determinationItems = require("./cell-arguments/determination-items");
const caseArchive = require("./cell-arguments/case-archive");
const caseDownload = require("./cell-arguments/case-download");


// Main function.
function validateImportedCaseObjects(objectList, caseInfoObject, ignoreInvalidInput)
{
	var objectIndex = 0;
	var currentCaseObject = {};
	var currentValid = false;
	
	var validationResult = importValidationResult.initializeObject();
	
	
	// Validates objects in a loop.
	while (objectIndex >= 0 && objectIndex < objectList.length && validationResult.canContinue === true)
	{
		currentCaseObject = objectList[objectIndex];
		currentValid = handleCurrentObject(currentCaseObject, caseInfoObject, validationResult);
		
		if (currentValid === true)
		{
			// Valid - Format for insert and continue.
			objectList[objectIndex] = objectReduction.reduceImportedCase(currentCaseObject, caseInfoObject);
			objectIndex = objectIndex + 1;
		}
		else if (ignoreInvalidInput === true)
		{
			// Remove from collection.
			objectList.splice(objectIndex, 1);
		}
		else
		{
			// Error flagged.
			validationResult.canContinue = false;
		}
		
	}
	
	return validationResult;
}


// Validates current object.
function handleCurrentObject(caseObject, caseInfoObj, validationRes)
{
	var validBaseType = false;
	
	var validEntryID = false;
	var validCaseCodeString = false;
	var validCaseCodeSyntax = false;
	
	var validAdvertiserID = false;
	var validDescriptionString = false;
	
	var validDeterminationFlag = false;
	var validProductCategoryID = false;
	var validMediaTypeID = false;
	
	var validDeterminationDate = false;
	var validArchiveTimestamp = false;
	
	var validDocumentURL = false;
	var validDownloadFlag = false;
	var validActiveFlag = false;
	
	var handleRes = false;
	
	
	// Checks base object type.
	validBaseType = rowObject.checkBaseType(caseObject, caseInfoObj.schemaDesc, validationRes);
	
	
	if (validBaseType === true)
	{
		// Casts properties as string and check ID.
		rowObject.prepareCaseCells(caseObject);
		validEntryID = generalItems.checkEntryID(caseObject, colNames.caseEntryIdentification, validationRes);
	}
	
	if (validEntryID === true)
	{
		// Check case code string type.
		validCaseCodeString = generalItems.checkStringProperty(caseObject, colNames.caseCode, inputDesc.caseNumber, true, valueLimits.caseCodeLength, validationRes);
	}
	
	if (validCaseCodeString === true)
	{
		// Check case code format.
		validCaseCodeSyntax = caseCodeSyntax.checkPropertySyntax(caseObject, validationRes);
	}
	
	if (validCaseCodeSyntax === true)
	{
		// Check advertiser ID
		validAdvertiserID = refNum.checkReferenceID(caseObject, colNames.advertiserNum, colNames.advertiserNum, validationRes);
	}
	
	if (validAdvertiserID === true)
	{
		// Check description string.
		validDescriptionString = generalItems.checkStringProperty(caseObject, colNames.descriptionText, inputDesc.summary, false, valueLimits.description, validationRes);
	}
	
	if (validDescriptionString === true)
	{
		// Check determination flag.
		validDeterminationFlag = determinationItems.checkFlag(caseObject, validationRes);
	}
	
	if (validDeterminationFlag === true)
	{
		// Check Product Category ID
		validProductCategoryID = refNum.checkReferenceID(caseObject, colNames.prodCatNum, inputDesc.productCategory, validationRes);
	}
	
	if (validProductCategoryID === true)
	{
		// Check Media Type ID
		validMediaTypeID = refNum.checkReferenceID(caseObject, colNames.medTypeNum, inputDesc.mediaType, validationRes);
	}
	
	if (validMediaTypeID === true)
	{
		// Check determination date.
		validDeterminationDate = determinationItems.checkDate(caseObject, validationRes);
	}
	
	if (validDeterminationDate === true)
	{
		// Check archive timestamp.
		validArchiveTimestamp = caseArchive.checkTimestamp(caseObject, validationRes);
	}
	
	if (validArchiveTimestamp === true)
	{
		// Check report document file URL.
		validDocumentURL = caseDownload.checkLink(caseObject, validationRes);
	}
	
	if (validDocumentURL === true)
	{
		// Check download flag.
		validDownloadFlag = caseDownload.checkFlag(caseObject, validationRes);
	}
	
	if (validDownloadFlag === true)
	{
		// Check active flag.
		validActiveFlag = generalItems.checkActiveFlag(caseObject, validationRes);
	}
	
	if (validActiveFlag === true)
	{
		// Object valid.
		handleRes = true;
	}
	
	return handleRes;
}





module.exports =
{
	validateObjects: validateImportedCaseObjects
};