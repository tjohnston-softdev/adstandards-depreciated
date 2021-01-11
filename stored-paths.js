// Contains working paths relative from project root.

const path = require("path");

const databaseFolderPath = path.join(".", "src", "common", "database", "scripts");					// Database scripts folder
const pageFolderPath = path.join(".", "pages");														// HTML pages folder.
const reportsFolderPath = path.join(".", "reports");												// Advertisement case reports root folder.
const exportFolderPath = path.join(".", "export");													// Default export folder.
const unknownOutputFilePath = path.join(".", "unknown-entries.csv");								// Default unknown entries file.

const logFilePath = path.join(".", "log.txt");														// Log file path.
const dbCredsPath = path.join(".", "db-creds.json");												// Database credentials file path.
const dbDefinitionPath = path.join(databaseFolderPath, "definition.sql");							// Definition script file.
const dbClearAllPath = path.join(databaseFolderPath, "clear-all.sql");								// Clear all data script file.
const dbClearCasesPath = path.join(databaseFolderPath, "clear-cases.sql");							// Clear existing cases script file.

module.exports =
{
	pageFolder: pageFolderPath,
	reportsFolder: reportsFolderPath,
	exportFolder: exportFolderPath,
	unknownOutputFile: unknownOutputFilePath,
	logFile: logFilePath,
	dbCreds: dbCredsPath,
	dbDefinition: dbDefinitionPath,
	dbClearAll: dbClearAllPath,
	dbClearCases: dbClearCasesPath
};