const express = require('express')
const router = express.Router()

const driveFolders = require('../config/driveFolders')
const { getFolderContents } = require('../services/driveService')

// Get PDF files directly inside a folder
function getPDFs(files) {
  return files
    .filter((file) => file.mimeType === 'application/pdf')
    .map((file) => ({
      id: file.id,
      name: file.name,
      size: file.size || null,
      webViewLink: file.webViewLink || null,
    }))
}

// Get PYQ years
router.get('/pyqs', async (req, res) => {
  try {
    const files = await getFolderContents(driveFolders.pyq)

    const years = files
      .filter((file) => file.mimeType === 'application/vnd.google-apps.folder')
      .map((folder) => ({
        id: folder.id,
        name: folder.name,
      }))
      .sort((a, b) => Number(a.name) - Number(b.name))

    res.json({ success: true, years })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to retrieve PYQ years.',
    })
  }
})

// Get PYQ PDFs for a selected year folder
router.get('/pyqs/:yearId', async (req, res) => {
  try {
    const files = await getFolderContents(req.params.yearId)

    res.json({
      success: true,
      files: getPDFs(files),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to retrieve PYQ PDFs.',
    })
  }
})

// Get subject folders
router.get('/subjects', async (req, res) => {
  try {
    const files = await getFolderContents(driveFolders.subjectWise)

    const subjects = files
      .filter((file) => file.mimeType === 'application/vnd.google-apps.folder')
      .map((folder) => ({
        id: folder.id,
        name: folder.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    res.json({ success: true, subjects })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to retrieve subjects.',
    })
  }
})

// Get PDFs for a selected subject folder
router.get('/subjects/:subjectId', async (req, res) => {
  try {
    const files = await getFolderContents(req.params.subjectId)

    res.json({
      success: true,
      files: getPDFs(files),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to retrieve subject PDFs.',
    })
  }
})

// Get all Notes PDFs
router.get('/notes', async (req, res) => {
  try {
    const files = await getFolderContents(driveFolders.notes)

    res.json({
      success: true,
      files: getPDFs(files),
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Unable to retrieve Notes PDFs.',
    })
  }
})

module.exports = router
