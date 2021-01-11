/*
	Prepares Product Category and Media Type reference IDs for case objects.
	Used in '../new-case-preperation.js' and '../case-data.js'
*/


const asyncModule = require("async");
const dbConnection = require("../../common/database/db-connection");
const dbSelect = require("../../common/database/db-select");
const tblNames = require("../../common/interface/schema/tbl-names");
const colNames = require("../../common/interface/schema/col-names");
const inputDesc = require("../../common/interface/general/input-desc");



// Main function - Establish database connection.
function prepareCaseListReferenceItems(caseObjectList, categoryItemsCallback)
{
	dbConnection.openConnection(false, function (openErr, openRes)
	{
		if (openErr !== null)
		{
			return categoryItemsCallback(openErr, null);
		}
		else
		{
			callCaseLoop(openRes, caseObjectList, categoryItemsCallback);
		}
	});
}


// Loops case objects.
function callCaseLoop(referenceConnectionObject, caseObjects, caseLoopCallback)
{
	asyncModule.each(caseObjects,
	function (currentCaseObject, caseIterationCallback)
	{
		handleCurrentCase(currentCaseObject, referenceConnectionObject, caseIterationCallback);
	},
	function (caseLoopErr, caseLoopRes)
	{
		// Loop complete.
		if (caseLoopErr !== null)
		{
			dbConnection.resolveError(referenceConnectionObject, caseLoopErr, caseLoopCallback);
		}
		else
		{
			dbConnection.closeConnection(referenceConnectionObject, caseLoopCallback);
		}
	});
}



// Retrieves matching IDs for scraped names.
function handleCurrentCase(cObject, refConnObj, handleCallback)
{
	asyncModule.parallel(
	{
		"productNum": getProductID.bind(null, refConnObj, cObject.product),
		"mediaNum": getMediaID.bind(null, refConnObj, cObject.media)
	},
	function (referenceError, referenceRes)
	{
		if (referenceError !== null)
		{
			// ID query error.
			return handleCallback(referenceError, null);
		}
		else
		{
			// Queries successful - validate IDs.
			updateCase(cObject, referenceRes);
			return handleCallback(null, true);
		}
	});
}


// Checks whether ID numbers exist and saves them to the case object.
function updateCase(cObj, rVals)
{
	var categoryExists = Number.isInteger(rVals.productNum);
	var mediaExists = Number.isInteger(rVals.mediaNum);
	
	// Default
	cObj.product = null;
	cObj.media = null;
	
	// productCategoryID
	if (categoryExists === true)
	{
		cObj.product = rVals.productNum;
	}
	
	// mediaTypeID
	if (mediaExists === true)
	{
		cObj.media = rVals.mediaNum;
	}
}


// Calls Product Category ID query.
function getProductID(prodConn, prodTgt, prodCallback)
{
	if (prodTgt.length > 0)
	{
		// Product Category name given - Check if exists.
		callSelect(prodConn, tblNames.prodCat, inputDesc.productCategory, colNames.prodCatNum, colNames.prodCatName, prodTgt, prodCallback);
	}
	else
	{
		// No name given.
		return prodCallback(null, NaN);
	}
}



// Calls Media Type ID query.
function getMediaID(mediaConn, mediaTgt, mediaCallback)
{
	if (mediaTgt.length > 0)
	{
		// Media Type name given - Check if exists.
		callSelect(mediaConn, tblNames.medType, inputDesc.mediaType, colNames.medTypeNum, colNames.medTypeName, mediaTgt, mediaCallback);
	}
	else
	{
		// No name given.
		return mediaCallback(null, NaN);
	}
}


// Select query.
function callSelect(sQueryConn, sQueryTable, sQueryDesc, sQueryKeyCol, sQueryNameCol, sTgtVal, lstSelectCallback)
{
	dbSelect.selectListItemExists(sQueryConn, sQueryTable, sQueryDesc, sQueryKeyCol, sQueryNameCol, sTgtVal,
	function (listQueryErr, listQueryRes)
	{
		return lstSelectCallback(listQueryErr, listQueryRes);
	});
}




module.exports =
{
	prepareReferenceItems: prepareCaseListReferenceItems
};