/*
	This file is responsible for deleting saved page HTML files
	Used in the commands 'download-pages' and 'read-cases'
*/

const ora = require("ora");
const storedPaths = require("../../stored-paths");
const folderTasks = require("../common/file-management/folder-tasks");
const fsDesc = require("../common/interface/general/fs-desc");


// Main function.
function removePagesCacheFolder(clearToggleEnabled, cacheRemoveCallback)
{
	if (clearToggleEnabled === true)
	{
		coordinateRemove(cacheRemoveCallback);
	}
	else
	{
		return cacheRemoveCallback(null, true);
	}
}


// Delete page folder.
function coordinateRemove(cRemCallback)
{
	var cacheSpinner = ora("Deleting Saved Page Files").start();
	
	folderTasks.deletePath(storedPaths.pageFolder, fsDesc.pagesFolder, function(pRemoveError, pRemoveRes)
	{
		if (pRemoveError !== null)
		{
			cacheSpinner.fail("Page Folder Delete Error");
			return cRemCallback(pRemoveError, null);
		}
		else
		{
			cacheSpinner.succeed("Page Folder Deleted");
			return cRemCallback(null, true);
		}
	});
	
}



module.exports =
{
	removePagesFolder: removePagesCacheFolder
};