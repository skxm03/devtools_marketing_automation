require('dotenv').config();

const config = {
	// Server Configuration
	port: process.env.PORT || 3000,
	env: process.env.NODE_ENV || 'development',

	// MongoDB Configuration
	mongodb: {
		uri:
			process.env.MONGODB_URI ||
			'mongodb://localhost:27017/marketing_automation',
		options: {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		},
	},

	// LinkedIn Configuration
	linkedin: {
		email: process.env.LINKEDIN_EMAIL,
		password: process.env.LINKEDIN_PASSWORD,
	},

	// File Upload Configuration
	upload: {
		maxFileSize: process.env.MAX_FILE_SIZE || 5242880, // 5MB
		uploadDir: process.env.UPLOAD_DIR || './uploads',
		allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'],
	},
};

module.exports = config;
