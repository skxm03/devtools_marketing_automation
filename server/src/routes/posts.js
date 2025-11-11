const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { upload } = require('../utils/fileUpload');

/**
 * @route   GET /api/posts
 * @desc    Get all posts
 * @access  Public
 */
router.get('/', async (req, res) => {
	try {
		const { status } = req.query;

		// Build query filter
		const filter = status ? { status } : {};

		// Get posts from database, newest first
		const posts = await Post.find(filter).sort({ createdAt: -1 });

		res.json({
			success: true,
			count: posts.length,
			data: posts,
		});
	} catch (error) {
		console.error('Error fetching posts:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while fetching posts',
			error: error.message,
		});
	}
});

/**
 * @route   GET /api/posts/:id
 * @desc    Get single post by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Post not found',
			});
		}

		res.json({
			success: true,
			data: post,
		});
	} catch (error) {
		console.error('Error fetching post:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while fetching post',
			error: error.message,
		});
	}
});

/**
 * @route   POST /api/posts
 * @desc    Create a new post
 * @access  Public
 *
 * Body should include:
 * - eventName (required)
 * - caption (required)
 * - image (optional file upload)
 */
router.post('/', upload.single('image'), async (req, res) => {
	try {
		const { eventName, caption, scheduledFor } = req.body;

		// Validate required fields
		if (!eventName || !caption) {
			return res.status(400).json({
				success: false,
				message: 'Please provide event name and caption',
			});
		}

		// Create post object
		const postData = {
			eventName,
			caption,
			image: req.file ? req.file.path : null,
			scheduledFor: scheduledFor || null,
			status: scheduledFor ? 'scheduled' : 'draft',
		};

		// Save to database
		const post = await Post.create(postData);

		res.status(201).json({
			success: true,
			message: 'Post created successfully',
			data: post,
		});
	} catch (error) {
		console.error('Error creating post:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while creating post',
			error: error.message,
		});
	}
});

/**
 * @route   PUT /api/posts/:id
 * @desc    Update a post
 * @access  Public
 */
router.put('/:id', upload.single('image'), async (req, res) => {
	try {
		const { eventName, caption, scheduledFor, status } = req.body;

		// Find existing post
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Post not found',
			});
		}

		// Update fields
		if (eventName) post.eventName = eventName;
		if (caption) post.caption = caption;
		if (scheduledFor) {
			post.scheduledFor = scheduledFor;
			post.status = 'scheduled';
		}
		if (status) post.status = status;
		if (req.file) post.image = req.file.path;

		// Save changes
		await post.save();

		res.json({
			success: true,
			message: 'Post updated successfully',
			data: post,
		});
	} catch (error) {
		console.error('Error updating post:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while updating post',
			error: error.message,
		});
	}
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Delete a post
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Post not found',
			});
		}

		// Delete the post
		await post.deleteOne();

		res.json({
			success: true,
			message: 'Post deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting post:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while deleting post',
			error: error.message,
		});
	}
});

/**
 * @route   POST /api/posts/upload
 * @desc    Upload an image (separate from post creation)
 * @access  Public
 *
 * This endpoint allows uploading an image independently,
 * useful when you want to upload an image first and then
 * create a post with the returned image URL.
 */
router.post('/upload', upload.single('image'), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({
				success: false,
				message: 'Please upload an image file',
			});
		}

		// Return the uploaded file information
		res.status(200).json({
			success: true,
			message: 'Image uploaded successfully',
			imageUrl: req.file.path,
			filename: req.file.filename,
			size: req.file.size,
			mimetype: req.file.mimetype,
		});
	} catch (error) {
		console.error('Error uploading image:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while uploading image',
			error: error.message,
		});
	}
});

/**
 * @route   POST /api/posts/:id/publish
 * @desc    Publish a post to LinkedIn
 * @access  Public
 */
router.post('/:id/publish', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Post not found',
			});
		}

		// Check if already published
		if (post.status === 'published') {
			return res.status(400).json({
				success: false,
				message: 'Post is already published',
			});
		}

		// Import LinkedIn service
		const LinkedInService = require('../services/linkedin');
		const linkedinService = new LinkedInService();

		// Publish to LinkedIn
		// Note: publishPost expects (caption, imagePath)
		const imagePath = post.image ? post.image : null;
		const result = await linkedinService.publishPost(
			post.caption,
			imagePath
		);

		if (result.success) {
			// Update post status
			post.status = 'published';
			post.publishedAt = new Date();
			await post.save();

			res.json({
				success: true,
				message: 'Post published successfully to LinkedIn',
				data: post,
				linkedinUrl: result.url,
			});
		} else {
			// Update to failed status
			post.status = 'failed';
			await post.save();

			res.status(500).json({
				success: false,
				message: 'Failed to publish post to LinkedIn',
				error: result.error,
			});
		}
	} catch (error) {
		console.error('Error publishing post:', error);

		// Update post status to failed
		try {
			const post = await Post.findById(req.params.id);
			if (post) {
				post.status = 'failed';
				await post.save();
			}
		} catch (updateError) {
			console.error('Error updating post status:', updateError);
		}

		res.status(500).json({
			success: false,
			message: 'Server error while publishing post',
			error: error.message,
		});
	}
});

module.exports = router;
