/*
	This file is responsible for retrieving the paths of all saved page HTML files.
	Used in the 'read-cases' command.
*/


const ora = require("ora");
const storedPaths = require("../../stored-paths");
const fileNames = require("../common/file-management/file-names");
const fileSearch = require("../common/file-management/file-search");



// Main function.
function findSavedPageFiles(savedPageCacheCallback)
{
	var pageSpinner = ora("Retrieving Saved Page Files").start();
	
	coordinateSearch(function (retrievalError, retrievalResult)
	{
		if (retrievalError !== null)
		{
			pageSpinner.fail("Page Retrieval Error");
			return savedPageCacheCallback(retrievalError, null);
		}
		else
		{
			pageSpinner.succeed("Page Files Retrieved");
			return savedPageCacheCallback(null, retrievalResult);
		}
	});
}


// Searches for page HTML files.
function coordinateSearch(spcCallback)
{
	var targetSyntaxDefinition = fileNames.getSearchPageSyntax(storedPaths.pageFolder);
	
	fileSearch.getSavedPages(targetSyntaxDefinition, "Saved Page", function (pathError, pathRes)
	{
		return spcCallback(pathError, pathRes);
	});
}



module.exports =
{
	findSavedFiles: findSavedPageFiles
};