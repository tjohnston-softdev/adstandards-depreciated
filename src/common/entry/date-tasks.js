// Functions used when working with dates and timestamps.

const ausDateRegex = /^(\d\d[\/\\]){2}(\d){4}$/g;				// Australian date format (eg. 30/08/2021)
const utcDateRegex = /^(\d{4})-\d\d-\d\d$/g;					// UTC date format (eg. 2021-08-30)
const timeCutoffRegex = /T.*$/gi;								// Marks timestamp character when isolating dates from ISO strings



// Converts Australian date string to UTC
function convertDateString(origStr)
{
	var correctFormat = origStr.search(ausDateRegex);
	
	var dayPart = "";
	var monthPart = "";
	var yearPart = "";
	
	var convertedDate = "";
	
	if (correctFormat >= 0 && correctFormat < origStr.length)
	{
		// Reads individual parts.
		dayPart = origStr.substr(0, 2);
		monthPart = origStr.substr(3, 2);
		yearPart = origStr.substr(6, 4);
		
		// Combines into string.
		convertedDate = [yearPart, monthPart, dayPart].join("-");
	}
	
	
	return convertedDate;
}


// Converts UTC date string to object.
function castUtcDateString(origStr)
{
	var correctFormat = origStr.search(utcDateRegex);
	var castRes = null;
	
	if (correctFormat >= 0 && correctFormat < origStr.length)
	{
		// Valid format. Cast as object.
		castRes = new Date(origStr);
	}
	else
	{
		// Invalid format
		castRes = new Date("INVALID");
	}
	
	return castRes;
}



// Checks whether a given string corresponds to a valid date.
function checkValidDateObject(dateStr)
{
	var dateDefinition = Date.parse(dateStr);
	var checkRes = Number.isInteger(dateDefinition);
	return checkRes;
}


// Reads current timestamp.
function getCurrentTimestampString()
{
	var dateObject = new Date();
	var timestampRes = writeTimestampString(dateObject);
	return timestampRes;
}


// Writes date object into a readable timestamp string.
function writeTimestampString(tsObject)
{
	var writtenString = "";
	
	writtenString = tsObject.toISOString();
	writtenString = writtenString.replace("T", " ");
	writtenString = writtenString.replace("Z", "");
	
	return writtenString;
}


// Reads date string from object.
function extractDateFromTimestamp(tsObject)
{
	var writtenString = "";
	
	writtenString = tsObject.toISOString();
	writtenString = writtenString.replace(timeCutoffRegex, "");
	
	return writtenString;
}



module.exports =
{
	convertString: convertDateString,
	castUtcDate: castUtcDateString,
	checkValidDate: checkValidDateObject,
	getCurrentTimestamp: getCurrentTimestampString,
	writeTimestamp: writeTimestampString,
	extractDate: extractDateFromTimestamp
};