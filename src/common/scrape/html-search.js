// 'Cheerio' selector text for HTML elements.

const productCategoryElement = "#edit-category";								// Product Category dropdown
const mediaTypeElement = "#edit-media";											// Media Type dropdown
const lastPageElement = '[class="pager__item pager__item--last"] a';			// Last page URL
const caseRowElements = 'table[class="views-table cols-6"] tbody tr';			// Advertisement case table row


module.exports =
{
	productCategory: productCategoryElement,
	mediaType: mediaTypeElement,
	lastPage: lastPageElement,
	caseRows: caseRowElements
};