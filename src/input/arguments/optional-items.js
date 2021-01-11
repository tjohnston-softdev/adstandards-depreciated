// These functions are used to read command options (eg. 'ignore-scrape-errors')

const valueType = require("../../common/value-type");


// Checks whether the options object has been passed successfully.
function readContainerObject(cObj)
{
	var correctType = valueType.checkObject(cObj);
	return correctType;
}


// Reads option into validation result object.
function setToggleArgument(origEntry, pEntry, resEntry, pResult)
{
	var givenValue = origEntry[pEntry];
	var correctType = valueType.checkBoolean(givenValue);
	
	if (correctType === true)
	{
		resEntry[pResult] = true;
	}
	
}


// Reads option stand-alone.
function getToggleArgument(origEntry, pEntry)
{
	var givenValue = origEntry[pEntry];
	var correctType = valueType.checkBoolean(givenValue);
	var valueRes = false;
	
	if (correctType === true)
	{
		valueRes = true;
	}
	
	return valueRes;
}



module.exports =
{
	readContainer: readContainerObject,
	setToggle: setToggleArgument,
	getToggle: getToggleArgument
};