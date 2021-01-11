// Functions used to convert object format from JSON to array so that they can be inserted into the database.


// List items.
function reduceListDataStrings(strArray)
{
	var stringIndex = 0;
	var currentString = "";
	var currentValueList = [];
	
	for (stringIndex = 0; stringIndex < strArray.length; stringIndex = stringIndex + 1)
	{
		// Converts string to dimension.
		currentString = strArray[stringIndex];
		currentValueList = [currentString];
		
		strArray[stringIndex] = currentValueList;
	}
	
}


// Advertisement cases.
function reduceCaseObjects(caseArray)
{
	var caseIndex = 0;
	var currentCaseObject = {};
	var currentCaseCells = [];
	
	for (caseIndex = 0; caseIndex < caseArray.length; caseIndex = caseIndex + 1)
	{
		currentCaseObject = caseArray[caseIndex];
		currentCaseCells = [];
		
		currentCaseCells.push(currentCaseObject.caseCodeKey);
		currentCaseCells.push(currentCaseObject.advertiser);
		currentCaseCells.push(currentCaseObject.description);
		currentCaseCells.push(currentCaseObject.determinedStatus);
		currentCaseCells.push(currentCaseObject.product);
		currentCaseCells.push(currentCaseObject.media);
		currentCaseCells.push(currentCaseObject.date);
		currentCaseCells.push(currentCaseObject.file);
		
		caseArray[caseIndex] = currentCaseCells;
	}
	
}


// Advertisement case keys.
function reduceReportFiles(reportArray)
{
	var reportIndex = 0;
	var currentReportObject = {};
	var currentReportCode = [];
	
	for (reportIndex = 0; reportIndex < reportArray.length; reportIndex = reportIndex + 1)
	{
		currentReportObject = reportArray[reportIndex];
		reportArray[reportIndex] = currentReportObject.caseName;
	}
}


// Imported list item rows.
function reduceImportedListItemObject(entryObj, listInfoObj)
{
	var keyValue = entryObj[listInfoObj.keyCol];
	var nameValue = entryObj[listInfoObj.nameCol];
	var activeValue = entryObj.activeFlag;
	
	var reductionRes = [keyValue, nameValue, activeValue];
	return reductionRes;
}


// Imported advertisement case rows.
function reduceImportedCaseObject(caseObj)
{
	var reductionRes = [];
	
	reductionRes.push(caseObj.caseEntryID);
	reductionRes.push(caseObj.caseCode);
	reductionRes.push(caseObj.advertiserID);
	reductionRes.push(caseObj.descriptionText);
	reductionRes.push(caseObj.determinationFlag);
	reductionRes.push(caseObj.productCategoryID);
	reductionRes.push(caseObj.mediaTypeID);
	reductionRes.push(caseObj.determinationDate);
	reductionRes.push(caseObj.archiveTimestamp);
	reductionRes.push(caseObj.documentFileURL);
	reductionRes.push(caseObj.downloadFlag);
	reductionRes.push(caseObj.activeFlag);
	
	return reductionRes;
}





module.exports =
{
	reduceListData: reduceListDataStrings,
	reduceCases: reduceCaseObjects,
	reduceReports: reduceReportFiles,
	reduceImportedListItem: reduceImportedListItemObject,
	reduceImportedCase: reduceImportedCaseObject
};