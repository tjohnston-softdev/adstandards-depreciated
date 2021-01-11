/*
	* Parses advertisement case document rows into JSON objects.
	* Used by 'selectCaseDocumentLinkRows' in '../db-select.js'
*/

function prepareCaseDocumentLinkRows(rowDataArray)
{
	var rowIndex = 0;
	var currentRow = {};
	var currentCode = "";
	var currentLink = "";
	var currentPrepared = {};
	
	var prepRes = [];
	
	for (rowIndex = 0; rowIndex < rowDataArray.length; rowIndex = rowIndex + 1)
	{
		currentRow = rowDataArray[rowIndex];
		currentCode = currentRow.caseCode;
		currentLink = currentRow.documentFileURL;
		currentPrepared = {"caseName": currentCode, "downloadLink": currentLink};
		
		prepRes.push(currentPrepared);
	}
	
	return prepRes;
}



module.exports =
{
	prepareCaseDocumentLinks: prepareCaseDocumentLinkRows
};