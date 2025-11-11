const express = require('express');
const router = express.Router();
const Template = require('../models/Template');

/**
 * @route   GET /api/templates
 * @desc    Get all templates
 * @access  Public
 */
router.get('/', async (req, res) => {
	try {
		const { category, isActive } = req.query;

		// Build query filter
		const filter = {};
		if (category) filter.category = category;
		if (isActive !== undefined) filter.isActive = isActive === 'true';

		const templates = await Template.find(filter).sort({ usageCount: -1 });

		res.json({
			success: true,
			count: templates.length,
			data: templates,
		});
	} catch (error) {
		console.error('Error fetching templates:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while fetching templates',
			error: error.message,
		});
	}
});

/**
 * @route   POST /api/templates
 * @desc    Create a new template
 * @access  Public
 */
router.post('/', async (req, res) => {
	try {
		const { name, content, description, category, placeholders } = req.body;

		if (!name || !content) {
			return res.status(400).json({
				success: false,
				message: 'Please provide template name and content',
			});
		}

		const template = await Template.create({
			name,
			content,
			description,
			category,
			placeholders,
		});

		res.status(201).json({
			success: true,
			message: 'Template created successfully',
			data: template,
		});
	} catch (error) {
		console.error('Error creating template:', error);

		// Handle duplicate template name
		if (error.code === 11000) {
			return res.status(400).json({
				success: false,
				message: 'Template with this name already exists',
			});
		}

		res.status(500).json({
			success: false,
			message: 'Server error while creating template',
			error: error.message,
		});
	}
});

/**
 * @route   POST /api/templates/:id/fill
 * @desc    Fill template with data
 * @access  Public
 */
router.post('/:id/fill', async (req, res) => {
	try {
		const template = await Template.findById(req.params.id);

		if (!template) {
			return res.status(404).json({
				success: false,
				message: 'Template not found',
			});
		}

		// Fill template with provided data
		const filledContent = template.fillTemplate(req.body);

		// Increment usage count
		await template.incrementUsage();

		res.json({
			success: true,
			data: {
				content: filledContent,
				originalTemplate: template,
			},
		});
	} catch (error) {
		console.error('Error filling template:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while filling template',
			error: error.message,
		});
	}
});

/**
 * @route   DELETE /api/templates/:id
 * @desc    Delete a template
 * @access  Public
 */
router.delete('/:id', async (req, res) => {
	try {
		const template = await Template.findById(req.params.id);

		if (!template) {
			return res.status(404).json({
				success: false,
				message: 'Template not found',
			});
		}

		await template.deleteOne();

		res.json({
			success: true,
			message: 'Template deleted successfully',
		});
	} catch (error) {
		console.error('Error deleting template:', error);
		res.status(500).json({
			success: false,
			message: 'Server error while deleting template',
			error: error.message,
		});
	}
});

module.exports = router;
