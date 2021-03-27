// Functions used to assist with input validation.

const validator = require("validator");							// Used to sanitize unsafe characters.
const spaceRegex = /[\s]+/g;									// RegEx flags all spaces.
const caseNumberSyntax = /^([A-Za-z0-9])+-\d\d$/g;				// Valid advertisement case code RegEx



// Checks for valid object.
function checkObjectType(subjectValue)
{
	var givenType = typeof subjectValue;
	var checkRes = false;
	
	if (subjectValue !== undefined && subjectValue !== null && givenType === "object")
	{
		checkRes = true;
	}
	
	return checkRes;
}


// Checks for valid string (empty or otherwise)
function checkStringType(subjectValue)
{
	var checkRes = (typeof subjectValue === "string");
	return checkRes;
}


// Checks if True or False.
function checkBooleanType(subjectValue)
{
	var checkRes = false;
	
	if (subjectValue === true || subjectValue === false)
	{
		checkRes = true;
	}
	
	return checkRes;
}


// Checks for binary number.
function checkTrueFalseFlagType(subjectValue)
{
	var checkRes = false;
	
	if (subjectValue === 0 || subjectValue === 1)
	{
		checkRes = true;
	}
	
	return checkRes;
}



// Checks if advertisement case key string has a valid format.
function checkCaseNumberValidSyntax(subjectString)
{
	var matchFlag = subjectString.search(caseNumberSyntax);
	var checkRes = false;
	
	if (matchFlag >= 0 && matchFlag < subjectString.length)
	{
		checkRes = true;
	}
	
	return checkRes;
}



// Prepares input strings by trimming excess space and moderating unsafe characters.
function sanitizeInputString(origStr)
{
	var sanitizeRes = origStr;
	
	sanitizeRes = sanitizeRes.trim();
	sanitizeRes = sanitizeRes.replace(spaceRegex, " ");
	sanitizeRes = validator.unescape(sanitizeRes);
	
	return sanitizeRes;
}





module.exports =
{
	checkObject: checkObjectType,
	checkString: checkStringType,
	checkBoolean: checkBooleanType,
	checkTrueFalseFlag: checkTrueFalseFlagType,
	checkCaseNumberSyntax: checkCaseNumberValidSyntax,
	sanitizeString: sanitizeInputString
};