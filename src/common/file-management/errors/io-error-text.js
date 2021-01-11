/*
	Parses a file system error into a readable message.
	This includes:
		* Error code
		* The action being performed (context)
		* File description
		* Target path
*/


const path = require("path");


function writeFileActionText(errCode, vContext, vDesc, vPath)
{
	var writeRes = "";
	
	writeRes += "Error ";
	writeRes += vContext;
	writeRes += " ";
	writeRes += vDesc;
	writeRes += " - ";
	writeRes += getErrorDescription(errCode);
	writeRes += "\n";
	writeRes += path.resolve(vPath);
	
	return writeRes;
}



function getErrorDescription(eCode)
{
	var chosenDescription = "";
	
	if (eCode === "EACCES" || eCode === "EPERM")
	{
		chosenDescription = "Operation not allowed.";
	}
	else if (eCode === "EISDIR")
	{
		chosenDescription = "Invalid file.";
	}
	else if (eCode === "EMFILE")
	{
		chosenDescription = "Too many files are already open.";
	}
	else if (eCode === "ENOENT")
	{
		chosenDescription = "Path does not exist.";
	}
	else
	{
		chosenDescription = "Unknown exception. " + eCode;
	}
	
	return chosenDescription;
}



module.exports =
{
	writeFileAction: writeFileActionText
};