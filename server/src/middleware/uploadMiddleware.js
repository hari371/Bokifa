
const multer = require('multer')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const allowedFolders = new Set(['books', 'authors', 'blogs'])

const imageExtensions = {
	'image/jpeg': '.jpg',
	'image/png': '.png',
	'image/webp': '.webp',
	'image/gif': '.gif',
}

const createImageUpload = (folder) => {
	if (!allowedFolders.has(folder)) {
		throw new Error('Invalid image upload destination.')
	}

	const destination = path.resolve(
		__dirname,
		'../../../assests',
		folder,
	)

	fs.mkdirSync(destination, { recursive: true })

	const storage = multer.diskStorage({
		destination: (req, file, callback) => {
			callback(null, destination)
		},
		filename: (req, file, callback) => {
			const extension = imageExtensions[file.mimetype]
			const filename = `${Date.now()}-${crypto.randomUUID()}${extension}`

			callback(null, filename)
		},
	})

	const upload = multer({
		storage,
		limits: {
			fileSize: 5 * 1024 * 1024,
			files: 1,
		},
		fileFilter: (req, file, callback) => {
			if (!imageExtensions[file.mimetype]) {
				return callback(
					new Error('Only JPG, PNG, WEBP, and GIF images are allowed.'),
				)
			}

			callback(null, true)
		},
	}).single('image')

	return (req, res, next) => {
		upload(req, res, (error) => {
			if (error) {
				return res.status(400).json({
					success: false,
					message:
						error.code === 'LIMIT_FILE_SIZE'
							? 'Image must be 5 MB or smaller.'
							: error.message || 'Image upload failed.',
				})
			}

			if (req.file) {
				req.body.image_url = `/assests/${folder}/${req.file.filename}`
			}

			next()
		})
	}
}

module.exports = createImageUpload
