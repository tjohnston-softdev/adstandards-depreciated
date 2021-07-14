/*
	Saves file downloaded from HTTP request.
	Used as part of: '../page-req.js' and '../report-req.js'
*/

const fileReadWrite = require("../../common/file-management/file-read-write");


// Main function.
function saveDownloadedFile(pFileContents, oPathString, sFileDescription, plainTextType, saveCallback)
{
	fileReadWrite.writeContents(oPathString, pFileContents, plainTextType, sFileDescription, function (fileSaveErr, fileSaveRes)
	{
		if (fileSaveErr !== null)
		{
			// File save error.
			return saveCallback(fileSaveErr, null);
		}
		else
		{
			// Save successful - Wait to confirm.
			enforceDelay(saveCallback);
		}
	});
	
}


// Allows file to save properly and mitigates request limits.
function enforceDelay(sDelayCallback)
{
	setTimeout(function()
	{
		return sDelayCallback(null, true);
	}, 100);
}



module.exports =
{
	saveFile: saveDownloadedFile
};