/*
	This file is used to validate whether a given set of
	product category and media type references have been
	found successfully.
*/


const possibleOutcomes =
{
	"VALID": 1,
	"UNKNOWN_PRODUCT": 2,
	"UNKNOWN_MEDIA": 3
};



function checkListReferencesExist(pCategory, mType)
{
	var categoryExists = Number.isInteger(pCategory);
	var mediaExists = Number.isInteger(mType);
	
	var checkRes = null;
	
	if (categoryExists === true && mediaExists === true)
	{
		// Both references exist.
		checkRes = possibleOutcomes.VALID;
	}
	else if (categoryExists === true)
	{
		// Media type missing.
		checkRes = possibleOutcomes.UNKNOWN_MEDIA;
	}
	else
	{
		// Product category missing.
		checkRes = possibleOutcomes.UNKNOWN_PRODUCT;
	}
	
	return checkRes;
}



module.exports =
{
	outcome: possibleOutcomes,
	checkExist: checkListReferencesExist
};