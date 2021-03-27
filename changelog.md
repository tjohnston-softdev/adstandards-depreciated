# Changelog

**./src/common/entry/**
* Added comments to functions in 'entry-error-text.js
* Reduced JSON definition to single line in 'import-validation-result.js'

---

**./src/common/file-management/file-search.js**
* Removed 'numberRegex' global variable.
	* Now used inline as part of 'isolateNumber'

---

**./src/common/file-management/errors/**
* Added comments to functions in these files:
	* fs-general-text.js
	* io-error-text.js

---

**./src/common/value-limits.js**
* Rewrote 'checkStringType' for simplicity.
	* Only checks 'subjectValue' type.

---

**./src/import-export/import-info.js**
* Added comment to 'setFileDescription' function.

---

**./src/import-export/write-export-files.js**
* Removed the 'initializeDataResult' function.
	* JSON object definition is now inline for 'coordinateDataFile'

---
**./src/misc/unk-file-write.js**
* JSON definition in 'initializeSheetResult' reduced to a single line.
	* Although it is only called once, the function remains for readability.

---

**./src/web-scrape/storage/filter-date.js**
* Reduced blank space between header comment and 'dateTasks'
