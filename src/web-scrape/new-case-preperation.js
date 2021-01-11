/*
	These functions are responsible for preparing new advertisement cases and inserting them into the database.
	Used in the 'add-new-cases' command.
*/


const asyncModule = require("async");
const ora = require("ora");
const prepReference = require("./storage/prep-reference");
const prepAdvertiser = require("./storage/prep-advertiser");
const insCases = require("./storage/ins-cases");



// Prepares reference item IDs: Advertiser, ProductCategory, MediaType
function ensureNewCaseReferences(newCaseArrayObject, referencesCallback)
{
	var referenceSpinner = ora("Preparing References").start();
	
	asyncModule.series(
	[
		prepReference.prepareReferenceItems.bind(null, newCaseArrayObject),
		prepAdvertiser.prepareAdvertiserItems.bind(null, newCaseArrayObject)
	],
	function (refError, refResult)
	{
		if (refError !== null)
		{
			referenceSpinner.fail("Reference Preperation Error");
			return referencesCallback(refError, null);
		}
		else
		{
			referenceSpinner.succeed("References Prepared");
			return referencesCallback(null, true);
		}
	});
	
}



// Inserts case data into the database.
function insertNewCaseObjects(newCaseArrayObject, caseInsertCallback)
{
	var insertSpinner = ora("Inserting New Cases").start();
	
	insCases.insertCaseData(newCaseArrayObject, function (insErr, insRes)
	{
		if (insErr !== null)
		{
			insertSpinner.fail("Case Insert Error");
			return caseInsertCallback(insErr, null);
		}
		else
		{
			insertSpinner.succeed("New Cases Inserted");
			return caseInsertCallback(null, true);
		}
	});
}




module.exports =
{
	ensureReferences: ensureNewCaseReferences,
	insertObjects: insertNewCaseObjects
};