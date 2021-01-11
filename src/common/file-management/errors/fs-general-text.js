// Functions write messages for general file system errors.

const path = require("path");


function writeFileTooLargeText(vDesc, vSizeLabel)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " cannot be larger than ";
	writeRes += vSizeLabel;
	
	return writeRes;
}


function writeFileEmptyText(vDesc)
{
	var writeRes = vDesc + " cannot be empty.";
	return writeRes;
}


function writeInvalidFileText(vDesc, vPath)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " is not a valid file\n";
	writeRes += path.resolve(vPath);
	
	return writeRes;
}


function writeInvalidJsonText(vDesc, vPath)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " does not contain valid JSON data.\n";
	writeRes += path.resolve(vPath);
	
	return writeRes;
}


function writeFolderCreateText(vDesc, vPath)
{
	var writeRes = "";
	
	writeRes += "Error creating ";
	writeRes += vDesc;
	writeRes += " folder.\n";
	writeRes += path.resolve(vPath);
	
	return writeRes;
}


function writeFolderDeleteText(vDesc, vPath)
{
	var writeRes = "";
	
	writeRes += "Error deleting ";
	writeRes += vDesc;
	writeRes += "folder.\n";
	writeRes += path.resolve(vPath);
	
	return writeRes;
}


function writeFileSearchText(vDesc, vSyntax)
{
	var writeRes = "";
	
	writeRes += "Error searching for ";
	writeRes += vDesc;
	writeRes += " files.\n";
	
	writeRes += "Syntax: ";
	writeRes += vSyntax;
	
	return writeRes;
}


function writeFileExistsText(vDesc, vPath)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " already exists.\n";
	writeRes += path.resolve(vPath);
	
	return writeRes;
}




module.exports =
{
	writeFileTooLarge: writeFileTooLargeText,
	writeFileEmpty: writeFileEmptyText,
	writeInvalidFile: writeInvalidFileText,
	writeInvalidJson: writeInvalidJsonText,
	writeFolderCreate: writeFolderCreateText,
	writeFolderDelete: writeFolderDeleteText,
	writeFileSearch: writeFileSearchText,
	writeFileExists: writeFileExistsText
};