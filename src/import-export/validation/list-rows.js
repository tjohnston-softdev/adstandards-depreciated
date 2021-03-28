/*
	Validates collection of JSON objects before they can be imported into a list table.
	These tables are 'Advertiser', 'ProductCategory', and 'MediaType'
	Used in: ../read-import-files.js
*/


const importValidationResult = require("../../common/entry/import-validation-result");
const objectReduction = require("../../common/database/object-reduction");
const rowObject = require("./cell-arguments/row-object");
const listItemName = require("./cell-arguments/list-item-name");
const generalItems = require("./cell-arguments/general-items");


// Main function.
function validateImportedListObjects(objectList, listInfoObject, ignoreInvalidInput)
{
	var objectIndex = 0;
	var currentEntryObject = {};
	var currentValid = false;
	
	var validationResultObject = importValidationResult.initializeObject();
	
	
	// Validates objects in a loop.
	while (objectIndex >= 0 && objectIndex < objectList.length && validationResultObject.canContinue === true)
	{
		currentEntryObject = objectList[objectIndex];
		currentValid = handleCurrentObject(currentEntryObject, listInfoObject, validationResultObject);
		
		if (currentValid === true)
		{
			// Valid - Format for insert and continue.
			objectList[objectIndex] = objectReduction.reduceImportedListItem(currentEntryObject, listInfoObject);
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
function handleCurrentObject(listEntry, listInfoObj, validationResult)
{
	var validBaseType = rowObject.checkBaseType(listEntry, listInfoObj.schemaDesc, validationResult);
	var validNumberKey = handleNumberID(listEntry, listInfoObj, validBaseType, validationResult);
	var validNameType = handleNameType(listEntry, listInfoObj, validNumberKey, validationResult);
	var validNameLength = handleNameLength(listEntry, listInfoObj, validNameType, validationResult);
	var validActiveFlag = handleActiveFlag(listEntry, validNameLength, validationResult);
	
	var handleRes = false;
	
	if (validActiveFlag === true)
	{
		// Object valid.
		handleRes = true;
	}
	
	
	return handleRes;
}


// Checks number ID.
function handleNumberID(entryObject, listInfo, baseValid, validObj)
{
	var handleRes = false;
	
	if (baseValid === true)
	{
		handleRes = generalItems.checkEntryID(entryObject, listInfo.keyCol, validObj);
	}
	
	return handleRes;
}


// Checks name type.
function handleNameType(entryObject, listInfo, keyValid, validObj)
{
	var handleRes = false;
	
	if (keyValid === true)
	{
		handleRes = listItemName.checkType(entryObject, listInfo, validObj);
	}
	
	return handleRes;
}


// Checks name length.
function handleNameLength(entryObject, listInfo, nameTypeValid, validObj)
{
	var handleRes = false;
	
	if (nameTypeValid === true)
	{
		handleRes = listItemName.checkLength(entryObject, listInfo, validObj);
	}
	
	return handleRes;
}


// Check active flag.
function handleActiveFlag(entryObject, nameLengthValid, validObj)
{
	var handleRes = false;
	
	if (nameLengthValid === true)
	{
		handleRes = generalItems.checkActiveFlag(entryObject, validObj);
	}
	
	return handleRes;
}




module.exports =
{
	validateObjects: validateImportedListObjects
};