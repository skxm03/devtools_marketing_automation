const mongoose = require('mongoose');
const config = require('./config');

/**
 * Connect to MongoDB database
 * This function handles the database connection
 */
const connectDB = async () => {
	try {
		// Attempt to connect to MongoDB
		const conn = await mongoose.connect(
			config.mongodb.uri,
			config.mongodb.options
		);

		console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
		console.log(`📊 Database: ${conn.connection.name}`);

		return conn;
	} catch (error) {
		console.error('❌ MongoDB Connection Error:', error.message);

		// Show helpful error messages
		if (error.message.includes('ECONNREFUSED')) {
			console.error('\n💡 Tip: Make sure MongoDB is running!');
			console.error(
				'   - Local: Run "mongod" or "brew services start mongodb-community"'
			);
			console.error(
				'   - Atlas: Check your connection string in .env file\n'
			);
		}

		// Exit process with failure
		process.exit(1);
	}
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
	console.log('⚠️  MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
	console.error('❌ MongoDB error:', err);
});

module.exports = connectDB;
