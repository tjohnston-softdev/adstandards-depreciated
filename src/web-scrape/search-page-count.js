/*
	This file is responsible for counting the number of advertisement case pages.
	This is done by reading the 'last' URL from the landing page.
	Used in the 'download-pages' command.
*/

const ora = require("ora");
const cheerio = require("cheerio");
const pageCount = require("./elements/page-count");


// Main function.
function scrapeSearchPageCount(searchPageHTML, allowScrapeErr, scrapeCallback)
{
	var scrapeSpinner = ora("Counting Pages").start();
	
	coordinateCount(searchPageHTML, allowScrapeErr, function (numberScrapeError, numberScrapeRes)
	{
		if (numberScrapeError !== null)
		{
			scrapeSpinner.fail("Error Reading Page Count");
			return scrapeCallback(numberScrapeError, null);
		}
		else
		{
			scrapeSpinner.succeed("Page Count Retrieved");
			return scrapeCallback(null, numberScrapeRes);
		}
	});
	
}


// Scrapes last page URL.
function coordinateCount(searchHTML, allowErr, pCountCallback)
{
	var parsedHTMLObject = cheerio.load(searchHTML.retrievedBody);
	
	pageCount.readNumber(parsedHTMLObject, allowErr, function (countReadError, countReadResult)
	{
		return pCountCallback(countReadError, countReadResult);
	});
}




module.exports =
{
	scrapePageCount: scrapeSearchPageCount
};