const express = require('express')
const router = express.Router()

const drive = require('../config/googleDrive')
const driveFolders = require('../config/driveFolders')

const allowedRootFolders = [
  driveFolders.pyq,
  driveFolders.subjectWise,
  driveFolders.notes,
]

async function isAllowedPDF(file) {
  if (file.mimeType !== 'application/pdf' || !file.parents?.length) {
    return false
  }

  let parentIds = file.parents
  const visited = new Set()

  while (parentIds.length > 0) {
    const nextParents = []

    for (const parentId of parentIds) {
      if (allowedRootFolders.includes(parentId)) {
        return true
      }

      if (visited.has(parentId)) continue
      visited.add(parentId)

      const response = await drive.files.get({
        fileId: parentId,
        fields: 'id, parents',
      })

      nextParents.push(...(response.data.parents || []))
    }

    parentIds = nextParents
  }

  return false
}

router.get('/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params
    const download = req.query.download === 'true'

    const metadata = await drive.files.get({
      fileId,
      fields: 'id, name, mimeType, parents',
    })

    const file = metadata.data

    if (!(await isAllowedPDF(file))) {
      return res.status(403).json({
        success: false,
        message: 'Access to this file is not allowed.',
      })
    }

    const filename = encodeURIComponent(file.name)

    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader(
      'Content-Disposition',
      `${download ? 'attachment' : 'inline'}; filename*=UTF-8''${filename}`,
    )
    res.setHeader('Cache-Control', 'private, no-store')

    const response = await drive.files.get(
      { fileId, alt: 'media' },
      { responseType: 'stream' },
    )

    response.data.on('error', (error) => {
      console.error('PDF streaming error:', error.message)

      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Unable to stream PDF.',
        })
      } else {
        res.destroy(error)
      }
    })

    response.data.pipe(res)
  } catch (error) {
    console.error('PDF Error:', error.message)

    if (!res.headersSent) {
      res.status(404).json({
        success: false,
        message: 'PDF not found or unavailable.',
      })
    }
  }
})

module.exports = router
