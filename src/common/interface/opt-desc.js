// This file contains help descriptions for different command options.

const ignoreScrapeErrorsDesc = "ignores HTML data scraping errors and skips affected entries";
const allowTimeoutDesc = "if a 'HTTP 429' error is encountered, it will wait without error before continuing";
const overwriteDesc = "overwrites existing files";
const clearDownloadPagesDesc = "deletes existing HTML page files before download begins";
const clearReadCasesDesc = "removes existing case report entries from the archive database";
const eraseReadCasesDesc = "deletes HTML page files after scraping is complete";
const clearDownloadReportsDesc = "deletes existing report .pdf files before download begins";
const importIgnoreErrorsDesc = "ignores CSV data errors and skips affected rows";



module.exports =
{
	ignoreScrapeErrors: ignoreScrapeErrorsDesc,
	allowTimeout: allowTimeoutDesc,
	overwrite: overwriteDesc,
	clearDownloadPages: clearDownloadPagesDesc,
	clearReadCases: clearReadCasesDesc,
	eraseReadCases: eraseReadCasesDesc,
	clearDownloadReports: clearDownloadReportsDesc,
	importIgnoreErrors: importIgnoreErrorsDesc
};