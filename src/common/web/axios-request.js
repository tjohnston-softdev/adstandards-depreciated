// HTTP requests using 'needle' library.

const asyncModule = require("async");
const needle = require("needle");
const httpErrorText = require("./errors/http-error-text");


// Main request function.
function performFileRequest(targetUrlString, requestDescription, retryObject, plainText, fileReqCallback)
{
	var requestResult = {"retrievedBody": null, "retryAfter": 0};
	var statusMessage = "";
	
	// Runs URL request, allowing a certain number of attempts.
	asyncModule.retry(retryObject, function (attemptCallback)
	{
		wrapNeedle(targetUrlString, plainText, attemptCallback);
	},
	function (reqError, reqRes)
	{
		if (reqError !== null)
		{
			// Fatal Error
			return fileReqCallback(reqError, null);
		}
		else if (reqRes.statusCode === 429)
		{
			// Too many requests. Make note of delay time.
			requestResult.retryAfter = getRetryAfter(reqError.response.headers);
			return fileReqCallback(null, requestResult);
		}
		else if (reqRes.statusCode === 200)
		{
			// Successful
			requestResult.retrievedBody = reqRes.body;
			return fileReqCallback(null, requestResult);
		}
		else
		{
			// Status Error
			statusMessage = httpErrorText.writeStatus(requestDescription, reqRes);
			return fileReqCallback(new Error(statusMessage), null);
		}
	});
}


// Performs request with Needle
function wrapNeedle(tgtUrl, plaText, needleCallback)
{
	var downloadOptions = {decode_response: plaText};
	
	needle.get(tgtUrl, downloadOptions, function (needleErr, needleRes)
	{
		if (needleErr !== null)
		{
			return needleCallback(needleErr, null);
		}
		else
		{
			return needleCallback(null, needleRes);
		}
	});
}


// Reads HTTP 429 delay length in seconds. (min: 1)
function getRetryAfter(headerObject)
{
	var retryProp = headerObject["retry-after"];
	var castSeconds = Number(retryProp);
	var amountDefined = Number.isInteger(castSeconds);
	var totalDelay = 1;
	
	if (amountDefined === true)
	{
		totalDelay = castSeconds + 1;
	}
	
	return totalDelay;
}


// Displays HTTP 429 error text if delay is not allowed.
function displayTooManyRequestsError(reqDelayCallback)
{
	var messageText = httpErrorText.writeTooManyRequests();
	return reqDelayCallback(new Error(messageText), null);
}




module.exports =
{
	getFile: performFileRequest,
	displayTooManyRequests: displayTooManyRequestsError
};