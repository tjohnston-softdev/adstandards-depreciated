/*
	Prepares advertiser refrence IDs for case objects.
	Used in '../new-case-preperation.js' and '../case-data.js'
*/


const asyncModule = require("async");
const dbConnection = require("../../common/database/db-connection");
const dbTransaction = require("../../common/database/db-transaction");
const dbSelect = require("../../common/database/db-select");
const dbInsert = require("../../common/database/db-insert");
const tblNames = require("../../common/interface/schema/tbl-names");
const tblDesc = require("../../common/interface/schema/tbl-desc");
const colNames = require("../../common/interface/schema/col-names");



// Main function.
function prepareCaseListAdvertiserItems(caseObjectList, advertiserItemsCallback)
{
	dbConnection.openConnection(false, function (openErr, openRes)
	{
		if (openErr !== null)
		{
			return advertiserItemsCallback(openErr, null);
		}
		else
		{
			performDatabaseSteps(openRes, caseObjectList, advertiserItemsCallback);
		}
	});
}


// Perform database operations.
function performDatabaseSteps(advertiserConnectionObject, cObjList, databaseStepsCallback)
{
	asyncModule.series(
	[
		dbTransaction.beginTransaction.bind(null, advertiserConnectionObject),
		callCaseLoop.bind(null, advertiserConnectionObject, cObjList),
		dbTransaction.commitChanges.bind(null, advertiserConnectionObject)
	],
	function (stepErr, stepRes)
	{
		if (stepErr !== null)
		{
			// Error - Abort connection.
			resolveDatabaseStepError(advertiserConnectionObject, stepErr, databaseStepsCallback);
		}
		else
		{
			// Successful - Close connection.
			dbConnection.closeConnection(advertiserConnectionObject, databaseStepsCallback);
		}
	});
}



// Loops case objects, resolving advertiser references.
function callCaseLoop(advertiserConnection, caseObjects, caseLoopCallback)
{
	asyncModule.eachSeries(caseObjects,
	function (currentCaseObject, caseIterationCallback)
	{
		handleCurrentCase(currentCaseObject, advertiserConnection, caseIterationCallback);
	},
	function (caseLoopErr, caseLoopRes)
	{
		// Loop complete.
		if (caseLoopErr !== null)
		{
			return caseLoopCallback(caseLoopErr, null);
		}
		else
		{
			return caseLoopCallback(null, true);
		}
	});
}


// Fixes reference for current case object.
function handleCurrentCase(caseObject, advConnObject, handleCallback)
{
	if (caseObject.advertiser.length > 0)
	{
		// Advertiser name scraped - Handle reference.
		callSelect(advConnObject, caseObject, handleCallback);
	}
	else
	{
		// Advertiser unknown - Skip without error.
		cObject.advertiser = null;
		return handleCallback(null, true);
	}
}


// Queries whether a given advertiser exists in the database.
function callSelect(advConnObj, cObject, advSelectCallback)
{
	dbSelect.selectListItemExists(advConnObj, tblNames.advertiser, tblDesc.advertiser, colNames.advertiserNum, colNames.advertiserName, cObject.advertiser,
	function (adExistErr, adExistRes)
	{
		var advertiserExists = Number.isInteger(adExistRes);
		
		if (adExistErr !== null)
		{
			// Query error.
			return advSelectCallback(adExistErr, null);
		}
		else if (advertiserExists === true)
		{
			// Advertiser exists - Use ID.
			cObject.advertiser = adExistRes;
			return advSelectCallback(null, true);
		}
		else
		{
			// Advertiser does not exist - Insert.
			callInsert(advConnObj, cObject, advSelectCallback);
		}
	});
}



// Inserts a new advertiser into the database.
function callInsert(advConn, cObj, advInsertCallback)
{
	dbInsert.insertAdvertiser(advConn, tblDesc.advertiser, cObj.advertiser, function (createErr, createRes)
	{
		if (createErr !== null)
		{
			// Insert error.
			return advInsertCallback(createErr, null);
		}
		else
		{
			// Use inserted ID.
			cObj.advertiser = createRes;
			return advInsertCallback(null, true);
		}
	});
}




// Aborts database connection with error.
function resolveDatabaseStepError(stepFailConn, stepFailErr, finalCallback)
{
	asyncModule.series(
	[
		dbTransaction.cancelChanges.bind(null, stepFailConn),
		dbConnection.resolveError.bind(null, stepFailConn, stepFailErr)
	],
	function (finalErr, finalRes)
	{
		return finalCallback(finalErr, null);
	});
}





module.exports =
{
	prepareAdvertiserItems: prepareCaseListAdvertiserItems
};