// These functions are used to help write exported table data (../write-export-files.js)

const papaparse = require("papaparse");
const charShortcuts = require("../../common/char-shortcuts");
const dateTasks = require("../../common/entry/date-tasks");



// Formats 'CaseFile' date values as readable strings.
function prepareCaseFileDateValues(oList)
{
	var objectIndex = 0;
	var currentObject = {};
	var currentArchiveTimestamp = "";
	var currentDeterminationDate = "";
	
	
	// Loop CaseFile JSON objects.
	for (objectIndex = 0; objectIndex < oList.length; objectIndex = objectIndex + 1)
	{
		// Reads current object and prepares archive timestamp.
		currentObject = oList[objectIndex];
		currentArchiveTimestamp = dateTasks.writeTimestamp(currentObject.archiveTimestamp);
		currentDeterminationDate = "";
		
		
		// If a determination date is known, prepare it.
		if (currentObject.determinationDate !== null)
		{
			currentDeterminationDate = dateTasks.extractDate(currentObject.determinationDate);
		}
		
		currentObject.determinationDate = currentDeterminationDate;
		currentObject.archiveTimestamp = currentArchiveTimestamp;
	}
	
}


// Converts JSON object set into CSV text and writes to file.
function writeDataFileObjects(dStream, oList, queryLoop)
{
	// Include header line when writing first row group.
	var csvOptions = {"header": queryLoop.first};
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
	
	if (qLoop.first === true)
	{
		// First row group - Skip line break.
		qLoop.first = false;
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
	prepareCaseFileDates: prepareCaseFileDateValues,
	writeObjects: writeDataFileObjects
};