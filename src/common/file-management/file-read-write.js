/*
	* These functions are used for reading and writing files.
	* This does not include streaming.
*/

const fs = require("fs");
const fsGeneralText = require("./errors/fs-general-text");
const ioErrorText = require("./errors/io-error-text");


// Read existing file.
function getFileContents(targetPathString, fileDescription, readCallback)
{
	var flaggedMessage = "";
	
	fs.readFile(targetPathString, "utf8", function (readError, readData)
	{
		if (readError !== null)
		{
			flaggedMessage = ioErrorText.writeFileAction(readError.code, "reading", fileDescription, targetPathString);
			return readCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return readCallback(null, readData);
		}
	});
}


// Write new file.
function writeFileContents(targetPathString, outputContents, plainText, fileDescription, writeCallback)
{
	var writeOptions = getWriteOptions(plainText);
	var flaggedMessage = "";
	
	fs.writeFile(targetPathString, outputContents, writeOptions, function (writeError)
	{
		if (writeError !== null)
		{
			flaggedMessage = ioErrorText.writeFileAction(writeError.code, "writing", fileDescription, targetPathString);
			return writeCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return writeCallback(null, true);
		}
	});
	
	
}

// Retrieve file write stream settings.
function getWriteStreamOptionsObject()
{
	var optRes =
	{
		flags: "w",
		encoding: "utf8",
		mode: 0o666,
		autoClose: true,
		emitClose: true,
		start: 0
	};
	
	return optRes;
}



// Retrieves file write options. Encoding is different based on contents.
function getWriteOptions(pTxt)
{
	var optRes = {};
	
	optRes["flag"] = "w";
	optRes["encoding"] = "binary";
	
	if (pTxt === true)
	{
		optRes.encoding = "utf8";
	}
	
	return optRes;
}



module.exports =
{
	getContents: getFileContents,
	writeContents: writeFileContents,
	getWriteStreamOptions: getWriteStreamOptionsObject
};