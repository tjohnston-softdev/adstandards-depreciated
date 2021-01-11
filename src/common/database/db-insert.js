// Functions for executing INSERT queries.

const dbErrorText = require("./errors/db-error-text");
const insertQueryText = require("./queries/insert-query-text");


// Inserts items into list table, ignoring any duplicates.
function insertSimpleListDataRows(connObj, tblName, tblDesc, keyAttr, valueArray, insertCallback)
{
	var queryText = insertQueryText.writeCommonList(tblName, keyAttr, valueArray);
	var flaggedMessage = "";
	
	connObj.query(queryText, function (insertError, insertRes, insertFields)
	{
		if (insertError !== undefined && insertError !== null)
		{
			flaggedMessage = dbErrorText.writeInsert(tblDesc, insertError);
			return insertCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return insertCallback(null, true);
		}
	});
	
}

// Inserts new advertiser.
function insertAdvertiserRow(connObj, tblDesc, newAdvertiserName, insertCallback)
{
	var queryText = insertQueryText.writeAdvertiser(newAdvertiserName);
	var flaggedMessage = "";
	
	connObj.query(queryText, function (insertError, insertRes, insertFields)
	{
		if (insertError !== undefined && insertError !== null)
		{
			flaggedMessage = dbErrorText.writeInsert(tblDesc, insertError);
			return insertCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return insertCallback(null, insertRes.insertId);
		}
	});
	
}


// Inserts advertisement cases, overwriting duplicates.
function insertCaseDataRows(connObj, tblDesc, valueArray, insertCallback)
{
	var queryText = insertQueryText.writeCases(valueArray);
	var flaggedMessage = "";
	
	connObj.query(queryText, function (insertError, insertRes, insertFields)
	{
		if (insertError !== undefined && insertError !== null)
		{
			flaggedMessage = dbErrorText.writeInsert(tblDesc, insertError);
			return insertCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return insertCallback(null, true);
		}
	});
	
}

// Insert imported rows.
function insertImportedDataRows(connObj, tblName, tblDesc, valueArray, insertCallback)
{
	var queryText = insertQueryText.writeImportInsert(valueArray, tblName);
	var flaggedMessage = "";
	
	
	connObj.query(queryText, function (insertError, insertRes, insertFields)
	{
		if (insertError !== undefined && insertError !== null)
		{
			flaggedMessage = dbErrorText.writeInsert(tblDesc, insertError);
			return insertCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return insertCallback(null, true);
		}
	});
}





module.exports =
{
	insertSimpleListData: insertSimpleListDataRows,
	insertAdvertiser: insertAdvertiserRow,
	insertCases: insertCaseDataRows,
	insertImportedData: insertImportedDataRows
};