/*
	Inserts new case objects into the database after executing 'add-new-cases' command.
	Used in '../new-case-preperation.js'
*/


const asyncModule = require("async");
const dbConnection = require("../../common/database/db-connection");
const dbTransaction = require("../../common/database/db-transaction");
const dbSelect = require("../../common/database/db-select");
const dbInsert = require("../../common/database/db-insert");
const objectReduction = require("../../common/database/object-reduction");
const tblDesc = require("../../common/interface/schema/tbl-desc");


// Main function - Establish database connection.
function insertCaseListData(caseObjectList, insertCasesCallback)
{
	dbConnection.openConnection(false, function (openErr, openRes)
	{
		if (openErr !== null)
		{
			return insertCasesCallback(openErr, null);
		}
		else
		{
			performDatabaseSteps(openRes, caseObjectList, insertCasesCallback);
		}
	});
}


// Perform case insert query.
function performDatabaseSteps(caseConnObj, caseObjects, databaseStepsCallback)
{
	objectReduction.reduceCases(caseObjects);
	
	asyncModule.series(
	[
		dbTransaction.beginTransaction.bind(null, caseConnObj),
		dbInsert.insertCases.bind(null, caseConnObj, tblDesc.caseFile, caseObjects),
		dbTransaction.commitChanges.bind(null, caseConnObj)
	],
	function (stepErr, stepRes)
	{
		if (stepErr !== null)
		{
			// Insert error - Abort connection.
			resolveDatabaseStepError(caseConnObj, stepErr, databaseStepsCallback);
		}
		else
		{
			// Insert successful - Close connection.
			dbConnection.closeConnection(caseConnObj, databaseStepsCallback);
		}
	});
}


// Aborts database connection with error.
function resolveDatabaseStepError(caseConn, sError, finalCallback)
{
	asyncModule.series(
	[
		dbTransaction.cancelChanges.bind(null, caseConn),
		dbConnection.resolveError.bind(null, caseConn, sError)
	],
	function (finalErr)
	{
		return finalCallback(finalErr, null);
	});
}




module.exports =
{
	insertCaseData: insertCaseListData
};