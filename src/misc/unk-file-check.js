// This file is responsible for checking the output target path when running the 'unknown' command.

const ora = require("ora");
const fileExists = require("../common/file-management/file-exists");
const fsDesc = require("../common/interface/general/fs-desc");


// Main function.
function verifyUnknownOutputFilePath(oFilePath, overwriteAllowedStatus, pathVerifyCallback)
{
	var unknownPathSpinner = ora("Verifying Output Path").start();
	
	coordinatePathCheck(oFilePath, overwriteAllowedStatus, function (verifyErr, verifyRes)
	{
		if (verifyErr !== null)
		{
			unknownPathSpinner.fail("Output Path Error");
			return pathVerifyCallback(verifyErr, null);
		}
		else
		{
			unknownPathSpinner.succeed("Output Path Verified");
			return pathVerifyCallback(null, true);
		}
	});
}


// Coordinate target path check.
function coordinatePathCheck(oPath, overwriteAllowed, pathCheckCallback)
{
	if (overwriteAllowed === true)
	{
		// Overwrite existing file.
		return pathCheckCallback(null, true);
	}
	else
	{
		// Check if file path is available.
		fileExists.checkMissing(oPath, fsDesc.outputFile, pathCheckCallback);
	}
}



module.exports =
{
	verifyFilePath: verifyUnknownOutputFilePath
};