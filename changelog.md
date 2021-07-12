# Changelog

**./src/common/database/db-connection.js**
* Added error comments to:
	* openDatabaseConnection
	* closeDatabaseConnection
* Rewrote 'openDatabaseConnection' successful comment.
	* Changed "object" to "successful"

---

**./src/common/database/db-insert.js**
* Removed 'insertImportedDataRows' function.

---

**./src/common/database/db-select.js**
* Removed functions:
	* selectExportDataRows
	* selectUnknownEntryDataRows
	* selectCaseCodeKeyExists
* Removed requirements:
	* ./row-data/data-unknown
	* ./row-data/data-general

---

**./src/common/database/queries/insert-query-text.js**
* Removed 'writeRowImportInsert' function.

---

**./src/common/database/queries/select-query-text.js**
* Removed functions:
	* writeCaseKeySelect
	* writeExportRowSelect
	* writeUnknownEntriesSelect

---

**./src/common/database/row-data/**
* Files are now empty:
	* data-general.js
	* data-unknown.js

---

**./src/file-prep/folder-intl.js**
* Removed 'initializeTargetFolder' function.
	* Was used to create import-export output folder.

---

**./src/common/entry/**
* These files are now empty:
	* category-reference.js
	* csv-error-text.js
	* data-paths.js
* Removed functions from 'entry-error-text.js'
	* writeInvalidDeterminationDateText
	* writeInvalidCaseCodeText
	* writeInvalidNumberKeyText
	* writeNumberAlreadyTakenText
	* writeStringDoesNotExistText

---

**./src/common/file-management/file-exists.js**
* Removed function 'checkFileExistsMissing'

---

**./src/common/file-management/file-names.js**
* Removed redundancy from these header comments:
	* getReportFileSyntaxDefinition
	* getReportNestSyntaxDefinition

---

**./src/common/file-management/file-search.js - getSavedReportFile**
* Removed "file" from header comment.

---

**./src/common/file-management/size-limits.js**
* Removed "file" from 'maxReportBytes' comment.

---

**./src/common/file-management/errors/fs-general-text.js**
* Removed 'writeFileExistsText' function.

---

**./src/common/interface/**
* Removed 'importIgnoreErrorsDesc' from 'opt-desc.js'
* 'general/data-desc.js' is now empty.
* Removed from 'general/input-desc.js'
	* outputFilePathDesc
	* folderPathDesc

---

**./src/common/value-limits.js**
* Removed 'rowCacheSizeNumber'

---

**./src/common/value-types.js**
* Removed 'checkTrueFalseFlagType' function.

---

**./stored-paths.js**
* Removed:
	* unknownOutputFilePath
	* exportFolderPath

---

**.gitignore**
* Removed:
	* /unknown-entries.csv
	* /export/
