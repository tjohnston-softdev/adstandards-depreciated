# Changelog

**package.json**
* Uninstalled 'axios' and replaced with 'needle'

---

**./src/common/web/axios-request.js**
* Replaced 'axios' requirement with 'needle'
* Changed header comment to refer to 'needle'
* Removed the 'getDownloadOptions' function.
* 'wrapAxios' function
	* Renamed to 'wrapNeedle'
	* Rewrote to use 'needle' library.
* 'performFileRequest' function
	* Rewrote callback IF structure to correspond with 'needle' output.
	* Removed line break between:
		* `asyncModule.retry(retryObject,`
		* `function (attemptCallback)`

---

**./src/common/web/link-prep.js**
* Removed inline comment for 'baseURL'

---

**./src/common/web/errors/http-error-text.js**
* Updated 'vRespData' in 'writeStatusText' to use the equivalent 'needle properties:
	* statusCode
	* statusMessage
