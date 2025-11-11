# 🎨 Frontend Team - API Integration Guide

Hi Frontend Team! 👋

This guide shows you how to connect your UI pages to the backend APIs.

---

## 📦 What's Already Set Up For You

✅ API service layer (`src/services/`)
✅ Axios configured and installed
✅ Environment variables (`.env`)
✅ Error handling built-in

---

## 🔌 How to Use the APIs in Your Components

### **1. Import the Service**

At the top of your component file:

```javascript
import { postsService } from '../services/postsService';
import { templatesService } from '../services/templatesService';
```

---

### **2. Fetch Data (GET Requests)**

#### **Example: Display all posts**

```javascript
import { useState, useEffect } from 'react';
import { postsService } from '../services/postsService';

function PostsList() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				setLoading(true);
				const data = await postsService.getAllPosts();
				setPosts(data.posts); // Backend returns { success: true, posts: [...] }
				setError(null);
			} catch (err) {
				setError('Failed to load posts');
				console.error(err);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error}</div>;

	return (
		<div>
			<h1>All Posts</h1>
			{posts.map((post) => (
				<div key={post._id}>
					<p>{post.content}</p>
					<span>Status: {post.status}</span>
				</div>
			))}
		</div>
	);
}
```

#### **Example: Fetch templates for dropdown**

```javascript
const [templates, setTemplates] = useState([]);

useEffect(() => {
	const loadTemplates = async () => {
		try {
			const data = await templatesService.getAllTemplates();
			setTemplates(data.templates);
		} catch (error) {
			console.error('Error loading templates:', error);
		}
	};
	loadTemplates();
}, []);

// Use in JSX
<select>
	<option value=''>Select a template</option>
	{templates.map((template) => (
		<option
			key={template._id}
			value={template._id}>
			{template.name}
		</option>
	))}
</select>;
```

---

### **3. Create Data (POST Requests)**

#### **Example: Create a new post**

```javascript
import { useState } from 'react';
import { postsService } from '../services/postsService';

function CreatePostForm() {
	const [content, setContent] = useState('');
	const [status, setStatus] = useState('draft');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			setLoading(true);

			const postData = {
				content: content,
				status: status,
			};

			const result = await postsService.createPost(postData);

			alert('Post created successfully!');
			console.log('Created post:', result.post);

			// Clear form
			setContent('');
		} catch (error) {
			alert('Error creating post: ' + error.message);
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<textarea
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder='Write your post...'
				required
			/>

			<select
				value={status}
				onChange={(e) => setStatus(e.target.value)}>
				<option value='draft'>Save as Draft</option>
				<option value='scheduled'>Schedule</option>
			</select>

			<button
				type='submit'
				disabled={loading}>
				{loading ? 'Creating...' : 'Create Post'}
			</button>
		</form>
	);
}
```

---

### **4. Upload Images**

#### **Example: Image upload with preview**

```javascript
import { useState } from 'react';
import { postsService } from '../services/postsService';

function ImageUpload() {
	const [selectedImage, setSelectedImage] = useState(null);
	const [preview, setPreview] = useState(null);
	const [uploadedUrl, setUploadedUrl] = useState(null);
	const [uploading, setUploading] = useState(false);

	const handleFileSelect = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedImage(file);

			// Create preview
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreview(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleUpload = async () => {
		if (!selectedImage) {
			alert('Please select an image first');
			return;
		}

		try {
			setUploading(true);

			const result = await postsService.uploadImage(selectedImage);

			setUploadedUrl(result.imageUrl);
			alert('Image uploaded successfully!');

			console.log('Image URL:', result.imageUrl);
			// You can now save this URL with your post
		} catch (error) {
			alert('Upload failed: ' + error.message);
			console.error(error);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div>
			<input
				type='file'
				accept='image/*'
				onChange={handleFileSelect}
			/>

			{preview && (
				<div>
					<img
						src={preview}
						alt='Preview'
						style={{ maxWidth: '300px' }}
					/>
				</div>
			)}

			<button
				onClick={handleUpload}
				disabled={uploading || !selectedImage}>
				{uploading ? 'Uploading...' : 'Upload Image'}
			</button>

			{uploadedUrl && (
				<div>
					<p>Image uploaded!</p>
					<p>URL: {uploadedUrl}</p>
				</div>
			)}
		</div>
	);
}
```

---

### **5. Delete Data (DELETE Requests)**

