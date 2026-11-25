const { google } = require('googleapis')

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/drive.readonly'],
})

const drive = google.drive({
  version: 'v3',
  auth,
})

module.exports = drive
