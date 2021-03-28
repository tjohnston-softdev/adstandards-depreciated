const asyncModule = require("async");
const clear = require("clear");
const landReq = require("./web-request/land-req");
const exampleReportReq = require("./web-request/example-report-req");
const folderIntl = require("./file-prep/folder-intl");
const testFileSave = require("./file-prep/test-file-save");
const exitProgram = require("./common/exit-program");


/*
	Command: test-download
	Description: Downloads test files from Adstandards website
	Steps:
		* Download landing page HTML file.
		* Download example report PDF file.
		* Initialize output folder.
		* Save both files to output folder.
*/


function downloadExampleFiles()
{
	clear();
	
	asyncModule.series(
	{
		"htmlPage": landReq.requestLandingPage,
		"pdfFile": exampleReportReq.requestExampleReport
	},
	function (exampleDownloadErr, exampleDownloadRes)
	{
		if (exampleDownloadErr !== null)
		{
			exitProgram.callExit(exampleDownloadErr.message);
		}
		else
		{
			executeOutputTasks(exampleDownloadRes);
		}
	});
}



function executeOutputTasks(exampleData)
{
	asyncModule.series(
	[
		folderIntl.initializeHttpTest.bind(null),
		testFileSave.writeTestFiles.bind(null, exampleData)
	],
	function (outputTasksErr, outputTasksRes)
	{
		if (outputTasksErr !== null)
		{
			exitProgram.callExit(outputTasksErr.message);
		}
		else
		{
			exitProgram.callSuccessful("Test Files Downloaded");
		}
	});
}


module.exports =
{
	performCommand: downloadExampleFiles
};