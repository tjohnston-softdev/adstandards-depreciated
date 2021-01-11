// Database column names

const prodCatNumCol = "productCategoryID";
const prodCatNameCol = "productCategoryName";

const medTypeNumCol = "mediaTypeID";
const medTypeNameCol = "mediaTypeName";

const advertiserNumCol = "advertiserID";
const advertiserNameCol = "advertiserName";

const caseEntryIdentificationCol = "caseEntryID";
const caseCodeCol = "caseCode";
const descriptionTextCol = "descriptionText";
const determinationFlagCol = "determinationFlag";
const determinationDateCol = "determinationDate";
const archiveTimestampCol = "archiveTimestamp";
const documentLinkCol = "documentFileURL";
const downloadFlagCol = "downloadFlag";


module.exports =
{
	prodCatNum: prodCatNumCol,
	prodCatName: prodCatNameCol,
	medTypeNum: medTypeNumCol,
	medTypeName: medTypeNameCol,
	advertiserNum: advertiserNumCol,
	advertiserName: advertiserNameCol,
	caseEntryIdentification: caseEntryIdentificationCol,
	caseCode: caseCodeCol,
	descriptionText: descriptionTextCol,
	determinationFlag: determinationFlagCol,
	determinationDate: determinationDateCol,
	archiveTimestamp: archiveTimestampCol,
	documentLink: documentLinkCol,
	downloadFlag: downloadFlagCol
};