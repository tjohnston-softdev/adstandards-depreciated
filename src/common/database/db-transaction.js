// Contains functions for handling database transactions on a given connection.

const dbErrorText = require("./errors/db-error-text");


// Begin transaction.
function beginDatabaseTransaction(connObj, beginCallback)
{
	var flaggedMessage = "";
	
	connObj.beginTransaction(function (tError)
	{
		if (tError !== undefined && tError !== null)
		{
			flaggedMessage = dbErrorText.writeTransaction();
			return beginCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return beginCallback(null, true);
		}
	});
}



// Transaction successful - Save data.
function commitDatabaseTransaction(connObj, commitCallback)
{
	var flaggedMessage = "";
	
	connObj.commit(function (tError)
	{
		if (tError !== undefined && tError !== null)
		{
			flaggedMessage = dbErrorText.writeSave();
			return commitCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return commitCallback(null, true);
		}
	});
}


// Transaction unsuccessful - Rollback entered data.
function cancelDatabaseTransaction(connObj, cancelCallback)
{
	connObj.rollback(function()
	{
		return cancelCallback(null, true);
	});
}





module.exports =
{
	beginTransaction: beginDatabaseTransaction,
	commitChanges: commitDatabaseTransaction,
	cancelChanges: cancelDatabaseTransaction
};