require('dotenv').config()

const express = require('express')
const cors = require('cors')

const fileRoutes = require('./routes/fileRoutes')
const resourceRoutes = require('./routes/resourceRoutes')
// const drive = require('./config/googleDrive')

const app = express()
const PORT = process.env.PORT || 5000

// Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  ...(process.env.CLIENT_URL || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
]

// Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an origin (health checks, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
  }),
)

app.use(express.json())

// Health check
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MedPrep API is running successfully!',
  })
})

// API health
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'Healthy',
    service: 'MedPrep Backend',
  })
})

// Google Drive connection test
// app.get('/api/drive/test', async (req, res) => {
//   try {
//     const response = await drive.files.list({
//       pageSize: 10,
//       fields: 'files(id, name, mimeType)',
//     })

//     res.json({
//       success: true,
//       message: 'Google Drive connected successfully!',
//       files: response.data.files,
//     })
//   } catch (error) {
//     console.error('Google Drive Error:', error.message)

//     res.status(500).json({
//       success: false,
//       message: 'Google Drive connection failed.',
//     })
//   }
// })

// Resource routes
app.use('/api/resources', resourceRoutes)
app.use('/api/files', fileRoutes)

// Start server
app.listen(PORT, () => {
  console.log(`MedPrep API running on port ${PORT}`)
})
