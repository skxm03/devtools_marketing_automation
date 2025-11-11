require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('../src/models/Template');
const config = require('../src/config/config');

/**
 * Seed script to add sample templates to the database
 * Run this after setting up the database
 */

const sampleTemplates = [
	{
		name: 'Event Announcement',
		content: `🎉 Exciting News! 🎉

We're thrilled to announce {{eventName}}!

📅 Date: {{date}}
📍 Location: {{location}}
🎟️ Register: {{registrationLink}}

Join us for an unforgettable experience! Don't miss out on this opportunity to {{eventDescription}}.

#Event #{{eventHashtag}} #Networking #Community`,
		description: 'Perfect for announcing upcoming events',
		category: 'event',
		placeholders: [
			'eventName',
			'date',
			'location',
			'registrationLink',
			'eventDescription',
			'eventHashtag',
		],
	},
	{
		name: 'Product Launch',
		content: `🚀 Introducing {{productName}}! 🚀

We're excited to launch our latest innovation designed to {{productBenefit}}.

✨ Key Features:
• {{feature1}}
• {{feature2}}
• {{feature3}}

Available now at {{productLink}}

#ProductLaunch #Innovation #{{productCategory}}`,
		description: 'Announce new product launches',
		category: 'announcement',
		placeholders: [
			'productName',
			'productBenefit',
			'feature1',
			'feature2',
			'feature3',
			'productLink',
			'productCategory',
		],
	},
	{
		name: 'Team Achievement',
		content: `🏆 Celebrating Success! 🏆

Huge congratulations to {{teamName}} for {{achievement}}!

This milestone wouldn't have been possible without the dedication and hard work of our amazing team.

{{additionalDetails}}

#TeamWork #Success #Milestone #{{companyName}}`,
		description: 'Celebrate team achievements and milestones',
		category: 'announcement',
		placeholders: [
			'teamName',
			'achievement',
			'additionalDetails',
			'companyName',
		],
	},
	{
		name: 'Limited Offer',
		content: `⏰ Limited Time Offer! ⏰

Get {{discountAmount}} off on {{productOrService}}!

Offer valid until {{expiryDate}}

Don't miss out! Use code: {{promoCode}}

Shop now: {{shopLink}}

#Sale #LimitedOffer #Discount #{{category}}`,
		description: 'Promote limited-time offers and sales',
		category: 'promotion',
		placeholders: [
			'discountAmount',
			'productOrService',
			'expiryDate',
			'promoCode',
			'shopLink',
			'category',
		],
	},
	{
		name: 'Thought Leadership',
		content: `💡 {{thoughtTitle}}

{{mainContent}}

What are your thoughts on this? Share your perspective in the comments!

#ThoughtLeadership #{{industry}} #{{topic}}`,
		description: 'Share insights and thought leadership content',
		category: 'general',
		placeholders: ['thoughtTitle', 'mainContent', 'industry', 'topic'],
	},
];

async function seedTemplates() {
	try {
		// Connect to MongoDB
		await mongoose.connect(config.mongodb.uri, config.mongodb.options);
		console.log('✅ Connected to MongoDB');

		// Clear existing templates (optional)
		const existingCount = await Template.countDocuments();
		if (existingCount > 0) {
			console.log(`⚠️  Found ${existingCount} existing templates`);
			const readline = require('readline').createInterface({
				input: process.stdin,
				output: process.stdout,
			});

			const answer = await new Promise((resolve) => {
				readline.question(
					'Do you want to clear existing templates? (yes/no): ',
					resolve
				);
			});
			readline.close();

			if (answer.toLowerCase() === 'yes') {
				await Template.deleteMany({});
				console.log('🗑️  Cleared existing templates');
			}
		}

		// Insert sample templates
		const inserted = await Template.insertMany(sampleTemplates);
		console.log(`✅ Successfully added ${inserted.length} templates:`);
		inserted.forEach((template) => {
			console.log(`   - ${template.name}`);
		});

		console.log('\n🎉 Seeding completed!');
		process.exit(0);
	} catch (error) {
		console.error('❌ Error seeding templates:', error.message);
		process.exit(1);
	}
}

seedTemplates();
