const mongoose = require('mongoose');

/**
 * Template Schema - Stores reusable caption templates
 *
 * Templates can have placeholders like {{eventName}}, {{date}}, etc.
 * that get replaced with actual values when creating a post
 */
const templateSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Template name is required'],
			trim: true,
			unique: true,
			maxlength: [100, 'Template name cannot exceed 100 characters'],
		},

		content: {
			type: String,
			required: [true, 'Template content is required'],
			trim: true,
			maxlength: [3000, 'Template content cannot exceed 3000 characters'],
		},

		description: {
			type: String,
			trim: true,
			maxlength: [500, 'Description cannot exceed 500 characters'],
		},

		// Placeholders available in this template
		placeholders: [
			{
				type: String,
				trim: true,
			},
		],

		category: {
			type: String,
			enum: ['event', 'announcement', 'promotion', 'general'],
			default: 'general',
		},

		isActive: {
			type: Boolean,
			default: true,
		},

		usageCount: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

// Method to replace placeholders in template
templateSchema.methods.fillTemplate = function (data) {
	let filledContent = this.content;

	// Replace each placeholder with actual data
	Object.keys(data).forEach((key) => {
		const placeholder = new RegExp(`{{${key}}}`, 'gi');
		filledContent = filledContent.replace(placeholder, data[key] || '');
	});

	return filledContent;
};

// Increment usage count when template is used
templateSchema.methods.incrementUsage = async function () {
	this.usageCount += 1;
	await this.save();
};

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
