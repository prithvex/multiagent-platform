import fs from "fs"
import path from "path"
import multer from "multer"

const uploadDir = path.resolve("./temp")

// particular path is exist or not 
if (fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`)
    },
})

// filer file only image or pdf 
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/") || file.mimetype === ("application/pdf")) {
        cb(null, true)
    } else {
        cb(new Error("Please upload image or pdf files only"), false)
    }
}

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
})
