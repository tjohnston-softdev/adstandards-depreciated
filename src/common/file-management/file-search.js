// These functions help search for target entries within the file system.

const glob = require("glob");
const fsGeneralText = require("./errors/fs-general-text");
const numberRegex = /(\d)+/;
const searchOptions = {"nodir": true};


// Retrieves all stored page HTML files.
function getSavedPageFiles(fileSyntax, fileSearchDescription, searchCallback)
{
	var flaggedMessage = "";
	
	glob(fileSyntax, searchOptions, function (searchErr, searchRes)
	{
		if (searchErr !== null)
		{
			// Error searching pages.
			flaggedMessage = fsGeneralText.writeFileSearch(fileSearchDescription, fileSyntax);
			return searchCallback(new Error(flaggedMessage), null);
		}
		else
		{
			// Sorts page file paths into numeric order.
			prepareFileResults(searchRes);
			sortFileResults(searchRes);
			return searchCallback(null, searchRes);
		}
	});
}


// Retrieves target advertisement case report PDF file.
function getSavedReportFile(fileSyntax, fileSearchDescription, searchCallback)
{
	var retrievedPath = "";
	var flaggedMessage = "";
	
	glob(fileSyntax, searchOptions, function (searchErr, searchRes)
	{
		if (searchErr !== null)
		{
			// Error searching reports.
			flaggedMessage = fsGeneralText.writeFileSearch(fileSearchDescription, fileSyntax);
			return searchCallback(new Error(flaggedMessage), null);
		}
		else if (searchRes.length > 0)
		{
			// Report found.
			retrievedPath = searchRes[0];
			return searchCallback(null, retrievedPath);
		}
		else
		{
			// Report not found.
			return searchCallback(null, "");
		}
	});
	
}


// Counts number of files that match a given syntax.
function getSearchMatchCount(searchSyntax, searchDescription, searchCallback)
{
	var flaggedMessage = "";
	
	glob(searchSyntax, searchOptions, function (searchErr, searchRes)
	{
		if (searchErr !== null)
		{
			flaggedMessage = fsGeneralText.writeFileSearch(searchDescription, searchSyntax);
			return searchCallback(new Error(flaggedMessage), null);
		}
		else
		{
			return searchCallback(null, searchRes.length);
		}
	});
	
}


// Defines sort order for a list of page HTML file paths.
function prepareFileResults(matchArr)
{
	var matchIndex = 0;
	var currentPath = "";
	var currentNumberValue = -1;
	var currentPreparedResult = {};
	
	for (matchIndex = 0; matchIndex < matchArr.length; matchIndex = matchIndex + 1)
	{
		currentPath = matchArr[matchIndex];
		currentNumberValue = isolateNumber(currentPath);
		currentPreparedResult = {"pathString": currentPath, "orderNumber": currentNumberValue};
		
		matchArr[matchIndex] = currentPreparedResult;
	}
	
}


// Sorts page HTML file path objects into numeric order.
function sortFileResults(matchArr)
{
	matchArr.sort(function (a, b)
	{
		return a.orderNumber - b.orderNumber;
	});
}


// Reads first number from file path string.
function isolateNumber(pthStr)
{
	var numberList = [];
	var arrayRetrieved = false;
	var isolatedString = "";
	var castValue = -1;
	var numberRetrieved = false;
	
	var isolateRes = -1;
	
	// Searches for numbers within the file path.
	numberList = pthStr.match(numberRegex);
	arrayRetrieved = Array.isArray(numberList);
	
	
	if (arrayRetrieved === true && numberList.length > 0)
	{
		// Read first number.
		isolatedString = numberList[0];
		castValue = Number(isolatedString);
		numberRetrieved = Number.isInteger(castValue);
	}
	
	
	if (numberRetrieved === true)
	{
		// Number read successful.
		isolateRes = castValue;
	}
	
	
	return isolateRes;
}





module.exports =
{
	getSavedPages: getSavedPageFiles,
	getSavedReport: getSavedReportFile,
	getMatchCount: getSearchMatchCount
};