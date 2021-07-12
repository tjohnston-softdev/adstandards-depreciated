const commander = require("commander");
const optDesc = require("./src/common/interface/opt-desc");
const readRuntimeFiles = require("./src/read-runtime-files");
const createDatabase = require("./src/create-database");
const clearDatabase = require("./src/clear-database");
const testFileDownload = require("./src/test-file-download");
const readLists = require("./src/read-lists");
const downloadPages = require("./src/download-pages");
const readCases = require("./src/read-cases");
const downloadReports = require("./src/download-reports");
const addNewCases = require("./src/add-new-cases");
const logDatabase = require("./src/log-database");
const unknownCases = require("./src/unknown-cases");
const program = commander.program;

program.version("archive-1.0.0");


// create
program
.command("create")
.description("creates and initializes the archive database")
.action(function()
{
	createDatabase.performCommand();
});


// clear
program
.command("clear")
.description("removes all data from the archive database")
.action(function()
{
	clearDatabase.performCommand();
});


// test-download
program
.command("test-download")
.description("downloads test files from adstandards website")
.action(function()
{
	testFileDownload.performCommand();
});


// read-lists
program
.command("read-lists")
.description("downloads and saves product category and media type list data into archive")
.option("-s --ignore-scrape-errors", optDesc.ignoreScrapeErrors)
.action(function(options)
{
	readLists.performCommand(options);
});


// download-pages
program
.command("download-pages")
.description("downloads page .html files from adstandards")
.option("-c --clear", optDesc.clearDownloadPages)
.option("-t --allow-timeout", optDesc.allowTimeout)
.option("-o --overwrite", optDesc.overwrite)
.action(function(options)
{
	downloadPages.performCommand(options);
});


// read-cases
program
.command("read-cases")
.description("scrapes case report data from saved page files")
.option("-c --clear", optDesc.clearReadCases)
.option("-s --ignore-scrape-errors", optDesc.ignoreScrapeErrors)
.option("-e --erase", optDesc.eraseReadCases)
.action(function(options)
{
	readCases.performCommand(options);
});


// download-reports
program
.command("download-reports")
.description("downloads known case report .pdf files from adstandards")
.option("-c --clear", optDesc.clearDownloadReports)
.option("-t --allow-timeout", optDesc.allowTimeout)
.option("-o --overwrite", optDesc.overwrite)
.action(function(options)
{
	downloadReports.performCommand(options);
});


// add-new-cases
program
.command("add-new-cases")
.description("reads any new case report entries after the previous determination date. use 'download-reports' to retrieve .pdf files")
.option("-s --ignore-scrape-errors", optDesc.ignoreScrapeErrors)
.action(function(options)
{
	addNewCases.performCommand(options);
});


// log
program
.command("log")
.description("outputs database entry and saved report file counts to log text file")
.action(function()
{
	logDatabase.performCommand();
});


// unknown [output-path]
program
.command("unknown [output-path]")
.description("exports case entries with missing advertiser, product, etc to a .csv file")
.option("-o --overwrite", optDesc.overwrite)
.action(function(outputPath, options)
{
	unknownCases.performCommand(outputPath, options);
});



program.parse(process.argv);