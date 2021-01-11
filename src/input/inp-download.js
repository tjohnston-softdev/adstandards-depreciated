// Reads input options for the 'download-pages' and 'download-reports' commands.

const optionalItems = require("./arguments/optional-items");



function prepareDownloadArguments(optArgsObj)
{
	var argumentResult = initializeResults();
	var baseObjectUsed = optionalItems.readContainer(optArgsObj);
	
	if (baseObjectUsed === true)
	{
		optionalItems.setToggle(optArgsObj, "clear", argumentResult, "removeExistingFiles");
		optionalItems.setToggle(optArgsObj, "allowTimeout", argumentResult, "allowRequestDelay");
		optionalItems.setToggle(optArgsObj, "overwrite", argumentResult, "overwriteExistingFiles");
	}
	
	return argumentResult;
}



function initializeResults()
{
	var intlRes = {};
	
	intlRes["removeExistingFiles"] = false;
	intlRes["allowRequestDelay"] = false;
	intlRes["overwriteExistingFiles"] = false;
	
	return intlRes;
}




module.exports =
{
	prepareArgs: prepareDownloadArguments
};