/*
	This file is responsible for saving the advertisement cases landing page.
	This is after it has been downloaded.
	Used in the 'download-pages' command.
*/

const path = require("path");
const ora = require("ora");
const storedPaths = require("../../stored-paths");
const fileNames = require("../common/file-management/file-names");
const fileExists = require("../common/file-management/file-exists");
const fileReadWrite = require("../common/file-management/file-read-write");
const webDesc = require("../common/interface/general/web-desc");


// Main function.
function writeLandingPageFile(landHTMLDefinition, landOverwriteToggle, fileSaveCallback)
{
	var fileSpinner = ora("Saving Landing Page File").start();
	
	coordinateSave(landHTMLDefinition, landOverwriteToggle, function (landingPageError, landingPageRes)
	{
		if (landingPageError !== null)
		{
			fileSpinner.fail("Landing Page File Error");
			return fileSaveCallback(landingPageError, null);
		}
		else
		{
			fileSpinner.succeed("Landing Page Saved");
			return fileSaveCallback(null, true);
		}
	});
	
}


// Task function.
function coordinateSave(htmlDefinition, overwriteToggle, saveCallback)
{
	// Prepares target file path.
	var pFileName = fileNames.writePage(1);
	var pFullPath = path.join(storedPaths.pageFolder, pFileName);
	
	
	// Checks whether landing page file exists.
	fileExists.checkOptional(pFullPath, webDesc.landingPage, function (existErr, existRes)
	{
		if (existErr !== null)
		{
			// Exist check error.
			return saveCallback(existErr, null);
		}
		else if (existRes === true && overwriteToggle === true)
		{
			// File exists - Can be overwritten.
			handleWrite(pFullPath, htmlDefinition, saveCallback);
		}
		else if (existRes === true)
		{
			// File exists - Continue.
			return saveCallback(null, true);
		}
		else
		{
			// File does not exist - Save.
			handleWrite(pFullPath, htmlDefinition, saveCallback);
		}
	});
}


// Save HTML file.
function handleWrite(fullPath, htmlDef, handleCallback)
{
	fileReadWrite.writeContents(fullPath, htmlDef, true, webDesc.landingPage, function (fwError, fwRes)
	{
		if (fwError !== null)
		{
			// Write error.
			return handleCallback(fwError, null);
		}
		else
		{
			// Write successful.
			return handleCallback(null, true);
		}
	});
}




module.exports =
{
	writeLandingPage: writeLandingPageFile
};