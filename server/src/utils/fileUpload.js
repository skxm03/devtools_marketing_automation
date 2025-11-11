const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config/config');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(config.upload.uploadDir)) {
	fs.mkdirSync(config.upload.uploadDir, { recursive: true });
}

/**
 * Configure how files are stored
 * This creates unique filenames to avoid conflicts
 */
const storage = multer.diskStorage({
	// Where to store files
	destination: function (req, file, cb) {
		cb(null, config.upload.uploadDir);
	},

	// How to name files (timestamp + random number + original extension)
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
		const ext = path.extname(file.originalname);
		cb(null, 'post-' + uniqueSuffix + ext);
	},
});

/**
 * File filter to allow only images
 */
const fileFilter = (req, file, cb) => {
	if (config.upload.allowedTypes.includes(file.mimetype)) {
		cb(null, true); // Accept file
	} else {
		cb(
			new Error(
				'Invalid file type. Only JPEG, PNG, and GIF images are allowed.'
			),
			false
		);
	}
};

/**
 * Configure multer upload
 */
const upload = multer({
	storage: storage,
	limits: {
		fileSize: config.upload.maxFileSize, // Max 5MB
	},
	fileFilter: fileFilter,
});

/**
 * Helper function to delete a file
 */
const deleteFile = (filePath) => {
	try {
		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
			return true;
		}
		return false;
	} catch (error) {
		console.error('Error deleting file:', error);
		return false;
	}
};

module.exports = {
	upload,
	deleteFile,
};