#### **Example: Delete a post**

```javascript
const handleDelete = async (postId) => {
	if (!confirm('Are you sure you want to delete this post?')) {
		return;
	}

	try {
		await postsService.deletePost(postId);
		alert('Post deleted successfully!');

		// Refresh the posts list
		// Option 1: Re-fetch all posts
		// Option 2: Remove from state
		setPosts(posts.filter((post) => post._id !== postId));
	} catch (error) {
		alert('Error deleting post: ' + error.message);
		console.error(error);
	}
};

// In JSX
<button onClick={() => handleDelete(post._id)}>Delete</button>;
```

---

### **6. Update Data (PUT Requests)**

#### **Example: Edit a post**

```javascript
const handleUpdate = async (postId, updatedContent) => {
	try {
		const result = await postsService.updatePost(postId, {
			content: updatedContent,
		});

		alert('Post updated successfully!');
		console.log('Updated post:', result.post);
	} catch (error) {
		alert('Error updating post: ' + error.message);
		console.error(error);
	}
};
```

---

### **7. Publish a Post**

#### **Example: Publish post to LinkedIn**

```javascript
const handlePublish = async (postId) => {
	if (!confirm('Publish this post to LinkedIn now?')) {
		return;
	}

	try {
		const result = await postsService.publishPost(postId);
		alert('Post published successfully to LinkedIn!');
		console.log('Result:', result);
	} catch (error) {
		alert('Error publishing post: ' + error.message);
		console.error(error);
	}
};

// In JSX
<button onClick={() => handlePublish(post._id)}>Publish to LinkedIn</button>;
```

---

### **8. Filter Posts by Status**

```javascript
const [filter, setFilter] = useState('all');

const fetchFilteredPosts = async (status) => {
	try {
		let data;
		if (status === 'all') {
			data = await postsService.getAllPosts();
		} else {
			data = await postsService.getAllPosts({ status });
		}
		setPosts(data.posts);
	} catch (error) {
		console.error(error);
	}
};

// In JSX
<select
	value={filter}
	onChange={(e) => {
		setFilter(e.target.value);
		fetchFilteredPosts(e.target.value);
	}}>
	<option value='all'>All Posts</option>
	<option value='draft'>Drafts</option>
	<option value='scheduled'>Scheduled</option>
	<option value='published'>Published</option>
	<option value='failed'>Failed</option>
</select>;
```

---

### **9. Schedule a Post**

```javascript
const handleSchedule = async (content, scheduledDate) => {
	try {
		const result = await postsService.createPost({
			content: content,
			status: 'scheduled',
			scheduledDate: scheduledDate, // Format: "2024-11-11T14:30:00.000Z"
		});

		alert('Post scheduled successfully!');
		console.log('Scheduled post:', result.post);
	} catch (error) {
		alert('Error scheduling post: ' + error.message);
		console.error(error);
	}
};

// With date/time input
<input
	type='datetime-local'
	onChange={(e) => {
		// Convert to ISO string for backend
		const date = new Date(e.target.value).toISOString();
		setScheduledDate(date);
	}}
/>;
```

---

## 📝 Complete Form Example

Here's a complete form that creates a post with image and scheduling:

