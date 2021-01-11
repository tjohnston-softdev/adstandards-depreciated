/*
	These objects store description text for exporting individual tables.
	This is to make the code easier to read, and store export variables in a common format.
	Includes:
		* Spinner messages
		* Table name
		* Table description
		* Key column
*/

const tblNames = require("../common/interface/schema/tbl-names");
const colNames = require("../common/interface/schema/col-names");
const tblDesc = require("../common/interface/schema/tbl-desc");
const inputDesc = require("../common/interface/general/input-desc");

const advertiserObject = initializeAdvertiser();
const productCategoryObject = initializeProductCategory();
const mediaTypeObject = initializeMediaType();
const casesObject = initializeCases();



// Advertiser
function initializeAdvertiser()
{
	var baseMsg = "Exporting Advertisers";
	var successMsg = "Advertiser Data Exported";
	var failMsg = "Errot Exporting Saved Advertisers";
	
	var intlRes = defineExportInfo(baseMsg, successMsg, failMsg, tblNames.advertiser, tblDesc.advertiser, colNames.advertiserNum);
	return intlRes;
}


// ProductCategory
function initializeProductCategory()
{
	var baseMsg = "Exporting Product Categories";
	var successMsg = "Product Categories Exported";
	var failMsg = "Error Exporting Product Categories";
	
	var intlRes = defineExportInfo(baseMsg, successMsg, failMsg, tblNames.prodCat, inputDesc.productCategory, colNames.prodCatNum);
	return intlRes;
}


// MediaType
function initializeMediaType()
{
	var baseMsg = "Exporting Media Types";
	var successMsg = "Media Types Exported";
	var failMsg = "Error Exporting Media Types";
	
	var intlRes = defineExportInfo(baseMsg, successMsg, failMsg, tblNames.medType, inputDesc.mediaType, colNames.medTypeNum);
	return intlRes;
}

// CaseFile
function initializeCases()
{
	var baseMsg = "Exporting Case Data";
	var successMsg = "Case Data Exported";
	var failMsg = "Error Exporting Case Data";
	
	var intlRes = defineExportInfo(baseMsg, successMsg, failMsg, tblNames.caseFile, tblDesc.caseFile, colNames.caseEntryIdentification);
	return intlRes;
}



// Export information object.
function defineExportInfo(expBase, expSuccess, expFail, expTableName, expTableDesc, expKey)
{
	var defineRes = {};
	
	defineRes["baseMessage"] = expBase;
	defineRes["successMessage"] = expSuccess;
	defineRes["failMessage"] = expFail;
	defineRes["schemaName"] = expTableName;
	defineRes["schemaDesc"] = expTableDesc;
	defineRes["schemaKey"] = expKey;
	
	return defineRes;
}



module.exports =
{
	advertiser: advertiserObject,
	productCategory: productCategoryObject,
	mediaType: mediaTypeObject,
	cases: casesObject
};