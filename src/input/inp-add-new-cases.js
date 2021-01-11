// Reads the 'ignore-scrape-errors' option for the 'add-new-cases' command.

const optionalItems = require("./arguments/optional-items");


function prepareIgnoreScrapeErrorsArgument(optArgsObj)
{
	var baseObjectUsed = optionalItems.readContainer(optArgsObj);
	var argumentResult = false;
	
	if (baseObjectUsed === true)
	{
		argumentResult = optionalItems.getToggle(optArgsObj, "ignoreScrapeErrors");
	}
	
	return argumentResult;
}



module.exports =
{
	prepareArg: prepareIgnoreScrapeErrorsArgument
};