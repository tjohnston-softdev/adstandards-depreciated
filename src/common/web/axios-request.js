// HTTP requests using 'axios' library.

const asyncModule = require("async");
const axios = require("axios");
const httpErrorText = require("./errors/http-error-text");


// Main request function.
function performFileRequest(targetUrlString, requestDescription, retryObject, plainText, fileReqCallback)
{
	var requestResult = {"retrievedBody": null, "retryAfter": 0};
	var statusMessage = "";
	
	// Runs URL request, allowing a certain number of attempts.
	asyncModule.retry(retryObject,
	function (attemptCallback)
	{
		wrapAxios(targetUrlString, plainText, attemptCallback);
	},
	function (reqError, reqRes)
	{
		if (reqError !== null && reqError.response.status === 429)
		{
			// Too many requests. Make note of delay time.
			requestResult.retryAfter = getRetryAfter(reqError.response.headers);
			return fileReqCallback(null, requestResult);
		}
		else if (reqError !== null)
		{
			// Request error.
			statusMessage = httpErrorText.writeStatus(requestDescription, reqError.response);
			return fileReqCallback(new Error(statusMessage), null);
		}
		else
		{
			// Successful
			requestResult.retrievedBody = reqRes.data;
			return fileReqCallback(null, requestResult);
		}
	});
}


// Performs request with Axios
function wrapAxios(tgtUrl, plaText, axiosCallback)
{
	var downloadOptions = getDownloadOptions(plaText);
	
	axios.get(tgtUrl, downloadOptions)
	.then(function (completeRequest)
	{
		// Successful
		return axiosCallback(null, completeRequest);
	})
	.catch(function (httpError)
	{
		// Error
		return axiosCallback(httpError, null);
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


// Decides how to encode HTTP request result based on data type.
function getDownloadOptions(pTxt)
{
	var optRes = {};
	
	if (pTxt === true)
	{
		// Plain text (HTML)
		optRes = {};
	}
	else
	{
		// Binary data (PDF)
		optRes = {responseEncoding: "binary"};
	}
	
	return optRes;
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