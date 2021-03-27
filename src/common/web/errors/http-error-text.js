// These functions write error messages for HTTP related errors.


// Parses HTTP error object into readable message.
function writeStatusText(vDesc, vRespData)
{
	var writeRes = "";
	
	writeRes += "Error requesting ";
	writeRes += vDesc;
	writeRes += " - ";
	writeRes += vRespData.statusCode;
	writeRes += " ";
	writeRes += vRespData.statusMessage;
	
	return writeRes;
}


// Too many requests
function writeTooManyRequestsText()
{
	var writeRes = "";
	
	writeRes += "Too many requests have been sent within the allocated time frame. ";
	writeRes += "Please try again later.";
	
	return writeRes;
}


// Link preperation.
function writeLinkPreperationText(vDesc)
{
	var writeRes = "No " + vDesc + " URLs were successfully prepared.";
	return writeRes;
}



module.exports =
{
	writeStatus: writeStatusText,
	writeTooManyRequests: writeTooManyRequestsText,
	writeLinkPreperation: writeLinkPreperationText
};