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
	
	var validationResultObject = importValidationResult.initializeObject();
	
	
	// Validates objects in a loop.
	while (objectIndex >= 0 && objectIndex < objectList.length && validationResultObject.canContinue === true)
	{
		currentCaseObject = objectList[objectIndex];
		currentValid = handleCurrentObject(currentCaseObject, caseInfoObject, validationResultObject);
		
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
			validationResultObject.canContinue = false;
		}
		
	}
	
	return validationResultObject;
}


// Validates current object.
function handleCurrentObject(caseObject, caseInfoObj, validationResult)
{
	var validBaseType = rowObject.checkBaseType(caseObject, caseInfoObj.schemaDesc, validationResult);
	
	var validEntryID = handleEntryID(caseObject, validBaseType, validationResult);
	var validCaseCodeString = handleCaseCodeString(caseObject, validEntryID, validationResult);
	var validCaseCodeSyntax = handleCaseCodeFormat(caseObject, validCaseCodeString, validationResult);
	
	var validAdvertiserID = handleForeignKeyNumber(caseObject, colNames.advertiserNum, colNames.advertiserNum, validCaseCodeSyntax, validationResult);
	var validDescriptionString = handleDescription(caseObject, validAdvertiserID, validationResult);
	
	var validDeterminationFlag = handleDeterminationFlag(caseObject, validDescriptionString, validationResult);
	var validProductCategoryID = handleForeignKeyNumber(caseObject, colNames.prodCatNum, inputDesc.productCategory, validDeterminationFlag, validationResult);
	var validMediaTypeID = handleForeignKeyNumber(caseObject, colNames.medTypeNum, inputDesc.mediaType, validProductCategoryID, validationResult);
	
	var validDeterminationDate = handleDeterminationDate(caseObject, validMediaTypeID, validationResult);
	var validArchiveTimestamp = handleArchiveTimestamp(caseObject, validDeterminationDate, validationResult);
	
	var validDocumentURL = handleDocumentURL(caseObject, validArchiveTimestamp, validationResult);
	var validDownloadFlag = handleDownloadFlag(caseObject, validDocumentURL, validationResult);
	var validActiveFlag = handleActiveFlag(caseObject, validDownloadFlag, validationResult);
	
	var handleRes = false;
	
	
	if (validActiveFlag === true)
	{
		// Object valid.
		handleRes = true;
	}
	
	return handleRes;
}


// Casts properties as string and check ID.
function handleEntryID(caseObj, baseValid, validObj)
{
	var handleRes = false;
	
	if (baseValid === true)
	{
		rowObject.prepareCaseCells(caseObj);
		handleRes = generalItems.checkEntryID(caseObj, colNames.caseEntryIdentification, validObj);
	}
	
	return handleRes;
}


// Check case code string type.
function handleCaseCodeString(caseObj, idValid, validObj)
{
	var handleRes = false;
	
	if (idValid === true)
	{
		handleRes = generalItems.checkStringProperty(caseObj, colNames.caseCode, inputDesc.caseNumber, true, valueLimits.caseCodeLength, validObj);
	}
	
	return handleRes;
}

// Check case code format.
function handleCaseCodeFormat(caseObj, stringTypeValid, validObj)
{
	var handleRes = false;
	
	if (stringTypeValid === true)
	{
		handleRes = caseCodeSyntax.checkPropertySyntax(caseObj, validObj);
	}
	
	return handleRes;
}


// Check advertiser, product category, and media type IDs.
function handleForeignKeyNumber(caseObj, fkName, fkDesc, previousValid, validObj)
{
	var handleRes = false;
	
	if (previousValid === true)
	{
		handleRes = refNum.checkReferenceID(caseObj, fkName, fkDesc, validObj);
	}
	
	return handleRes;
}


// Check description string.
function handleDescription(caseObj, advertiserValid, validObj)
{
	var handleRes = false;
	
	if (advertiserValid === true)
	{
		handleRes = generalItems.checkStringProperty(caseObj, colNames.descriptionText, inputDesc.summary, false, valueLimits.description, validObj);
	}
	
	return handleRes;
}


// Check determination flag.
function handleDeterminationFlag(caseObj, descriptionValid, validObj)
{
	var handleRes = false;
	
	if (descriptionValid === true)
	{
		handleRes = determinationItems.checkFlag(caseObj, validObj);
	}
	
	return handleRes;
}


// Check determination date.
function handleDeterminationDate(caseObj, mediaTypeValid, validObj)
{
	var handleRes = false;
	
	if (mediaTypeValid === true)
	{
		handleRes = determinationItems.checkDate(caseObj, validObj);
	}
	
	return handleRes;
}


// Check archive timestamp.
function handleArchiveTimestamp(caseObj, determinationDateValid, validObj)
{
	var handleRes = false;
	
	if (determinationDateValid === true)
	{
		handleRes = caseArchive.checkTimestamp(caseObj, validObj);
	}
	
	return handleRes;
}


// Check report document file URL.
function handleDocumentURL(caseObj, archiveTimestampValid, validObj)
{
	var handleRes = false;
	
	if (archiveTimestampValid === true)
	{
		handleRes = caseDownload.checkLink(caseObj, validObj);
	}
	
	return handleRes;
}


// Check download flag.
function handleDownloadFlag(caseObj, urlValid, validObj)
{
	var handleRes = false;
	
	if (urlValid === true)
	{
		handleRes = caseDownload.checkFlag(caseObj, validObj);
	}
	
	return handleRes;
}

// Check active flag.
function handleActiveFlag(caseObj, downloadFlagValid, validObj)
{
	var handleRes = false;
	
	if (downloadFlagValid === true)
	{
		handleRes = generalItems.checkActiveFlag(caseObj, validObj);
	}
	
	return handleRes;
}



module.exports =
{
	validateObjects: validateImportedCaseObjects
};