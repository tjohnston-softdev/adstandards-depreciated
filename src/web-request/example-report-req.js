/*
	This file is responsible for downloading the example report PDF file.
	Used for the 'test-download' command.
*/


const ora = require("ora");
const linkPrep = require("../common/web/link-prep");
const retryLimits = require("../common/web/retry-limits");
const needleRequest = require("../common/web/needle-request");


// Main function.
function requestExampleReportFile(reportCallback)
{
	var exampleReportSpinner = ora("Downloading Example Report").start();
	
	coordinateWebRequest(function (reqReportErr, reqReportRes)
	{
		if (reqReportErr !== null)
		{
			exampleReportSpinner.fail("Example Report Download Error");
			return reportCallback(reqReportErr, null);
		}
		else
		{
			exampleReportSpinner.succeed("Example Report Downloaded");
			return reportCallback(null, reqReportRes);
		}
	});
	
	
}


// Download page function.
function coordinateWebRequest(webReqCallback)
{
	var reportTgtUrl = linkPrep.getExampleReport();
	var flaggedMessage = "";
	
	needleRequest.getFile(reportTgtUrl, "Example Report", retryLimits.landingPage, false, function (reportErr, reportRes)
	{
		if (reportErr !== null)
		{
			// Page download error.
			return webReqCallback(reportErr, null);
		}
		else if (reportRes.retryAfter > 0)
		{
			// Too many requests - Delay not allowed.
			needleRequest.displayTooManyRequests(webReqCallback);
		}
		else
		{
			// Download successful.
			return webReqCallback(null, reportRes);
		}
	});
}



module.exports =
{
	requestExampleReport: requestExampleReportFile
};