// Deletes saved report folder. Used as part of: '../report-clear.js'

const folderTasks = require("../../common/file-management/folder-tasks");
const fsDesc = require("../../common/interface/general/fs-desc");
const storedPaths = require("../../../stored-paths");


function deleteExistingFiles(existFileCallback)
{
	folderTasks.deletePath(storedPaths.reportsFolder, fsDesc.reportFolder, function (deleteFolderError, deleteFolderRes)
	{
		if (deleteFolderError !== null)
		{
			return existFileCallback(deleteFolderError, null);
		}
		else
		{
			return existFileCallback(null, true);
		}
	});
}



module.exports =
{
	deleteExisting: deleteExistingFiles
};