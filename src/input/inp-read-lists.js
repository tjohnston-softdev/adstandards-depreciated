// Reads input options for the 'read-lists' command.

const optionalItems = require("./arguments/optional-items");

function prepareReadListArguments(optArgsObj)
{
	var argumentResult = {"ignoreScrape": false};
	var baseObjectUsed = optionalItems.readContainer(optArgsObj);
	
	if (baseObjectUsed === true)
	{
		optionalItems.setToggle(optArgsObj, "ignoreScrapeErrors", argumentResult, "ignoreScrape");
	}
	
	return argumentResult;
}


module.exports =
{
	prepareArgs: prepareReadListArguments
};