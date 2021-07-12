// Functions used to prepare file names and file search syntax.

const path = require("path");
const fileExt = ".html";
const nestWildcard = "**";			// Double asterisk includes files in subfolders.


// Page file name.
function writePageName(pNum)
{
	var nameRes = "page" + pNum + fileExt;
	return nameRes;
}


// Search syntax for page files.
function getSearchPageSyntaxDefinition(cacheRoot)
{
	var fullPath = path.join(cacheRoot, "page+([0-9])");
	var syntaxRes = fullPath + fileExt;
	return syntaxRes;
}


// Search syntax for a given report PDF.
function getReportFileSyntaxDefinition(reportFolderRoot, tgtName)
{
	var syntaxRes = path.join(reportFolderRoot, nestWildcard, tgtName);
	return syntaxRes;
}


// Search syntax for all PDFs.
function getReportNestSyntaxDefinition(reportFolderRoot)
{
	var syntaxRes = path.join(reportFolderRoot, nestWildcard, "*.pdf");
	return syntaxRes;
}



module.exports =
{
	writePage: writePageName,
	getSearchPageSyntax: getSearchPageSyntaxDefinition,
	getReportFileSyntax: getReportFileSyntaxDefinition,
	getReportNestSyntax: getReportNestSyntaxDefinition
};