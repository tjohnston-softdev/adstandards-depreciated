// Functions write message text for web scrape errors.


// No items found.
function writeMatchElementCountError(vDesc, vSelect)
{
	var writeRes = "";
	
	writeRes += "No ";
	writeRes += vDesc;
	writeRes += " items found.\n";
	writeRes += getSelectorLine(vSelect);
	
	return writeRes;
}

// Missing element
function writeMissingElementError(vDesc, vSelect)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " is missing.\n";
	writeRes += getSelectorLine(vSelect);
	
	return writeRes;
}


// Invalid type
function writeInvalidTypeError(vDesc, vType, vSelect)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes += " must be a valid ";
	writeRes += quoteItem(vType);
	writeRes += " object.\n";
	writeRes += getSelectorLine(vSelect);
	
	return writeRes;
}


// Missing attribute
function writeMissingAttributeError(vDesc, vType, vProp, vSelect)
{
	var writeRes = "";
	
	writeRes += vDesc;
	writeRes + " ";
	writeRes += quoteItem(vType);
	writeRes += " object is missing the attribute ";
	writeRes += quoteItem(vProp);
	
	return writeRes;
}



// Adds cheerio selector to error text.
function getSelectorLine(selectPart)
{
	var lineRes = "Selector: " + selectPart;
	return lineRes;
}


// Quotes attribute or element name for error text.
function quoteItem(qString)
{
	var quoteRes = "'" + qString + "'";
	return quoteRes;
}




module.exports =
{
	writeMatchElementCount: writeMatchElementCountError,
	writeMissingElement: writeMissingElementError,
	writeInvalidType: writeInvalidTypeError,
	writeMissingAttribute: writeMissingAttributeError
};