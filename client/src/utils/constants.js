/**
 * App-wide constants
 */

export const POST_STATUS = {
	DRAFT: 'draft',
	SCHEDULED: 'scheduled',
	PUBLISHING: 'publishing',
	PUBLISHED: 'published',
	FAILED: 'failed',
};

export const ROUTES = {
	DASHBOARD: '/',
	CREATE_POST: '/create',
	POSTS_LIST: '/posts',
	POST_DETAIL: '/posts/:id',
	TEMPLATES: '/templates',
};

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_IMAGE_TYPES = [
	'image/jpeg',
	'image/png',
	'image/jpg',
	'image/gif',
];
