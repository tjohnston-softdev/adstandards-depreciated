/*
	Checks whether the target import files already exist.
	This does not flag any errors. Files that do not exist will be skipped.
	Used in the 'import' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const fileExists = require("../common/file-management/file-exists");
const dataDesc = require("../common/interface/general/data-desc");


function verifyImportFilePaths(importInputObject, pathVerifyCallback)
{
	var filePathSpinner = ora("Verifying Import File Paths").start();
	
	asyncModule.series(
	{
		"advertiserData": fileExists.checkOptional.bind(null, importInputObject.advertiserPath, dataDesc.advertiser),
		"productData": fileExists.checkOptional.bind(null, importInputObject.productCategoryPath, dataDesc.productCategory),
		"mediaData": fileExists.checkOptional.bind(null, importInputObject.mediaTypesPath, dataDesc.mediaType),
		"caseData": fileExists.checkOptional.bind(null, importInputObject.casesPath, dataDesc.caseFile)
	},
	function (verPthErr, verPthRes)
	{
		if (verPthErr !== null)
		{
			filePathSpinner.fail("Import Path Verification Error");
			return pathVerifyCallback(verPthErr, null);
		}
		else
		{
			filePathSpinner.succeed("Import Paths Ready");
			return pathVerifyCallback(null, verPthRes);
		}
	});
}




module.exports =
{
	verifyPaths: verifyImportFilePaths
};