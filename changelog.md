# Changelog

**./src/web-request/sub/reply-output.js - enforceDelay**
* Changed delay length from 1000ms to 100ms.
	* It is still technically there but it has been greatly reduced.
	* Getting rid of the delay entirely might cause file downloads to be unstable.
	* Quick tests were successful as expected.