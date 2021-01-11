// Number value limits

const advertiserNameLengthLimit = defineLimit(1, 100);							// Advertiser name
const productCategoryNameLengthLimit = defineLimit(1, 30);						// Product category name
const mediaTypeNameLengthLimit = defineLimit(1, 50);							// Media type name
const caseCodeLengthLimit = defineLimit(1, 25);									// Advertisement case code length.
const descriptionLengthLimit = defineLimit(0, 750);								// Case description length.
const linkLengthLimit = defineLimit(0, 250);									// URL length.
const pageNumberLimit = defineLimit(1, 1000);									// Page number limit.
const fileGroupSizeNumber = 500;												// Maximum number of files that can be processed at once.
const maxPathLengthLimit = 5000;												// Maximum path length.
const rowCacheSizeNumber = 1000;												// Maximum number of rows that can be processed at once.


function defineLimit(dMin, dMax)
{
	var defineRes = {"min": dMin, "max": dMax};
	return defineRes;
}




module.exports =
{
	advertiser: advertiserNameLengthLimit,
	productCategory: productCategoryNameLengthLimit,
	mediaType: mediaTypeNameLengthLimit,
	caseCodeLength: caseCodeLengthLimit,
	description: descriptionLengthLimit,
	linkLength: linkLengthLimit,
	pageNumber: pageNumberLimit,
	fileGroupSize: fileGroupSizeNumber,
	maxPathLength: maxPathLengthLimit,
	rowCacheSize: rowCacheSizeNumber
};