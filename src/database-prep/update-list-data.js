/*
	This file is responsible for updating the items in the 'ProductCategory' and 'MediaType' tables.
	Used in the 'read-lists' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const dbConnection = require("../common/database/db-connection");
const dbTransaction = require("../common/database/db-transaction");
const dbInsert = require("../common/database/db-insert");
const dbUpdate = require("../common/database/db-update");
const tblNames = require("../common/interface/schema/tbl-names");
const tblDesc = require("../common/interface/schema/tbl-desc");
const colNames = require("../common/interface/schema/col-names");
const inputDesc = require("../common/interface/general/input-desc");


// Main function.
function updateDataTables(listDataObject, insertListCallback)
{
	var insertSpinner = ora("Updating List Data").start();
	
	callOpenConnection(listDataObject, function (dbInsertError, dbInsertRes)
	{
		if (dbInsertError !== null)
		{
			insertSpinner.fail("List Data Update Failed");
			return insertListCallback(dbInsertError, null);
		}
		else
		{
			insertSpinner.succeed("List Data Updated");
			return insertListCallback(null, true);
		}
	});
	
}


// Establishes database connection.
function callOpenConnection(listDataObj, openConnectionCallback)
{
	dbConnection.openConnection(false, function (openErr, openRes)
	{
		if (openErr !== null)
		{
			return openConnectionCallback(openErr, null);
		}
		else
		{
			callDatabaseSteps(openRes, listDataObj, openConnectionCallback);
		}
	});
}


// Perform list tables update.
function callDatabaseSteps(insConnObj, dataObj, stepsCallback)
{
	asyncModule.series(
	[
		dbTransaction.beginTransaction.bind(null, insConnObj),
		handleProductUpdate.bind(null, insConnObj, dataObj.productCategories),
		handleMediaUpdate.bind(null, insConnObj, dataObj.mediaTypes),
		dbTransaction.commitChanges.bind(null, insConnObj)
	],
	function (stepErr, stepRes)
	{
		if (stepErr !== null)
		{
			// Database error.
			callConnectionFailed(insConnObj, stepErr, stepsCallback);
		}
		else
		{
			// Update successful.
			callCloseConnection(insConnObj, stepsCallback);
		}
	});
}


// Close database connection with successful result.
function callCloseConnection(insConn, finalCallback)
{
	dbConnection.closeConnection(insConn, function (connCloseErr, connCloseRes)
	{
		if (connCloseErr !== null)
		{
			return finalCallback(connCloseErr, null);
		}
		else
		{
			return finalCallback(null, true);
		}
	});
}




// Abort database connection with error.
function callConnectionFailed(cFailObject, cFailError, finalCallback)
{
	asyncModule.series(
	[
		dbTransaction.cancelChanges.bind(null, cFailObject),
		dbConnection.resolveError.bind(null, cFailObject, cFailError)
	],
	function (resolveError)
	{
		return finalCallback(resolveError, null);
	});
}



// Updates 'ProductCategory' table.
function handleProductUpdate(proConn, proList, productCallback)
{
	var pTable = tblNames.prodCat;
	var pDesc = inputDesc.productCategory;
	var pKey = colNames.prodCatName;
	
	asyncModule.series(
	[
		dbInsert.insertSimpleListData.bind(null, proConn, pTable, pDesc, pKey, proList),
		dbUpdate.activateListRows.bind(null, proConn, pTable, pDesc, pKey, proList),
		dbUpdate.deactivateListRows.bind(null, proConn, pTable, pDesc, pKey, proList)
	],
	function (handleError, handleRes)
	{
		return productCallback(handleError, handleRes);
	});
}


// Updates 'MediaType' table
function handleMediaUpdate(medConn, medList, mediaCallback)
{
	var mTable = tblNames.medType;
	var mDesc = inputDesc.mediaType;
	var mKey = colNames.medTypeName;
	
	asyncModule.series(
	[
		dbInsert.insertSimpleListData.bind(null, medConn, mTable, mDesc, mKey, medList),
		dbUpdate.activateListRows.bind(null, medConn, mTable, mDesc, mKey, medList),
		dbUpdate.deactivateListRows.bind(null, medConn, mTable, mDesc, mKey, medList)
	],
	function (handleError, handleRes)
	{
		return mediaCallback(handleError, handleRes);
	});
}



module.exports =
{
	updateData: updateDataTables
};