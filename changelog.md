# Changelog

**.gitignore**
* Added '/test-download/'

---

**archive.js**
* Added requirement for './src/test-http-requests'
* Wrote new command 'test-http'
	* Downloads test files from Adstandards website.
	* Between 'clear' and 'read-lists'
	* Used to test HTTP requests without database.

---

**stored-paths.js**
* Declared new variables:
	* 'testDownloadFolderPath' - Output folder for test HTTP requests.
	* 'testPagePath' - Download path for test HTML file.
	* 'testReportPath' - Download path for test PDF file.

---

**./src/test-http-requests.js**
* New file - Runs 'test-http' command.

---

**./src/web-request/land-req.js**
* Updated header comment to refer to 'test-http' command.
* Removed 'async' requirement.

---

**./src/web-request/example-report-req.js**
* New file - Used to download example report PDF file.
	* Used in 'test-http' command.
	* When performing the HTTP request, it uses the same fault tolerance as landing pages.

---

**./src/file-prep/test-file-save.js**
* New file - Saves downloaded files from 'test-http' command.

---

**./src/file-prep/folder-intl.js**
* Wrote new function 'initializeHttpTestFolder'
	* Initializes folder for HTTP test downloads.
	* Used in 'test-http' command.

---

**./src/common/web/link-prep.js**
* Declared new global variable 'exampleReportURL'
	* Example URL to report PDF file.
	* Used in the 'test-http' command.
	* Refers to case '0048-21'
* Wrote new function 'getExampleReportURL'
	* Used to access 'exampleReportURL' publicly.

---

**./src/common/interface/general/fs-desc.js**
* Declared new variables for example files in 'test-http' command
	* exampleHtmlFileDesc
	* exampleReportFileDesc
