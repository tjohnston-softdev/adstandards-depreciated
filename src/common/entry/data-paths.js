/*
	* Prepares paths for .csv files when exporting and importing archive contents.
	* Receives target folder as input and returns file path.
*/

const path = require("path");


// Advertiser.
function getAdvertiserPath(tFolder)
{
	var pathRes = path.join(tFolder, "advertiser.csv");
	return pathRes;
}


// Product category.
function getProductCategoryPath(tFolder)
{
	var pathRes = path.join(tFolder, "product-category.csv");
	return pathRes;
}


// Media types.
function getMediaTypesPath(tFolder)
{
	var pathRes = path.join(tFolder, "media-type.csv");
	return pathRes;
}


// Advertisement cases.
function getCasesPath(tFolder)
{
	var pathRes = path.join(tFolder, "case-file.csv");
	return pathRes;
}



module.exports =
{
	getAdvertiser: getAdvertiserPath,
	getProductCategory: getProductCategoryPath,
	getMediaType: getMediaTypesPath,
	getCase: getCasesPath
};