import crypto from 'crypto'
import multer from 'multer'
import { extname, join } from 'path'
import fs from 'fs'

const uploadDir = join(process.cwd(), 'public', 'temp')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // check + create on every request, not just once at startup
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(16, function (err, raw) {
      if (err) return cb(err, '')
      cb(null, file.fieldname + '-' + raw.toString('hex') + extname(file.originalname))
    })
  }
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Only PDF/DOC/DOCX files are allowed'))
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
})