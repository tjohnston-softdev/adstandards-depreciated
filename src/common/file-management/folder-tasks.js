// Functions used to create or delete folders.

const path = require("path");
const fs = require("fs");
const fsExtra = require("fs-extra");
const fsGeneralText = require("./errors/fs-general-text")


// Recursively creates folders in a given path.
function prepareFolderPath(targetPathString, folderDescription, folderCallback)
{
	var dirOptions = {"recursive": true};
	var flaggedMessage = "";
	
	fs.mkdir(targetPathString, dirOptions, function (folderErr)
	{
		if (folderErr !== null)
		{
			flaggedMessage = fsGeneralText.writeFolderCreate(folderDescription, targetPathString);
			return folderCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return folderCallback(null, true);
		}
	});
	
}

// Removes existing folder.
function deleteFolderPath(targetPathString, folderDescription, folderCallback)
{
	var flaggedMessage = "";
	
	fsExtra.remove(targetPathString, function (folderErr)
	{
		if (folderErr !== null)
		{
			flaggedMessage = fsGeneralText.writeFolderDelete(folderDescription, targetPathString);
			return folderCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return folderCallback(null, true);
		}
	});
}




module.exports =
{
	preparePath: prepareFolderPath,
	deletePath: deleteFolderPath
};