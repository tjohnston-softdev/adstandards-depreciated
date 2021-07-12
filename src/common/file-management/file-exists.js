// Functions used to check whether a given file exists.

const fs = require("fs");
const fsGeneralText = require("./errors/fs-general-text");
const ioErrorText = require("./errors/io-error-text");


// Required with size limit.
function checkFileExistsRequired(targetPathString, fileDescription, sizeObject, existCallback)
{
	var flaggedMessage = "";
	
	fs.stat(targetPathString, function (fileError, statObject)
	{
		if (fileError !== null)
		{
			// File check error.
			flaggedMessage = ioErrorText.writeFileAction(fileError.code, "checking", fileDescription, targetPathString);
			return existCallback(new Error(flaggedMessage), null);
		}
		else
		{
			// Validates file system entry.
			verifyFileData(statObject, targetPathString, fileDescription, sizeObject, existCallback);
		}
	});
}


// Optional
function checkFileExistsOptional(targetPathString, fileDescription, existCallback)
{
	var correctType = false;
	var flaggedMessage = "";
	
	fs.stat(targetPathString, function (fileError, statObject)
	{
		if (fileError !== null && fileError.code === "ENOENT")
		{
			// File system entry does not exist.
			return existCallback(null, false);
		}
		else if (fileError !== null)
		{
			// File check error.
			flaggedMessage = ioErrorText.writeFileAction(fileError.code, "checking", fileDescription, targetPathString);
			return existCallback(new Error(flaggedMessage), null);
		}
		else
		{
			// File system entry exists.
			correctType = statObject.isFile();
			return existCallback(null, correctType);
		}
	});
	
}



// Checks whether an entry is a valid file within a certain size limit.
function verifyFileData(dataObj, tPathStr, fileDesc, sizeObj, fileDataCallback)
{
	var verifyMessage = "";
	var validFile = dataObj.isFile();
	
	
	if (validFile === true && dataObj.size > 0 && dataObj.size <= sizeObj.maxSize)
	{
		// Valid file with safe size.
		return fileDataCallback(null, true);
	}
	else if (validFile === true && dataObj.size > sizeObj.maxSize)
	{
		// Too large.
		verifyMessage = fsGeneralText.writeFileTooLarge(fileDesc, sizeObj.sizeLabel);
		return fileDataCallback(new Error(verifyMessage), null);
	}
	else if (validFile === true)
	{
		// Empty
		verifyMessage = fsGeneralText.writeFileEmpty(fileDesc);
		return fileDataCallback(new Error(verifyMessage), null);
	}
	else
	{
		// Entry does not refer to file.
		verifyMessage = fsGeneralText.writeInvalidFile(fileDesc, tPathStr);
		return fileDataCallback(new Error(verifyMessage), null);
	}
	
}



module.exports =
{
	checkRequired: checkFileExistsRequired,
	checkOptional: checkFileExistsOptional
};