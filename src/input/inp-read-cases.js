// Reads input options for the 'read-cases' command.

const optionalItems = require("./arguments/optional-items");


function prepareReadSearchPagesArguments(optArgsObj)
{
	var argumentResult = initializeResult();
	var baseObjectUsed = optionalItems.readContainer(optArgsObj);
	
	if (baseObjectUsed === true)
	{
		optionalItems.setToggle(optArgsObj, "clear", argumentResult, "clearExistingCases");
		optionalItems.setToggle(optArgsObj, "ignoreScrapeErrors", argumentResult, "ignoreScrape");
		optionalItems.setToggle(optArgsObj, "erase", argumentResult, "deletePageFiles");
	}
	
	return argumentResult;
}



function initializeResult()
{
	var intlRes = {};
	
	intlRes["clearExistingCases"] = false;
	intlRes["ignoreScrape"] = false;
	intlRes["deletePageFiles"] = false;
	
	return intlRes;
}



module.exports =
{
	prepareArgs: prepareReadSearchPagesArguments
};