const cron = require('node-cron');
const Post = require('../models/Post');
const LinkedInService = require('./linkedin');

/**
 * Scheduler Service
 *
 * This service runs every minute to check if there are any posts
 * scheduled for publishing and publishes them automatically
 */

class SchedulerService {
	constructor() {
		this.isRunning = false;
		this.task = null;
	}

	/**
	 * Start the scheduler
	 * Runs every minute: '* * * * *'
	 */
	start() {
		if (this.isRunning) {
			console.log('⚠️  Scheduler is already running');
			return;
		}

		console.log('⏰ Starting post scheduler...');

		// Cron pattern: minute hour day month day-of-week
		// '* * * * *' = every minute
		// '*/5 * * * *' = every 5 minutes
		// '0 * * * *' = every hour at minute 0

		this.task = cron.schedule('* * * * *', async () => {
			await this.checkAndPublishPosts();
		});

		this.isRunning = true;
		console.log('✅ Scheduler started - checking for posts every minute');
	}

	/**
	 * Stop the scheduler
	 */
	stop() {
		if (this.task) {
			this.task.stop();
			this.isRunning = false;
			console.log('🛑 Scheduler stopped');
		}
	}

	/**
	 * Check for posts ready to publish and publish them
	 */
	async checkAndPublishPosts() {
		try {
			// Find posts that are scheduled and ready to publish
			const postsToPublish = await Post.getReadyToPublish();

			if (postsToPublish.length === 0) {
				// No posts to publish
				return;
			}

			console.log(
				`\n📋 Found ${postsToPublish.length} post(s) ready to publish`
			);

			// Process each post
			for (const post of postsToPublish) {
				await this.publishPost(post);
			}
		} catch (error) {
			console.error('❌ Scheduler error:', error.message);
		}
	}

	/**
	 * Publish a single post
	 */
	async publishPost(post) {
		try {
			console.log(`\n📤 Publishing post: ${post.eventName}`);
			console.log(`   Scheduled for: ${post.scheduledFor}`);

			// IMPORTANT: Immediately mark as 'publishing' to prevent duplicate publishes
			// Use findByIdAndUpdate to bypass validation on scheduledFor field
			await Post.findByIdAndUpdate(
				post._id,
				{ status: 'publishing' },
				{ runValidators: false } // Skip validation to allow updating posts with past scheduledFor
			);

			// Create LinkedIn service instance
			const linkedInService = new LinkedInService();

			// Publish to LinkedIn
			const result = await linkedInService.publishPost(
				post.caption,
				post.image
			);

			// Update post status to published
			await Post.findByIdAndUpdate(
				post._id,
				{
					status: 'published',
					publishedAt: new Date(),
					linkedinPostUrl: result.url || null,
					errorMessage: null,
				},
				{ runValidators: false }
			);

			console.log(`✅ Successfully published post: ${post.eventName}`);
		} catch (error) {
			console.error(`❌ Failed to publish post: ${post.eventName}`);
			console.error(`   Error: ${error.message}`);

			// Update post status to failed
			await Post.findByIdAndUpdate(
				post._id,
				{
					status: 'failed',
					errorMessage: error.message,
				},
				{ runValidators: false }
			);
		}
	}

	/**
	 * Manually trigger a check (for testing)
	 */
	async triggerCheck() {
		console.log('🔄 Manually triggering scheduler check...');
		await this.checkAndPublishPosts();
	}

	/**
	 * Get scheduler status
	 */
	getStatus() {
		return {
			isRunning: this.isRunning,
			message: this.isRunning
				? 'Scheduler is active'
				: 'Scheduler is stopped',
		};
	}
}

// Create singleton instance
const schedulerService = new SchedulerService();

module.exports = schedulerService;
