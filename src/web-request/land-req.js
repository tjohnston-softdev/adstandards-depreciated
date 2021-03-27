/*
	This file is responsible for downloading the advertisement cases landing page.
	Used for the 'read-lists' and 'download-pages' commands.
	When running 'download-pages', this is used to request the first page.
*/

const asyncModule = require("async");
const ora = require("ora");
const linkPrep = require("../common/web/link-prep");
const retryLimits = require("../common/web/retry-limits");
const needleRequest = require("../common/web/needle-request");
const webDesc = require("../common/interface/general/web-desc");


// Main function.
function requestSearchLandingPage(landingCallback)
{
	var landingPageSpinner = ora("Downloading Landing Page").start();
	
	coordinateWebRequest(function (reqLandErr, reqLandRes)
	{
		if (reqLandErr !== null)
		{
			landingPageSpinner.fail("Landing Page Download Error");
			return landingCallback(reqLandErr, null);
		}
		else
		{
			landingPageSpinner.succeed("Landing Page Downloaded");
			return landingCallback(null, reqLandRes);
		}
	});
	
	
}


// Download page function.
function coordinateWebRequest(webReqCallback)
{
	var landTgtUrl = linkPrep.getLandingPage();
	var flaggedMessage = "";
	
	needleRequest.getFile(landTgtUrl, webDesc.landingPage, retryLimits.landingPage, true, function (landError, landRes)
	{
		if (landError !== null)
		{
			// Page download error.
			return webReqCallback(landError, null);
		}
		else if (landRes.retryAfter > 0)
		{
			// Too many requests - Delay not allowed.
			needleRequest.displayTooManyRequests(webReqCallback);
		}
		else
		{
			// Download successful.
			return webReqCallback(null, landRes);
		}
	});
	
}




module.exports =
{
	requestLandingPage: requestSearchLandingPage
};