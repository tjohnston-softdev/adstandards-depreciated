// Help functions for scraping advertisement cases from HTML table.


// Object stores individual cells from table row.
function initializeRowObject()
{
	var intlRes = {};
	
	intlRes["keyCell"] = null;
	intlRes["summaryCell"] = null;
	intlRes["determinationCell"] = null;
	intlRes["categoryCell"] = null;
	intlRes["mediaCell"] = null;
	intlRes["dateCell"] = null;
	
	return intlRes;
}


// Object stores scraped data from case table row.
function initializeCaseObject()
{
	var intlRes = {};
	
	intlRes["caseCodeKey"] = "";
	intlRes["advertiser"] = "";
	intlRes["description"] = "";
	intlRes["determinedStatus"] = null;
	intlRes["product"] = "";
	intlRes["media"] = "";
	intlRes["date"] = "";
	intlRes["file"] = null;
	
	return intlRes;
}


// Parses determination status string to number flag. Input must be lowercase and sanitized.
function parseDeterminationStatus(detString, caseObj)
{
	if (detString === "dismissed")
	{
		caseObj.determinedStatus = 1;
	}
	else if (detString === "upheld - not modified or discontinued")
	{
		caseObj.determinedStatus = 0;
	}
	else if (detString === "upheld - modified or discontinued")
	{
		caseObj.determinedStatus = -1;
	}
	else
	{
		// Unknown
		caseObj.determinedStatus = null;
	}
}


module.exports =
{
	initializeRow: initializeRowObject,
	initializeCase: initializeCaseObject,
	parseDetermination: parseDeterminationStatus
};