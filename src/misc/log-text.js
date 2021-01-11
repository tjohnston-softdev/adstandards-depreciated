// This file is used to prepare database log text when running the 'log' command.

const dateTasks = require("../common/entry/date-tasks");
const charShortcuts = require("../common/char-shortcuts");


// Main function
function writeStatsText(dbStatsObject)
{
	var writeRes = "";
	
	// Writes individual table stats.
	writeRes += handleTablePart("Advertisers", dbStatsObject.tables.advertisers);
	writeRes += handleTablePart("Product Categories", dbStatsObject.tables.productCategories);
	writeRes += handleTablePart("Media Types", dbStatsObject.tables.mediaTypes);
	writeRes += handleTablePart("Cases", dbStatsObject.tables.cases);
	
	// Write report file stats.
	writeRes += handleReportEntriesPart(dbStatsObject.tables.reports);
	writeRes += handleSavedReportsPart(dbStatsObject.savedReportFileCount);
	
	// Write logging timestamp.
	writeRes += handleTimestampPart();
	
	
	// Write seperation.
	writeRes += charShortcuts.lineBreak;
	writeRes += charShortcuts.divider;
	writeRes += charShortcuts.paraBreak;
	
	
	return writeRes;
}


// Logging timestamp
function handleTimestampPart()
{
	var partRes = "";
	
	partRes += "Timestamp: ";
	partRes += dateTasks.getCurrentTimestamp();
	
	return partRes;
}


// Table row stats.
function handleTablePart(tblName, tblObject)
{
	var activeValue = tblObject.active + " active";
	var inactiveValue = tblObject.inactive + " inactive";
	var totalValue = tblObject.total + " total";
	
	var joinedValues = [tblName, activeValue, inactiveValue, totalValue].join(charShortcuts.vert);
	var partRes = joinedValues + charShortcuts.lineBreak;
	
	return partRes;
}

// Report data stats.
function handleReportEntriesPart(rObject)
{
	var flaggedValue = rObject.flagged + " flagged";
	var inactiveValue = rObject.inactive + " inactive";
	var totalValue = rObject.total + " total";
	var missingValue = rObject.missing + " missing";
	
	var joinedValues = ["Reports", flaggedValue, inactiveValue, totalValue, missingValue].join(charShortcuts.vert);
	var partRes = joinedValues + charShortcuts.lineBreak;
	
	return partRes;
}


// Saved report files stat.
function handleSavedReportsPart(sAmount)
{
	var partRes = "";
	
	partRes += "Report Files Saved: ";
	partRes += sAmount;
	partRes += charShortcuts.lineBreak;
	
	return partRes;
}



module.exports =
{
	writeStats: writeStatsText
};