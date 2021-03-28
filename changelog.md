# Changelog

**./src/import-export/validation/list-rows.js**
* validateImportedListObjects
	* Renamed 'validationResult' to 'validationResultObject'
* handleCurrentObject
	* Renamed 'validationRes' parameter to 'validationResult'
	* Renamed 'entryObject' parameter to 'listEntry'
	* Removed "Checks base object type." comment.
	* Split IF structure into different functions for readability.
		* Comments have been moved to their respective functions.
		* The `validActiveFlag === true` condition remains for closure.
	* The 'valid_____' variables are declared and assigned on the same line.
* New functions:
	* 'handleNumberID' - Validates item number ID.
	* 'handleNameType' - Validates if the name type is a string.
	* 'handleNameLength' - Validates name string length.
	* 'handleActiveFlag' - Validates active flag.

---

**./src/import-export/validation/case-rows.js**
* validateImportedCaseObjects
	* Renamed 'validationResult' variable to 'validationResultObject'
* handleCurrentObject
	* Renamed 'validationRes' parameter to 'validationResult'
	* Removed "Checks base object type." comment.
	* Split IF structure into different functions for readability.
		* Comments have been moved to their respective functions.
		* The `validActiveFlag === true` condition remains for closure.
	* The 'valid_____' variables are declared and assigned on the same line.
		* The blank lines between variables remain.
* New functions:
	* 'handleEntryID' - Validates case entry ID number.
	* 'handleCaseCodeString' - Checks if the case code is a valid string.
	* 'handleCaseCodeFormat' - Checks case code syntax.
	* 'handleForeignKeyNumber' - Checks Foreign Key number ID.
	* 'handleDescription' - Validates case description.
	* 'handleDeterminationFlag' - Validates determination flag.
	* 'handleDeterminationDate' - Validates determination date.
	* 'handleArchiveTimestamp' - Validates archive timestamp.
	* 'handleDocumentURL' - Validates report PDF URL string.
	* 'handleDownloadFlag' - Validates file download flag.
	* 'handleActiveFlag' - Validates active flag.
