// These functions help with link preperation

const baseURL = "https://adstandards.com.au/cases";
const exampleReportURL = "https://adstandards.com.au/sites/default/files/reports/0048-21.pdf";


// Landing page.
function getLandingPageURL()
{
	return baseURL;
}


function getExampleReportURL()
{
	return exampleReportURL;
}


// Creates URL object.
function createPathObject()
{
	var pathRes = [baseURL, "?"];
	return pathRes;
}

// Adds page property to URL object.
function addPageNumberProperty(pthObj, pageNum)
{
	pthObj.push("page=", pageNum);
}


// Converts URL object to string.
function combineLinkParts(pthObj)
{
	var combineRes = pthObj.join("");
	return combineRes;
}




module.exports =
{
	getLandingPage: getLandingPageURL,
	getExampleReport: getExampleReportURL,
	createPath: createPathObject,
	addPageNumber: addPageNumberProperty,
	combineParts: combineLinkParts
};