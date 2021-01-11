/*
	Reads current group of report file entries from the database.
	Entries are retrieved and downloaded in groups.
	Used in '../report-req.js'
*/


const dbConnection = require("../../common/database/db-connection");
const dbSelect = require("../../common/database/db-select");
const tblDesc = require("../../common/interface/schema/tbl-desc");
const valueLimits = require("../../common/value-limits");



// Main function - Establish database connection.
function getReportFileGroup(iterationObject, fileGroupCallback)
{
	dbConnection.openConnection(false, function (fileConnectionError, fileConnectionRes)
	{
		if (fileConnectionError !== null)
		{
			return fileGroupCallback(fileConnectionError, null);
		}
		else
		{
			callGroupQuery(iterationObject, fileConnectionRes, fileGroupCallback);
		}
	});
}


// Perform group query.
function callGroupQuery(iterObj, reportConnObject, fileGrpCallback)
{
	var calculatedOffset = iterObj.count * valueLimits.fileGroupSize;
	
	dbSelect.selectCaseDocumentLinks(reportConnObject, tblDesc.reportFile, calculatedOffset, valueLimits.fileGroupSize, function (docErr, docRes)
	{
		if (docErr !== null)
		{
			// Abort connection with error.
			dbConnection.resolveError(reportConnObject, docErr, fileGrpCallback);
		}
		else
		{
			// Query successful.
			callSuccessfulOutcome(reportConnObject, docRes, fileGrpCallback);
		}
	});
}



// Close connection with successful result.
function callSuccessfulOutcome(reportConn, grpRows, finalCallback)
{
	dbConnection.closeConnection(reportConn, function (closeErr, closeRes)
	{
		if (closeErr !== null)
		{
			return finalCallback(closeErr, null);
		}
		else
		{
			return finalCallback(null, grpRows);
		}
	});
}





module.exports =
{
	getGroup: getReportFileGroup
};