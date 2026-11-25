const drive = require('../config/googleDrive')

async function getFolderContents(folderId) {
  try {
    let files = []
    let nextPageToken = null

    do {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and trashed = false`,
        pageSize: 1000,
        pageToken: nextPageToken || undefined,
        orderBy: 'name',
        fields: 'nextPageToken, files(id, name, mimeType, size, webViewLink)',
        supportsAllDrives: true,
        includeItemsFromAllDrives: true,
      })

      files = files.concat(response.data.files || [])
      nextPageToken = response.data.nextPageToken
    } while (nextPageToken)

    return files
  } catch (error) {
    console.error('Error fetching Drive folder contents:', error.message)
    throw error
  }
}

module.exports = {
  getFolderContents,
}
