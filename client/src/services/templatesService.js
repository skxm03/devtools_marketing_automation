import api from './api';

/**
 * Templates Service
 * Handles all API calls related to post templates
 */
export const templatesService = {
	/**
	 * Get all templates
	 * @returns {Promise} Array of templates
	 */
	getAllTemplates: async () => {
		return api.get('/templates');
	},

	/**
	 * Get single template by ID
	 * @param {string} id - Template ID
	 * @returns {Promise} Template object
	 */
	getTemplate: async (id) => {
		return api.get(`/templates/${id}`);
	},

	/**
	 * Create new template
	 * @param {Object} templateData - Template data (name, content, variables)
	 * @returns {Promise} Created template
	 */
	createTemplate: async (templateData) => {
		return api.post('/templates', templateData);
	},

	/**
	 * Update existing template
	 * @param {string} id - Template ID
	 * @param {Object} templateData - Updated template data
	 * @returns {Promise} Updated template
	 */
	updateTemplate: async (id, templateData) => {
		return api.put(`/templates/${id}`, templateData);
	},

	/**
	 * Delete template
	 * @param {string} id - Template ID
	 * @returns {Promise} Deletion confirmation
	 */
	deleteTemplate: async (id) => {
		return api.delete(`/templates/${id}`);
	},
};

/**
 * Example usage in React component:
 *
 * import { templatesService } from '../services/templatesService';
 *
 * const TemplatesPage = () => {
 *   const [templates, setTemplates] = useState([]);
 *
 *   useEffect(() => {
 *     const fetchTemplates = async () => {
 *       try {
 *         const data = await templatesService.getAllTemplates();
 *         setTemplates(data.templates);
 *       } catch (error) {
 *         console.error('Error fetching templates:', error);
 *       }
 *     };
 *     fetchTemplates();
 *   }, []);
 * };
 */
