const mongoose = require('mongoose');

/**
 * Post Schema - Defines the structure of a social media post
 *
 * Fields:
 * - eventName: Name of the event being promoted
 * - caption: Text content of the post
 * - image: Path to uploaded image
 * - scheduledFor: When to publish (null = draft)
 * - status: Current state of the post
 * - publishedAt: When it was actually published
 */
const postSchema = new mongoose.Schema(
	{
		// Event Details
		eventName: {
			type: String,
			required: [true, 'Event name is required'],
			trim: true,
			maxlength: [200, 'Event name cannot exceed 200 characters'],
		},

		// Post Content
		caption: {
			type: String,
			required: [true, 'Caption is required'],
			trim: true,
			maxlength: [3000, 'Caption cannot exceed 3000 characters'],
		},

		// Image/Media
		image: {
			type: String, // File path or URL
			required: false,
		},

		// Scheduling
		scheduledFor: {
			type: Date,
			default: null,
			validate: {
				validator: function (value) {
					// Only validate on creation, not updates
					// This allows the scheduler to update posts even after scheduledFor has passed
					if (this.isNew) {
						return !value || value > new Date();
					}
					return true; // Skip validation on updates
				},
				message: 'Scheduled date must be in the future',
			},
		},

		// Status tracking
		status: {
			type: String,
			enum: ['draft', 'scheduled', 'publishing', 'published', 'failed'],
			default: 'draft',
		},

		// Publishing info
		publishedAt: {
			type: Date,
			default: null,
		},

		linkedinPostUrl: {
			type: String,
			default: null,
		},

		// Error tracking
		errorMessage: {
			type: String,
			default: null,
		},

		// Metadata
		createdBy: {
			type: String,
			default: 'admin',
		},
	},
	{
		timestamps: true, // Automatically adds createdAt and updatedAt
	}
);

// Index for faster queries
postSchema.index({ status: 1, scheduledFor: 1 });

// Instance method to check if post is ready to publish
postSchema.methods.isReadyToPublish = function () {
	return (
		this.status === 'scheduled' &&
		this.scheduledFor &&
		this.scheduledFor <= new Date()
	);
};

// Static method to get all posts ready for publishing
postSchema.statics.getReadyToPublish = function () {
	return this.find({
		status: 'scheduled',
		scheduledFor: { $lte: new Date() },
	}).sort({ scheduledFor: 1 });
};

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
