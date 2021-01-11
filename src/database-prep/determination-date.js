/*
	This file is responsible for reading the most recent case determination date from the database.
	Used in the 'add-new-cases' command.
*/



const ora = require("ora");
const dbConnection = require("../common/database/db-connection");
const dbSelect = require("../common/database/db-select");


// Main function.
function getLatestDeterminationDate(determineDateCallback)
{
	var dateSpinner = ora("Retrieving Latest Determination Date").start();
	
	coordinateDateRetrieval(function (overallDateErr, overallDateRes)
	{
		if (overallDateErr !== null)
		{
			dateSpinner.fail("Date Retrieval Error");
			return determineDateCallback(overallDateErr, null);
		}
		else
		{
			dateSpinner.succeed("Determination Date Retrieved");
			return determineDateCallback(null, overallDateRes);
		}
	});
	
	
}


// Coordinate retrieval. Establish database connection.
function coordinateDateRetrieval(coordDateCallback)
{
	dbConnection.openConnection(false, function (dateOpenErr, dateOpenRes)
	{
		if (dateOpenErr !== null)
		{
			return coordDateCallback(dateOpenErr, null);
		}
		else
		{
			handleDateQuery(dateOpenRes, coordDateCallback);
		}
	});
}


// Performs date query.
function handleDateQuery(dateConnection, dateQueryCallback)
{
	dbSelect.selectLatestDetermination(dateConnection, "Determination Date", function (dQueryErr, dQueryRes)
	{
		if (dQueryErr !== null)
		{
			// Query error. Abort connection and return error.
			dbConnection.resolveError(dateConnection, dQueryErr, dateQueryCallback);
		}
		else
		{
			// Successful. Close connection and return date
			closeDateConnection(dateConnection, dQueryRes, dateQueryCallback);
		}
	});
}



// Close database connection with successful result.
function closeDateConnection(dateConn, dateCell, finalCallback)
{
	dbConnection.closeConnection(dateConn, function (dateCloseErr, dateCloseRes)
	{
		if (dateCloseErr !== null)
		{
			return finalCallback(dateCloseErr, null);
		}
		else
		{
			return finalCallback(null, dateCell);
		}
	});
}




module.exports =
{
	getLatest: getLatestDeterminationDate
};