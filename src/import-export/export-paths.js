/*
	Checks whether the target export files already exist.
	Used in the 'export' command.
*/

const asyncModule = require("async");
const ora = require("ora");
const fileExists = require("../common/file-management/file-exists");
const dataDesc = require("../common/interface/general/data-desc");


// Main function.
function verifyExportFilePaths(exportInputObject, pathVerifyCallback)
{
	var filePathSpinner = ora("Verifying Export File Paths").start();
	
	coordinatePathVerification(exportInputObject, function (verPthErr, verPthRes)
	{
		if (verPthErr !== null)
		{
			filePathSpinner.fail("Export Path Verification Error");
			return pathVerifyCallback(verPthErr, null);
		}
		else
		{
			filePathSpinner.succeed("Export Paths Ready");
			return pathVerifyCallback(null, true);
		}
	});
	
}


// Coordinate export path verification.
function coordinatePathVerification(exportInput, verifyCallback)
{
	if (exportInput.overwriteTargetFiles === true)
	{
		// Files can be overwritten. Skip checking.
		return verifyCallback(null, true);
	}
	else
	{
		// Check files already exist.
		callFilePaths(exportInput, verifyCallback);
	}
}


// Checks whether individual file paths are available.
function callFilePaths(expInp, sequenceCallback)
{
	asyncModule.series(
	[
		fileExists.checkMissing.bind(null, expInp.advertiserPath, dataDesc.advertiser),
		fileExists.checkMissing.bind(null, expInp.productCategoryPath, dataDesc.productCategory),
		fileExists.checkMissing.bind(null, expInp.mediaTypesPath, dataDesc.mediaType),
		fileExists.checkMissing.bind(null, expInp.casesPath, dataDesc.caseFile)
	],
	function (pathSetErr, pathSetRes)
	{
		return sequenceCallback(pathSetErr, pathSetRes);
	});
}




module.exports =
{
	verifyPaths: verifyExportFilePaths
};