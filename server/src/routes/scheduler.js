const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const LinkedInService = require('../services/linkedin');
const schedulerService = require('../services/scheduler');

/**
 * @route   POST /api/schedule/:id
 * @desc    Schedule a post for later publishing
 * @access  Public
 */
router.post('/:id', async (req, res) => {
	try {
		const { scheduledFor } = req.body;

		if (!scheduledFor) {
			return res.status(400).json({
				success: false,
				message: 'Please provide scheduledFor date',
			});
		}

		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Post not found',
			});
		}

		// Validate scheduled date is in the future
		const scheduleDate = new Date(scheduledFor);
		if (scheduleDate <= new Date()) {
			return res.status(400).json({
				success: false,
				message: 'Scheduled date must be in the future',
			});
		}

		// Update post
		post.scheduledFor = scheduleDate;
		post.status = 'scheduled';
		await post.save();

		res.json({
			success: true,
			message: 'Post scheduled successfully',
			data: post,
		});
	} catch (error) {
		console.error('Error scheduling post:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while scheduling post',
			error: error.message,
		});
	}
});

/**
 * @route   POST /api/publish/:id
 * @desc    Publish a post immediately
 * @access  Public
 */
router.post('/publish/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Post not found',
			});
		}

		if (post.status === 'published') {
			return res.status(400).json({
				success: false,
				message: 'Post is already published',
			});
		}

		// Publish to LinkedIn
		const linkedInService = new LinkedInService();

		try {
			const result = await linkedInService.publishPost(
				post.caption,
				post.image
			);

			// Update post status
			post.status = 'published';
			post.publishedAt = new Date();
			post.linkedinPostUrl = result.url || null;
			await post.save();

			res.json({
				success: true,
				message: 'Post published successfully',
				data: post,
			});
		} catch (publishError) {
			// Update post status to failed
			post.status = 'failed';
			post.errorMessage = publishError.message;
			await post.save();

			throw publishError;
		}
	} catch (error) {
		console.error('Error publishing post:', error);
		res.status(500).json({
			success: false,
			message: 'Failed to publish post',
			error: error.message,
		});
	}
});

/**
 * @route   GET /api/scheduled
 * @desc    Get all scheduled posts
 * @access  Public
 */
router.get('/scheduled', async (req, res) => {
	try {
		const scheduledPosts = await Post.find({
			status: 'scheduled',
		}).sort({ scheduledFor: 1 });

		res.json({
			success: true,
			count: scheduledPosts.length,
			data: scheduledPosts,
		});
	} catch (error) {
		console.error('Error fetching scheduled posts:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while fetching scheduled posts',
			error: error.message,
		});
	}
});

/**
 * @route   GET /api/scheduler/status
 * @desc    Get scheduler status
 * @access  Public
 */
router.get('/scheduler/status', (req, res) => {
	const status = schedulerService.getStatus();
	res.json({
		success: true,
		data: status,
	});
});

/**
 * @route   POST /api/scheduler/trigger
 * @desc    Manually trigger scheduler check (for testing)
 * @access  Public
 */
router.post('/scheduler/trigger', async (req, res) => {
	try {
		await schedulerService.triggerCheck();
		res.json({
			success: true,
			message: 'Scheduler check triggered',
		});
	} catch (error) {
		console.error('Error triggering scheduler:', error);
		res.status(500).json({
			success: false,
			message: 'Error triggering scheduler',
			error: error.message,
		});
	}
});

module.exports = router;
