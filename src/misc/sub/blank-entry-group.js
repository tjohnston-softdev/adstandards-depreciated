// Retrieves current set of 'CaseFile' query rows with unknown data (../unk-file-write.js)

const dbConnection = require("../../common/database/db-connection");
const dbSelect = require("../../common/database/db-select");
const tblDesc = require("../../common/interface/schema/tbl-desc");


// Main function.
function retrieveUnknownEntriesRowGroup(loopCountNumber, groupSizeNumber, retrievalCallback)
{
	// Establishes database connection.
	dbConnection.openConnection(false, function (entryOpenErr, entryOpenRes)
	{
		if (entryOpenErr !== null)
		{
			return retrievalCallback(entryOpenErr, null);
		}
		else
		{
			queryUnknownEntries(entryOpenRes, loopCountNumber, groupSizeNumber, retrievalCallback);
		}
	});
}


// Perform row query.
function queryUnknownEntries(unknownEntryConn, loopCountNum, groupSizeNum, qUnkEntCallback)
{
	var currentOffset = groupSizeNum * loopCountNum;
	
	dbSelect.selectUnknownEntryData(unknownEntryConn, tblDesc.caseFile, currentOffset, groupSizeNum, function (queryErr, queryRes)
	{
		if (queryErr !== null)
		{
			// Abort connection with error.
			dbConnection.resolveError(unknownEntryConn, queryErr, qUnkEntCallback);
		}
		else
		{
			// Query successful.
			closeUnknownEntryConnection(unknownEntryConn, queryRes, qUnkEntCallback);
		}
	});
}



// Closes database connection with successful result.
function closeUnknownEntryConnection(eConn, gRows, finalCallback)
{
	dbConnection.closeConnection(eConn, function (closeErr, closeRes)
	{
		if (closeErr !== null)
		{
			return finalCallback(closeErr, null);
		}
		else
		{
			return finalCallback(null, gRows);
		}
	});
}




module.exports =
{
	retrieveGroup: retrieveUnknownEntriesRowGroup
};