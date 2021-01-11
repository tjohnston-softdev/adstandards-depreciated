
// Checks whether a given string exists in an array.
function checkTextItemAvailable(targetString, existingItems)
{
	var targetPrep = targetString.toLowerCase();
	
	var itemIndex = 0;
	var currentItem = "";
	var availabilityRes = true;
	
	while (itemIndex >= 0 && itemIndex < existingItems.length && availabilityRes === true)
	{
		currentItem = existingItems[itemIndex];
		currentItem = currentItem.toLowerCase();
		
		if (currentItem === targetPrep)
		{
			availabilityRes = false;
		}
		
		itemIndex = itemIndex + 1;
	}
	
	return availabilityRes;
}



module.exports =
{
	checkTextAvailable: checkTextItemAvailable
};