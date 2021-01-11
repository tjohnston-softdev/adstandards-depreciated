/*
	* This function parses SELECT query results into plain JSON objects.
	* The query result is parsed exactly as-is with the original column names.
*/


function prepareGeneralRows(rowDataArray)
{
	var rowIndex = 0;
	var currentRow = {};
	var currentProperty = "";
	var currentValue = null;
	var currentPrepared = {};
	
	var prepRes = [];
	
	for (rowIndex = 0; rowIndex < rowDataArray.length; rowIndex = rowIndex + 1)
	{
		currentRow = rowDataArray[rowIndex];
		currentProperty = "";
		currentValue = null;
		currentPrepared = {};
		
		for (currentProperty in currentRow)
		{
			currentValue = currentRow[currentProperty];
			currentPrepared[currentProperty] = currentValue;
		}
		
		
		prepRes.push(currentPrepared);
	}
	
	return prepRes;
}



module.exports =
{
	prepareGeneral: prepareGeneralRows
};