const puppeteer = require('puppeteer');
const config = require('../config/config');
const path = require('path');

/**
 * LinkedIn Automation Service
 *
 * IMPORTANT: LinkedIn's ToS prohibits automation. This is for educational purposes only.
 * For production, use the official LinkedIn API.
 *
 * This service uses Puppeteer to:
 * 1. Log in to LinkedIn
 * 2. Navigate to the post creation page
 * 3. Fill in the post content
 * 4. Upload an image (if provided)
 * 5. Publish the post
 */

/**
 * Helper function to wait/delay
 * (Puppeteer changed waitForTimeout to delay in newer versions)
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class LinkedInService {
	constructor() {
		this.browser = null;
		this.page = null;
	}

	/**
	 * Initialize browser and login to LinkedIn
	 */
	async initialize() {
		try {
			console.log('🚀 Launching browser...');

			// Launch browser with macOS-friendly settings
			this.browser = await puppeteer.launch({
				headless: false, // Set to true for background execution
				args: [
					'--no-sandbox',
					'--disable-setuid-sandbox',
					'--disable-dev-shm-usage',
					'--disable-accelerated-2d-canvas',
					'--no-first-run',
					'--no-zygote',
					'--disable-gpu',
				],
				defaultViewport: {
					width: 1280,
					height: 800,
				},
				slowMo: 50,
				ignoreDefaultArgs: ['--disable-extensions'],
			});

			this.page = await this.browser.newPage();

			// Set user agent to avoid detection
			await this.page.setUserAgent(
				'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
			);

			console.log('✅ Browser launched successfully');
			return true;
		} catch (error) {
			console.error('❌ Error initializing browser:', error.message);
			throw error;
		}
	}

	/**
	 * Login to LinkedIn
	 */
	async login() {
		try {
			if (!config.linkedin.email || !config.linkedin.password) {
				throw new Error(
					'LinkedIn credentials not configured in .env file'
				);
			}

			console.log('🔐 Logging in to LinkedIn...');

			// Navigate to LinkedIn login page with increased timeout
			await this.page.goto('https://www.linkedin.com/login', {
				waitUntil: 'domcontentloaded',
				timeout: 120000, // 2 minutes
			});

			// Wait for login form
			await this.page.waitForSelector('#username', { timeout: 30000 });

			// Fill in email
			await this.page.type('#username', config.linkedin.email, {
				delay: 100,
			});

			// Fill in password
			await this.page.type('#password', config.linkedin.password, {
				delay: 100,
			});

			// Click login button
			await this.page.click('button[type="submit"]');

			// Wait for navigation after login with increased timeout
			await this.page.waitForNavigation({
				waitUntil: 'domcontentloaded',
				timeout: 120000, // 2 minutes
			});

			// Check if login was successful by looking for feed
			const currentUrl = this.page.url();

			if (
				currentUrl.includes('/feed') ||
				currentUrl.includes('/checkpoint/challenge')
			) {
				console.log('✅ Login successful!');

				// If there's a verification challenge, wait for manual intervention
				if (currentUrl.includes('/checkpoint/challenge')) {
					console.log('⚠️  LinkedIn security checkpoint detected!');
					console.log(
						'👉 Please complete the verification manually in the browser window.'
					);
					console.log(
						'⏳ Waiting 60 seconds for manual verification...'
					);
					await delay(60000);
				}

				return true;
			} else {
				throw new Error('Login failed - unexpected redirect');
			}
		} catch (error) {
			console.error('❌ Login error:', error.message);
			throw error;
		}
	}

	/**
	 * Create and publish a LinkedIn post
	 *
	 * @param {string} caption - The text content of the post
	 * @param {string} imagePath - Path to image file (optional)
	 */
	async createPost(caption, imagePath = null) {
		try {
			console.log('📝 Creating LinkedIn post...');

			// Navigate to LinkedIn home/feed with better timeout handling
			console.log('🔄 Navigating to LinkedIn feed...');
			await this.page.goto('https://www.linkedin.com/feed/', {
				waitUntil: 'domcontentloaded',
				timeout: 120000, // 2 minutes
			});
			console.log('✅ Feed page loaded');

			// Wait a bit for page to load fully
			await delay(3000);

			// Click on "Start a post" button
			console.log('🔍 Looking for "Start a post" button...');
			const startPostSelectors = [
				'button.artdeco-button--muted.artdeco-button--4.artdeco-button--tertiary', // Updated selector
				'button.share-box-feed-entry__trigger',
				'button[aria-label="Start a post"]',
				'.share-box-feed-entry__trigger',
				'button.artdeco-button--tertiary',
			];

			let clicked = false;
			for (const selector of startPostSelectors) {
				try {
					await this.page.waitForSelector(selector, {
						timeout: 5000,
					});
					await this.page.click(selector);
					clicked = true;
					console.log('✅ Clicked start post button');
					break;
				} catch (e) {
					// Try next selector
					console.log(
						`   ⏭️  Selector "${selector}" not found, trying next...`
					);
					continue;
				}
			}

			if (!clicked) {
				// Take a screenshot to see the page
				await this.page.screenshot({
					path: 'debug-no-start-button.png',
				});
				console.log('📸 Screenshot saved to debug-no-start-button.png');
				throw new Error(
					'Could not find start post button. Check screenshot.'
				);
			}

			// Wait for post modal to appear
			await delay(2000);

			// Take screenshot to see if modal appeared
			await this.page.screenshot({ path: 'debug-after-click.png' });
			console.log(
				'📸 Screenshot after clicking start post: debug-after-click.png'
			);

			// Find the text editor (contenteditable div)
			console.log('🔍 Looking for text editor...');
			const editorSelectors = [
				'div.ql-editor[contenteditable="true"]',
				'div[data-placeholder="What do you want to talk about?"]',
				'div.share-creation-state__text-editor',
			];

			let editorFound = false;
			for (const selector of editorSelectors) {
				try {
					await this.page.waitForSelector(selector, {
						timeout: 5000,
					});

					// Click and type the caption
					await this.page.click(selector);
					await this.page.type(selector, caption, { delay: 50 });

					console.log('✅ Caption entered');
					editorFound = true;
					break;
				} catch (e) {
					console.log(
						`   ⏭️  Editor selector "${selector}" not found, trying next...`
					);
					continue;
				}
			}

			if (!editorFound) {
				// Take a screenshot for debugging
				await this.page.screenshot({ path: 'debug-screenshot.png' });
				console.log('📸 Screenshot saved to debug-screenshot.png');
				throw new Error(
					'Could not find post editor. Check debug-screenshot.png to see what LinkedIn is showing.'
				);
			}

			// Upload image if provided
			if (imagePath) {
				console.log('📷 Uploading image...');

				try {
					// Find image upload input
					const fileInputSelectors = [
						'input[type="file"][accept*="image"]',
						'input[name="image-file-upload"]',
					];

					let fileInput = null;
					for (const selector of fileInputSelectors) {
						try {
							fileInput = await this.page.$(selector);
							if (fileInput) break;
						} catch (e) {
							continue;
						}
					}

					if (fileInput) {
						const absolutePath = path.resolve(imagePath);
						await fileInput.uploadFile(absolutePath);
						console.log('✅ Image uploaded');

						// Wait for image to process
						await delay(3000);
					} else {
						console.log(
							'⚠️  Could not find image upload button - continuing without image'
						);
					}
				} catch (error) {
					console.log('⚠️  Image upload failed:', error.message);
					console.log('   Continuing to post without image...');
				}
			}

			// Find and click the Post button
			console.log('🔍 Looking for Post button...');
			const postButtonSelectors = [
				'button.share-actions__primary-action',
				'button[aria-label="Post"]',
				'button.artdeco-button--primary',
				'button[data-test-share-actions-primary-action]',
				'button.share-actions__primary-action.artdeco-button--primary',
			];

			let posted = false;
			for (const selector of postButtonSelectors) {
				try {
					const button = await this.page.$(selector);
					if (button) {
						// Check if button is enabled
						const isDisabled = await this.page.evaluate(
							(el) =>
								el.disabled ||
								el.getAttribute('aria-disabled') === 'true',
							button
						);

						if (!isDisabled) {
							await button.click();
							console.log('✅ Post button clicked');
							posted = true;
							break;
						}
					}
				} catch (e) {
					continue;
				}
			}

			if (!posted) {
				throw new Error('Could not find or click Post button');
			}

			// Wait for post to be published
			await delay(5000);

			console.log('✅ Post published successfully!');

			// Try to get the post URL (optional, might not always work)
			const postUrl = this.page.url();

			return {
				success: true,
				message: 'Post published successfully',
				url: postUrl,
			};
		} catch (error) {
			console.error('❌ Error creating post:', error.message);
			throw error;
		}
	}

	/**
	 * Close the browser
	 */
	async close() {
		try {
			if (this.browser) {
				await this.browser.close();
				console.log('✅ Browser closed');
			}
		} catch (error) {
			console.error('❌ Error closing browser:', error.message);
		}
	}

	/**
	 * Full workflow: Initialize, login, post, and close
	 */
	async publishPost(caption, imagePath = null) {
		try {
			await this.initialize();
			await this.login();
			const result = await this.createPost(caption, imagePath);
			await this.close();
			return result;
		} catch (error) {
			await this.close();
			throw error;
		}
	}
}

module.exports = LinkedInService;
