/*
	This function is used to check whether a HTML element scrape is valid.
	This is because the 'cheerio' library returns strings.
	This simply parses the result strings into True or False.
*/

function verifySearchResult(searchRes)
{
	var defType = typeof searchRes;
	var verificationPassed = false;
	
	if (searchRes !== undefined && searchRes !== null && defType === "string" && searchRes.length > 0)
	{
		verificationPassed = true;
	}
	
	return verificationPassed;
}



module.exports =
{
	verifyResult: verifySearchResult
};