/*
	Filters a collection of case objects to only include those from a certain date.
	Cases scraped from pages should be in 'most recent' order.
	When the cutoff date is passed, the loop ends.
	Used in '../new-case-data.js'
*/



const dateTasks = require("../../common/entry/date-tasks");


// Main function
function filterNewCaseObjects(pageObjects, savedObjects, loopSettings)
{
	var currentCase = {};
	var currentDate = null;
	
	while (pageObjects.length > 0 && loopSettings.canContinue === true)
	{
		currentCase = pageObjects[0];
		currentDate = readCaseDate(currentCase);
		
		if (currentDate > loopSettings.cutoffDate)
		{
			// After cutoff date - Save object.
			savedObjects.push(currentCase);
			pageObjects.splice(0, 1);
		}
		else
		{
			// Before cutoff date - End loop.
			loopSettings.canContinue = false;
		}
		
	}
	
}


// Reads determination date from current case (default: now)
function readCaseDate(cObject)
{
	var dateValid = dateTasks.checkValidDate(cObject.date);
	var chosenDate = new Date();
	
	if (dateValid === true)
	{
		chosenDate = new Date(cObject.date);
	}
	
	return chosenDate;
}




module.exports =
{
	filterNewCases: filterNewCaseObjects
};