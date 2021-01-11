/*
	This file is responsible for scraping product categories and media types from adstandards website.
	Used in the 'read-lists' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const cheerio = require("cheerio");
const valueLimits = require("../common/value-limits");
const scrapeDesc = require("../common/interface/general/scrape-desc");
const inputDesc = require("../common/interface/general/input-desc");
const htmlSearch = require("../common/scrape/html-search");
const selectBasic = require("./elements/select-basic");


// Main function.
function scrapeSearchListData(searchPageHTML, allowScrapeError, scrapeCallback)
{
	var scrapeSpinner = ora("Scraping Search Lists").start();
	
	coordinateListScrape(searchPageHTML, allowScrapeError, function (dataScrapeError, dataScrapeRes)
	{
		if (dataScrapeError !== null)
		{
			scrapeSpinner.fail("Search List Scrape Error");
			return scrapeCallback(dataScrapeError, null);
		}
		else
		{
			scrapeSpinner.succeed("Search Lists Scraped");
			return scrapeCallback(null, dataScrapeRes);
		}
		
	});
	
}


// Coordinates list item scraping.
function coordinateListScrape(searchHTML, allowScrapeErr, lscCallback)
{
	var parsedHTMLObject = cheerio.load(searchHTML.retrievedBody);
	
	asyncModule.series(
	{
		"productCategories": callProductCategoryRead.bind(null, parsedHTMLObject, allowScrapeErr),
		"mediaTypes": callMediaTypeRead.bind(null, parsedHTMLObject, allowScrapeErr)
	},
	function (coordinateError, coordinateRes)
	{
		return lscCallback(coordinateError, coordinateRes);
	});
	
}


// Scrapes product category items.
function callProductCategoryRead(parsedHTML, allowErr, productCategoryCallback)
{
	var prodElement = scrapeDesc.prodCatElement;
	var prodItem = scrapeDesc.prodCatItem;
	var prodInput = inputDesc.productCategory;
	var prodID = htmlSearch.productCategory;
	var prodMaxLength = valueLimits.productCategory.max;
	
	selectBasic.readData(prodElement, prodItem, prodInput, prodID, prodMaxLength, parsedHTML, allowErr,
	function (selErr, selRes)
	{
		return productCategoryCallback(selErr, selRes); 
	});
}


// Scrapes media type items.
function callMediaTypeRead(parsedHTML, allowErr, mediaTypeCallback)
{
	var mediaElement = scrapeDesc.medTypeElement;
	var mediaItem = scrapeDesc.medTypeItem;
	var mediaInput = inputDesc.mediaType;
	var mediaID = htmlSearch.mediaType;
	var mediaMaxLength = valueLimits.mediaType.max;
	
	selectBasic.readData(mediaElement, mediaItem, mediaInput, mediaID, mediaMaxLength, parsedHTML, allowErr,
	function (selErr, selRes)
	{
		return mediaTypeCallback(selErr, selRes); 
	});
	
}



module.exports =
{
	scrapeListData: scrapeSearchListData
};