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
	
	var validationResult = importValidationResult.initializeObject();
	
	
	// Validates objects in a loop.
	while (objectIndex >= 0 && objectIndex < objectList.length && validationResult.canContinue === true)
	{
		currentEntryObject = objectList[objectIndex];
		currentValid = handleCurrentObject(currentEntryObject, listInfoObject, validationResult);
		
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
			validationResult.canContinue = false;
		}
		
	}
	
	
	return validationResult;
}


// Validates current object.
function handleCurrentObject(entryObject, listInfoObj, validationRes)
{
	var validBaseType = false;
	var validNumberKey = false;
	var validNameType = false;
	var validNameLength = false;
	var validActiveFlag = false;
	
	var handleRes = false;
	
	// Checks base object type.
	validBaseType = rowObject.checkBaseType(entryObject, listInfoObj.schemaDesc, validationRes);
	
	
	if (validBaseType === true)
	{
		// Checks number ID.
		validNumberKey = generalItems.checkEntryID(entryObject, listInfoObj.keyCol, validationRes);
	}
	
	if (validNumberKey === true)
	{
		// Checks name type.
		validNameType = listItemName.checkType(entryObject, listInfoObj, validationRes);
	}
	
	if (validNameType === true)
	{
		// Checks name length.
		validNameLength = listItemName.checkLength(entryObject, listInfoObj, validationRes);
	}
	
	if (validNameLength === true)
	{
		// Check active flag.
		validActiveFlag = generalItems.checkActiveFlag(entryObject, validationRes);
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
	validateObjects: validateImportedListObjects
};