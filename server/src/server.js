require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Import configuration and database
const config = require('./config/config');
const connectDB = require('./config/database');

// Import routes
const postsRoutes = require('./routes/posts');
const templatesRoutes = require('./routes/templates');
const schedulerRoutes = require('./routes/scheduler');

// Import scheduler service
const schedulerService = require('./services/scheduler');

/**
 * Initialize Express App
 */
const app = express();

/**
 * Middleware Setup
 */

// Enable CORS (allows frontend to make requests)
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (HTML, CSS, JS, images)
app.use(express.static(path.join(__dirname, '../public')));

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging middleware (for debugging)
app.use((req, res, next) => {
	console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
	next();
});

/**
 * API Routes
 */

// Health check endpoint
app.get('/api/health', (req, res) => {
	res.json({
		success: true,
		message: 'Server is running!',
		timestamp: new Date().toISOString(),
		environment: config.env,
	});
});

// Mount API routes
app.use('/api/posts', postsRoutes);
app.use('/api/templates', templatesRoutes);
app.use('/api', schedulerRoutes);

/**
 * Serve Frontend (catch-all route)
 */
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * Error Handling Middleware
 */
app.use((err, req, res, next) => {
	console.error('❌ Error:', err.stack);

	res.status(err.status || 500).json({
		success: false,
		message: err.message || 'Internal Server Error',
		error: config.env === 'development' ? err.stack : undefined,
	});
});

/**
 * Start Server
 */
const startServer = async () => {
	try {
		// Connect to MongoDB
		await connectDB();

		// Start the Express server
		app.listen(config.port, () => {
			console.log('\n' + '='.repeat(60));
			console.log('🚀 Marketing Posts Automation Server');
			console.log('='.repeat(60));
			console.log(
				`📡 Server running on: http://localhost:${config.port}`
			);
			console.log(`🌍 Environment: ${config.env}`);
			console.log(`📊 Database: ${config.mongodb.uri}`);
			console.log('='.repeat(60) + '\n');

			// Start the scheduler
			schedulerService.start();

			console.log('✅ All systems ready!\n');
			console.log('💡 Quick Links:');
			console.log(`   - Frontend: http://localhost:${config.port}`);
			console.log(
				`   - Health Check: http://localhost:${config.port}/api/health`
			);
			console.log(`   - API Docs: See README.md\n`);
		});
	} catch (error) {
		console.error('❌ Failed to start server:', error.message);
		process.exit(1);
	}
};

/**
 * Graceful Shutdown
 */
process.on('SIGINT', () => {
	console.log('\n\n⚠️  Shutting down gracefully...');

	schedulerService.stop();

	process.exit(0);
});

process.on('SIGTERM', () => {
	console.log('\n\n⚠️  Shutting down gracefully...');

	schedulerService.stop();

	process.exit(0);
});

// Start the server
startServer();

module.exports = app;
