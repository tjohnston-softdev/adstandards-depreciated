// Performs validation for the 'import' and 'export' commands.

const inputDesc = require("../common/interface/general/input-desc");
const dataPaths = require("../common/entry/data-paths");
const pathString = require("./arguments/path-string");
const optionalItems = require("./arguments/optional-items");


// Path validation function.
function prepareImportExportArguments(givenPathValue, defaultPathValue)
{
	var argumentResult = initializeResults();
	var folderEntryValid = false;
	var folderPathValid = false;
	var filePathsValid = false;
	
	// Validates target folder path exactly as entered.
	folderEntryValid = pathString.validateRelative(givenPathValue, defaultPathValue, "targetFolderPath", inputDesc.folderPath, argumentResult);
	
	
	
	if (folderEntryValid === true)
	{
		// Validates full target folder path.
		folderPathValid = pathString.validateAbsolute(argumentResult.targetFolderPath, inputDesc.folderPath);
	}
	
	if (folderPathValid === true)
	{
		// Validates individual file paths.
		filePathsValid = handleFilePaths(argumentResult);
	}
	
	if (filePathsValid === true)
	{
		argumentResult.valid = true;
	}
	
	
	
	return argumentResult;
}


// Reads overwrite option for the 'export' command.
function prepareOverwriteArgument(optArgsObj, argumentResult)
{
	var baseObjectUsed = optionalItems.readContainer(optArgsObj);
	argumentResult["overwriteTargetFiles"] = false;
	
	if (baseObjectUsed === true)
	{
		optionalItems.setToggle(optArgsObj, "overwrite", argumentResult, "overwriteTargetFiles");
	}
	
}


// Reads ignore errors option for the 'import' command.
function prepareIgnoreErrorsArgument(optArgsObj, argumentResult)
{
	var baseObjectUsed = optionalItems.readContainer(optArgsObj);
	argumentResult["ignoreInputErrors"] = false;
	
	if (baseObjectUsed === true)
	{
		optionalItems.setToggle(optArgsObj, "ignoreErrors", argumentResult, "ignoreInputErrors");
	}
}



// Individual file paths.
function handleFilePaths(argResult)
{
	var basePath = argResult.targetFolderPath;
	
	var advertiserValid = false;
	var productCategoryValid = false;
	var mediaTypeValid = false;
	var caseValid = false;
	
	var handleRes = false;
	
	// Prepares file paths.
	argResult.advertiserPath = dataPaths.getAdvertiser(basePath);
	argResult.productCategoryPath = dataPaths.getProductCategory(basePath);
	argResult.mediaTypesPath = dataPaths.getMediaType(basePath);
	argResult.casesPath = dataPaths.getCase(basePath);
	
	
	// Validates file paths
	advValid = pathString.validateAbsolute(argResult.advertiserPath, "Advertiser File Path");
	prodCatValid = pathString.validateAbsolute(argResult.productCategoryPath, "Product Category File Path");
	medTypeValid = pathString.validateAbsolute(argResult.mediaTypesPath, "Media Type File Path");
	caseValid = pathString.validateAbsolute(argResult.casesPath, "Advertising Cases File Path");
	
	if (advValid === true && prodCatValid === true && medTypeValid === true && caseValid === true)
	{
		handleRes = true;
	}
	
	return handleRes;
}



// Validation result object.
function initializeResults()
{
	var intlRes = {};
	
	intlRes["targetFolderPath"] = "";
	intlRes["advertiserPath"] = "";
	intlRes["productCategoryPath"] = "";
	intlRes["mediaTypesPath"] = "";
	intlRes["casesPath"] = "";
	intlRes["valid"] = false;
	
	return intlRes;
}



module.exports =
{
	prepareArgs: prepareImportExportArguments,
	prepareOverwrite: prepareOverwriteArgument,
	prepareIgnoreErrors: prepareIgnoreErrorsArgument
};