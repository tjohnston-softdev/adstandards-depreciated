/*
	These objects store description text for when importing data into tables.
	This is to make the code easier to read, and store import variables in a common format.
	
	Required:
		* Spinner messages
		* File description
		* Table name
		* Table description
	
	Optional:
		* Key column header
		* Name column header
		* Key column description
		* Name column description
		* Maximum name length number
*/



const tblNames = require("../common/interface/schema/tbl-names");
const colNames = require("../common/interface/schema/col-names");
const tblDesc = require("../common/interface/schema/tbl-desc");
const inputDesc = require("../common/interface/general/input-desc");
const dataDesc = require("../common/interface/general/data-desc");
const valueLimits = require("../common/value-limits");

const advertiserObject = initializeAdvertiser();
const productCategoryObject = initializeProductCategory();
const mediaTypeObject = initializeMediaType();
const casesObject = initializeCaseData();


// Advertiser
function initializeAdvertiser()
{
	var baseMsg = "Importing Advertisers";
	var successMsg = "Advertisers Imported";
	var failMsg = "Error Importing Advertisers";
	var skipMsg = "Advertisers Skipped";
	
	var intlRes = defineImportInfo();
	
	setMessages(intlRes, baseMsg, successMsg, failMsg, skipMsg);
	setFileDescription(intlRes, dataDesc.advertiser);
	setSchema(intlRes, tblNames.advertiser, tblDesc.advertiser);
	setColumns(intlRes, colNames.advertiserNum, colNames.advertiserName, inputDesc.advertiser);
	setNameLength(intlRes, valueLimits.advertiser);
	
	return intlRes;
}


// ProductCategory
function initializeProductCategory()
{
	var baseMsg = "Importing Product Categories";
	var successMsg = "Product Categories Imported";
	var failMsg = "Error Importing Product Categories";
	var skipMsg = "Product Categories Skipped";
	
	var intlRes = defineImportInfo();
	
	setMessages(intlRes, baseMsg, successMsg, failMsg, skipMsg);
	setFileDescription(intlRes, dataDesc.productCategory);
	setSchema(intlRes, tblNames.prodCat, inputDesc.productCategory);
	setColumns(intlRes, colNames.prodCatNum, colNames.prodCatName, inputDesc.productCategory);
	setNameLength(intlRes, valueLimits.productCategory);
	
	return intlRes;
}


// MediaType
function initializeMediaType()
{
	var baseMsg = "Importing Media Types";
	var successMsg = "Media Types Imported";
	var failMsg = "Error Importing Media Types";
	var skipMsg = "Media Types Skipped";
	
	var intlRes = defineImportInfo();
	
	setMessages(intlRes, baseMsg, successMsg, failMsg, skipMsg);
	setFileDescription(intlRes, dataDesc.mediaType);
	setSchema(intlRes, tblNames.medType, inputDesc.mediaType);
	setColumns(intlRes, colNames.medTypeNum, colNames.medTypeName, inputDesc.mediaType);
	setNameLength(intlRes, valueLimits.mediaType);
	
	return intlRes;
}


// CaseFile
function initializeCaseData()
{
	var baseMsg = "Importing Case Data";
	var successMsg = "Case Data Imported";
	var failMsg = "Error Importing Case Data";
	var skipMsg = "Case Data Skipped";
	
	var intlRes = defineImportInfo();
	
	setMessages(intlRes, baseMsg, successMsg, failMsg, skipMsg);
	setFileDescription(intlRes, dataDesc.caseFile);
	setSchema(intlRes, tblNames.caseFile, tblDesc.caseFile);
	
	return intlRes;
}



// Import information object.
function defineImportInfo()
{
	var defineRes = {};
	
	defineRes["baseMessage"] = "";
	defineRes["successMessage"] = "";
	defineRes["failMessage"] = "";
	defineRes["skipMessage"] = "";
	defineRes["fileDesc"] = "";
	defineRes["schemaName"] = "";
	defineRes["schemaDesc"] = "";
	defineRes["keyCol"] = "";
	defineRes["nameCol"] = "";
	defineRes["nameDesc"] = "";
	defineRes["maxNameLength"] = -1;
	
	return defineRes;
}



// Set spinner message properties.
function setMessages(infoObj, impBase, impSuccess, impFail, impSkip)
{
	infoObj.baseMessage = impBase;
	infoObj.successMessage = impSuccess;
	infoObj.failMessage = impFail;
	infoObj.skipMessage = impSkip;
}



function setFileDescription(infoObj, impFileDesc)
{
	infoObj.fileDesc = impFileDesc;
}


// Set table name and description properties.
function setSchema(infoObj, impTableName, impTableDesc)
{
	infoObj.schemaName = impTableName;
	infoObj.schemaDesc = impTableDesc;
}


// Set column properties.
function setColumns(infoObj, impKeyCol, impNameCol, impNameDesc)
{
	infoObj.keyCol = impKeyCol;
	infoObj.nameCol = impNameCol;
	infoObj.nameDesc = impNameDesc;
}


// Set name length property.
function setNameLength(infoObj, limitObj)
{
	infoObj.maxNameLength = limitObj.max;
}




module.exports =
{
	advertiser: advertiserObject,
	productCategory: productCategoryObject,
	mediaType: mediaTypeObject,
	cases: casesObject
};