// File size limits.


// Units
const sizeBase = 1000;											// Base 1000
const kbSize = sizeBase;										// Kilobyte
const mbSize = kbSize * sizeBase;								// Megabyte


// Maximum kilobyte sizes.
const maxCredBytes = kbSize * 1;								// Database credentials.
const maxDefinitionBytes = kbSize * 25;							// Definition script.
const maxClearAllBytes = kbSize * 5;							// Clear all script.
const maxClearCasesBytes = kbSize * 2;							// Clear cases script.
const maxWebPageBytes = mbSize * 2;								// HTML web page.
const maxReportBytes = maxWebPageBytes;							// Report PDF.


// Size limit objects.
const credSizeObject = defineSizeLimitObject(maxCredBytes, "1KB");
const definitionSizeObject = defineSizeLimitObject(maxDefinitionBytes, "10KB");
const clearAllSizeObject = defineSizeLimitObject(maxClearAllBytes, "5KB");
const clearCasesSizeObject = defineSizeLimitObject(maxClearCasesBytes, "2KB");
const webPageSizeObject = defineSizeLimitObject(maxWebPageBytes, "2MB");
const reportFileSizeObject = defineSizeLimitObject(maxReportBytes, "2MB");



function defineSizeLimitObject(totalBytes, maxLabel)
{
	var defineRes = {};
	
	defineRes["maxSize"] = totalBytes;
	defineRes["sizeLabel"] = maxLabel;
	
	return defineRes;
}




module.exports =
{
	creds: credSizeObject,
	databaseDefinition: definitionSizeObject,
	clearAll: clearAllSizeObject,
	clearCases: clearCasesSizeObject,
	webPage: webPageSizeObject,
	reportFile: reportFileSizeObject
};