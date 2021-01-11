/*
	* Parses advertisement case entries with missing values into JSON objects.
	* Used by 'selectUnknownEntryDataRows' in '../db-select.js'
*/


function prepareUnknownEntryRows(rowDataArray)
{
	var rowIndex = 0;
	var currentRow = {};
	var currentPrepared = {};
	
	var prepRes = [];
	
	for (rowIndex = 0; rowIndex < rowDataArray.length; rowIndex = rowIndex + 1)
	{
		currentRow = rowDataArray[rowIndex];
		currentPrepared = {};
		
		currentPrepared["id"] = currentRow.caseEntryID;
		currentPrepared["code"] = currentRow.caseCode;
		currentPrepared["advertiser"] = currentRow.advertiserID;
		currentPrepared["description"] = currentRow.descriptionText;
		currentPrepared["determination"] = currentRow.determinationFlag;
		currentPrepared["product"] = currentRow.productCategoryID;
		currentPrepared["media"] = currentRow.mediaTypeID;
		currentPrepared["date"] = currentRow.determinationDate;
		currentPrepared["checked"] = "";
		
		prepRes.push(currentPrepared);
	}
	
	return prepRes;
}




module.exports =
{
	prepareUnknownEntries: prepareUnknownEntryRows
};