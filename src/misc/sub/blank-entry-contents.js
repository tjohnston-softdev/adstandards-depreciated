// These functions are used to help write 'CaseFile' entries with unknown data (../unk-file-write.js)

const papaparse = require("papaparse");
const charShortcuts = require("../../common/char-shortcuts");
const dateTasks = require("../../common/entry/date-tasks");


// Formats determination date property as a readable string.
function prepareDeterminationDates(oList)
{
	var objectIndex = 0;
	var currentObject = {};
	var currentPreparedDate = "";
	
	// Loops data objects.
	for (objectIndex = 0; objectIndex < oList.length; objectIndex = objectIndex + 1)
	{
		currentObject = oList[objectIndex];
		currentPreparedDate = "";
		
		// If there is a determination date, format it.
		if (currentObject.date !== null)
		{
			currentPreparedDate = dateTasks.extractDate(currentObject.date);
		}
		
		currentObject.date = currentPreparedDate;
	}
	
}


// Converts JSON object set into CSV text and writes to file.
function writeEntryDataLines(dStream, oList, queryLoop)
{
	// Include header line when writing first row group.
	var csvOptions = {"header": queryLoop.firstGroup};
	var preparedText = "";
	
	preparedText += handleBreak(queryLoop);
	preparedText += papaparse.unparse(oList, csvOptions);
	
	// Write to file.
	dStream.write(preparedText);
}


// Used to handle line breaks between row groups.
function handleBreak(qLoop)
{
	var breakRes = "";
	
	if (qLoop.firstGroup === true)
	{
		// First row group - Skip line break.
		qLoop.firstGroup = false;
	}
	else
	{
		// Include.
		breakRes = charShortcuts.lineBreak;
	}
	
	return breakRes;
}



module.exports =
{
	preparedDates: prepareDeterminationDates,
	writeLines: writeEntryDataLines
};