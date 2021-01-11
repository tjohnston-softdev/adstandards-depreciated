// Imports current set of exported rows into the database (../read-import-files.js)

const asyncModule = require("async");
const dbConnection = require("../../common/database/db-connection");
const dbTransaction = require("../../common/database/db-transaction");
const dbInsert = require("../../common/database/db-insert");



// Main function.
function insertCurrentRowGroup(objectList, insInfoObject, insGroupCallback)
{
	// Establish database connection.
	dbConnection.openConnection(false, function (insOpenErr, insOpenRes)
	{
		if (insOpenErr !== null)
		{
			return insGroupCallback(insOpenErr, null);
		}
		else
		{
			performInsertSteps(insOpenRes, objectList, insInfoObject, insGroupCallback);
		}
	});
}


// Insert rows into database.
function performInsertSteps(rowGroupConnection, objList, insInfo, insertStepsCallback)
{
	asyncModule.series(
	[
		dbTransaction.beginTransaction.bind(null, rowGroupConnection),
		dbInsert.insertImportedData.bind(null, rowGroupConnection, insInfo.schemaName, insInfo.schemaDesc, objList),
		dbTransaction.commitChanges.bind(null, rowGroupConnection)
	],
	function (stepErr, stepRes)
	{
		if (stepErr !== null)
		{
			// Insert error.
			cancelGroupInsert(rowGroupConnection, stepErr, insertStepsCallback);
		}
		else
		{
			// Insert successful.
			dbConnection.closeConnection(rowGroupConnection, insertStepsCallback);
		}
	});
}



// Aborts database connection with error.
function cancelGroupInsert(rGrpConn, insFailError, finalCallback)
{
	asyncModule.series(
	[
		dbTransaction.cancelChanges.bind(null, rGrpConn),
		dbConnection.resolveError.bind(null, rGrpConn, insFailError)
	],
	function (overallErr)
	{
		return finalCallback(overallErr, null);
	});
}





module.exports =
{
	insertCurrentGroup: insertCurrentRowGroup
};