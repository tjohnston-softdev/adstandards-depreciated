/*
	These objects define:
	* How many times HTTP requests can be retried
	* The delay between attempts
*/

const landingPageObject = defineRequestLimitObject(5, 1000);	// Landing page
const casePageObject = defineRequestLimitObject(3, 500);		// Subsequent case list pages.
const caseFileObject = defineRequestLimitObject(3, 250);		// Case report PDF


function defineRequestLimitObject(maxAttempts, intervalTime)
{
	var defineRes = {};
	
	defineRes["times"] = maxAttempts;
	defineRes["interval"] = intervalTime;
	
	return defineRes;
}



module.exports =
{
	landingPage: landingPageObject,
	casePage: casePageObject,
	caseFile: caseFileObject
};