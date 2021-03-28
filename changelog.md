# Changelog

**./src/web-scrape/elements/**
* Added comment between validation and result IF structures for the following:
	* page-count.js - readPageCountNumber
	* select-basic.js - readSelectListData, readCurrentOption
	* table-case-cells.js - addCurrentRow
	* table-case-rows.js - readRowObjects, readCurrentRow
* It would not be feasible to split the IF structures into individual functions without some major code redesign.
