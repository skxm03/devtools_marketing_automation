import api from './api';

/**
 * Posts Service
 * Handles all API calls related to posts
 */
export const postsService = {
	/**
	 * Get all posts
	 * @param {Object} filters - Optional filters (status, etc.)
	 * @returns {Promise} Array of posts
	 */
	getAllPosts: async (filters = {}) => {
		const params = new URLSearchParams(filters);
		return api.get(`/posts?${params}`);
	},

	/**
	 * Get single post by ID
	 * @param {string} id - Post ID
	 * @returns {Promise} Post object
	 */
	getPost: async (id) => {
		return api.get(`/posts/${id}`);
	},

	/**
	 * Create new post
	 * @param {Object} postData - Post data (content, status, scheduledDate, etc.)
	 * @returns {Promise} Created post
	 */
	createPost: async (postData) => {
		return api.post('/posts', postData);
	},

	/**
	 * Update existing post
	 * @param {string} id - Post ID
	 * @param {Object} postData - Updated post data
	 * @returns {Promise} Updated post
	 */
	updatePost: async (id, postData) => {
		return api.put(`/posts/${id}`, postData);
	},

	/**
	 * Delete post
	 * @param {string} id - Post ID
	 * @returns {Promise} Deletion confirmation
	 */
	deletePost: async (id) => {
		return api.delete(`/posts/${id}`);
	},

	/**
	 * Publish post to LinkedIn
	 * @param {string} id - Post ID
	 * @returns {Promise} Published post
	 */
	publishPost: async (id) => {
		return api.post(`/posts/${id}/publish`);
	},

	/**
	 * Upload image for post
	 * @param {File} file - Image file
	 * @returns {Promise} Upload result with imageUrl
	 */
	uploadImage: async (file) => {
		const formData = new FormData();
		formData.append('image', file);

		return api.post('/posts/upload', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});
	},
};

/**
 * Example usage in React component:
 *
 * import { postsService } from '../services/postsService';
 *
 * const MyComponent = () => {
 *   const handleCreatePost = async () => {
 *     try {
 *       const result = await postsService.createPost({
 *         content: "My post content",
 *         status: "draft"
 *       });
 *       console.log('Post created:', result);
 *     } catch (error) {
 *       console.error('Error:', error);
 *     }
 *   };
 * };
 */
