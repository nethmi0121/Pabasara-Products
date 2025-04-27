import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Ensure the uploads directory exists
const uploadDir = './src/uploads'
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }) // Creates directory if not exists
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir) // Ensure this matches the static middleware path
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit per file
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimeType = allowedTypes.test(file.mimetype)

        if (extName && mimeType) {
            cb(null, true)
        } else {
            cb(new Error('Only images are allowed'))
        }
    }
})

export default upload