```javascript
import { useState, useEffect } from 'react';
import { postsService } from '../services/postsService';
import { templatesService } from '../services/templatesService';

function CompletePostForm() {
	const [content, setContent] = useState('');
	const [status, setStatus] = useState('draft');
	const [scheduledDate, setScheduledDate] = useState('');
	const [selectedImage, setSelectedImage] = useState(null);
	const [imagePreview, setImagePreview] = useState(null);
	const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
	const [templates, setTemplates] = useState([]);
	const [loading, setLoading] = useState(false);

	// Load templates on mount
	useEffect(() => {
		const loadTemplates = async () => {
			try {
				const data = await templatesService.getAllTemplates();
				setTemplates(data.templates);
			} catch (error) {
				console.error('Error loading templates:', error);
			}
		};
		loadTemplates();
	}, []);

	// Handle image selection
	const handleImageSelect = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedImage(file);
			const reader = new FileReader();
			reader.onloadend = () => setImagePreview(reader.result);
			reader.readAsDataURL(file);
		}
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// 1. Upload image if selected
			let imageUrl = null;
			if (selectedImage) {
				const uploadResult = await postsService.uploadImage(
					selectedImage
				);
				imageUrl = uploadResult.imageUrl;
				setUploadedImageUrl(imageUrl);
			}

			// 2. Create post
			const postData = {
				content,
				status,
				...(imageUrl && { imageUrl }),
				...(scheduledDate && {
					scheduledDate: new Date(scheduledDate).toISOString(),
				}),
			};

			const result = await postsService.createPost(postData);

			alert('Post created successfully!');
			console.log('Created post:', result.post);

			// Reset form
			setContent('');
			setSelectedImage(null);
			setImagePreview(null);
			setScheduledDate('');
		} catch (error) {
			alert('Error: ' + error.message);
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Create Post</h2>

			{/* Template selector */}
			<div>
				<label>Use Template (optional):</label>
				<select
					onChange={(e) => {
						const template = templates.find(
							(t) => t._id === e.target.value
						);
						if (template) setContent(template.content);
					}}>
					<option value=''>Select a template</option>
					{templates.map((template) => (
						<option
							key={template._id}
							value={template._id}>
							{template.name}
						</option>
					))}
				</select>
			</div>

			{/* Content textarea */}
			<div>
				<label>Content:</label>
				<textarea
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder='Write your post content...'
					rows='5'
					required
				/>
			</div>

			{/* Image upload */}
			<div>
				<label>Image (optional):</label>
				<input
					type='file'
					accept='image/*'
					onChange={handleImageSelect}
				/>
				{imagePreview && (
					<img
						src={imagePreview}
						alt='Preview'
						style={{ maxWidth: '200px' }}
					/>
				)}
			</div>

			{/* Status selector */}
			<div>
				<label>Status:</label>
				<select
					value={status}
					onChange={(e) => setStatus(e.target.value)}>
					<option value='draft'>Draft</option>
					<option value='scheduled'>Scheduled</option>
				</select>
			</div>

			{/* Schedule date (only if status is scheduled) */}
			{status === 'scheduled' && (
				<div>
					<label>Schedule for:</label>
					<input
						type='datetime-local'
						value={scheduledDate}
						onChange={(e) => setScheduledDate(e.target.value)}
						required
					/>
				</div>
			)}

			{/* Submit button */}
			<button
				type='submit'
				disabled={loading}>
				{loading ? 'Creating...' : 'Create Post'}
			</button>
		</form>
	);
}

export default CompletePostForm;
```

---

## 🎯 Common Patterns

### **Loading States**

```javascript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
	setLoading(true);
	try {
		// API call
	} finally {
		setLoading(false);
	}
};
```

### **Error Handling**

```javascript
const [error, setError] = useState(null);

try {
	// API call
	setError(null);
} catch (err) {
	setError(err.message);
}
```

### **Success Messages**

```javascript
const [success, setSuccess] = useState(null);

// After successful operation
setSuccess('Post created successfully!');
setTimeout(() => setSuccess(null), 3000); // Clear after 3 seconds
```

---

## 🛠️ Backend API Reference

### **Posts Endpoints**

-   `GET /api/posts` - Get all posts
-   `GET /api/posts?status=draft` - Filter by status
-   `GET /api/posts/:id` - Get single post
-   `POST /api/posts` - Create post
-   `PUT /api/posts/:id` - Update post
-   `DELETE /api/posts/:id` - Delete post
-   `POST /api/posts/:id/publish` - Publish to LinkedIn
-   `POST /api/posts/upload` - Upload image

### **Templates Endpoints**

-   `GET /api/templates` - Get all templates
-   `GET /api/templates/:id` - Get single template
-   `POST /api/templates` - Create template
-   `PUT /api/templates/:id` - Update template
-   `DELETE /api/templates/:id` - Delete template

---

## 🐛 Debugging Tips

1. **Check backend is running:**

    - Go to http://localhost:3000/api/health
    - Should see: `{"success":true,"message":"Server is running!"}`

2. **Check network tab:**

    - Open browser DevTools (F12)
    - Go to Network tab
    - See if requests are being made
    - Check status codes (200 = success, 500 = error)

3. **Check console:**

    - Look for errors in browser console
    - API errors are logged automatically

4. **CORS issues:**
    - If you see CORS errors, tell the backend developer
    - Backend needs to allow requests from http://localhost:5173

---

## 📞 Need Help?

Ask the backend developer if:

-   API isn't responding
-   Getting 500 errors
-   Need a new endpoint
-   Data format is confusing
-   CORS issues

---

**Happy coding! 🚀**
