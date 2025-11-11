# 🚀 Backend Setup Guide - Step by Step

This guide will help you set up the backend while your teammates work on the frontend UI.

---

## 📋 Prerequisites Checklist

-   [x] Node.js installed
-   [x] All backend dependencies installed (express, mongoose, etc.)
-   [x] Backend code structure in place
-   [x] `.env` file created

---

## 🎯 Step-by-Step Setup

### **STEP 1: Configure MongoDB** 🔴 DO THIS FIRST

You have two options:

#### **Option A: MongoDB Atlas (Recommended - Easiest)**

1. **Go to MongoDB Atlas:**

    - Visit: https://www.mongodb.com/cloud/atlas
    - Click "Try Free" or "Sign Up"

2. **Create Account:**

    - Sign up with Google/GitHub or email
    - Complete verification

3. **Create Cluster:**

    - Choose **FREE M0 tier**
    - Select region closest to you (e.g., AWS us-east-1)
    - Name: `marketing-automation-cluster`
    - Click "Create"

4. **Setup Database Access:**

    - Go to "Database Access" (left sidebar)
    - Click "Add New Database User"
    - Authentication Method: Password
    - Username: `marketing-admin`
    - Password: Generate secure password (save it!)
    - Database User Privileges: **Read and write to any database**
    - Click "Add User"

5. **Setup Network Access:**

    - Go to "Network Access" (left sidebar)
    - Click "Add IP Address"
    - Click "Allow Access from Anywhere" (0.0.0.0/0)
    - ⚠️ For production, restrict this!
    - Click "Confirm"

6. **Get Connection String:**

    - Go to "Database" (left sidebar)
    - Click "Connect" on your cluster
    - Choose "Connect your application"
    - Driver: Node.js, Version: 5.5 or later
    - Copy the connection string, looks like:
        ```
        mongodb+srv://marketing-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
        ```

7. **Update .env file:**

    ```bash
    cd server
    nano .env
    # or
    code .env
    ```

    Replace:

    ```env
    MONGODB_URI=mongodb+srv://marketing-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/marketing-automation?retryWrites=true&w=majority
    ```

    ⚠️ Replace `<password>` with your actual password!
    ⚠️ Add `/marketing-automation` before the `?` to specify database name

#### **Option B: Local MongoDB (If you prefer)**

1. **Install MongoDB:**

    ```bash
    # macOS
    brew tap mongodb/brew
    brew install mongodb-community

    # Start MongoDB
    brew services start mongodb-community
    ```

2. **Verify Installation:**

    ```bash
    mongo --version
    ```

3. **Keep default in .env:**
    ```env
    MONGODB_URI=mongodb://localhost:27017/marketing-automation
    ```

---

### **STEP 2: Create LinkedIn Test Account** 🔴 IMPORTANT

⚠️ **NEVER use your personal LinkedIn account for automation!**

1. **Create New Email:**

    - Gmail/Outlook/Yahoo
    - Example: `testmarketing2024@gmail.com`

2. **Create LinkedIn Account:**

    - Go to: https://www.linkedin.com/signup
    - Use the test email
    - Fill in dummy details:
        - Name: Test Marketing
        - Company: Test Company
        - Job Title: Marketing Manager
    - Complete profile (at least 50%)

3. **Update .env:**

    ```env
    LINKEDIN_EMAIL=testmarketing2024@gmail.com
    LINKEDIN_PASSWORD=YourTestPassword123!
    ```

4. **Test Login Manually:**
    - Try logging in on LinkedIn.com
    - Make sure no 2FA/MFA is enabled
    - If LinkedIn asks for verification, complete it

---

### **STEP 3: Create Uploads Directory** 🟡

```bash
cd server
mkdir uploads
```

This is where uploaded images will be stored.

---

### **STEP 4: Start Backend Server** 🔴 CRITICAL

```bash
cd server
npm run dev
```

**Expected Output:**

```
[nodemon] starting `node src/server.js`
2024-11-11T10:30:45.123Z - GET /
✅ MongoDB Connected to: marketing-automation
🚀 Server running on: http://localhost:3000
⏰ Scheduler started - checking every 5 minutes
```

**If you see errors:**

-   MongoDB connection error → Check MONGODB_URI in .env
-   Port already in use → Change PORT in .env to 3001
-   Module not found → Run `npm install` again

**Troubleshooting:**

-   Check TROUBLESHOOTING.md in server folder
-   Verify .env file has no extra spaces
-   Make sure MongoDB is running (if local)

---

### **STEP 5: Test API Endpoints** 🟡 HIGH PRIORITY

#### **Option A: Using Thunder Client (VS Code Extension)**

1. **Install Thunder Client:**

    - VS Code → Extensions
    - Search "Thunder Client"
    - Install by Ranga Vadhineni

2. **Test Endpoints:**

**Test 1: Health Check**

```
GET http://localhost:3000/api/health
```

Expected Response:

```json
{
	"success": true,
	"message": "Server is running!"
}
```

**Test 2: Create a Post**

```
POST http://localhost:3000/api/posts
Content-Type: application/json

{
  "eventName": "Even1",
  "caption": "Test"
}
```

Expected Response:

```json
{
	"success": true,
	"message": "Post created successfully",
	"post": {
		"_id": "...",
		"content": "This is my first test post! 🚀",
		"status": "draft",
		"createdAt": "..."
	}
}
```

**Test 3: Get All Posts**

```
GET http://localhost:3000/api/posts
```

**Test 4: Create a Template**

```
POST http://localhost:3000/api/templates
Content-Type: application/json

{
  "name": "Event Announcement",
  "content": "Join us for {EVENT_NAME} on {DATE} at {LOCATION}! 🎉"
}
```

**Test 5: Upload Image**

```
POST http://localhost:3000/api/posts/upload
Content-Type: multipart/form-data

Key: image
Value: [Select file from your computer]
```

#### **Option B: Using cURL (Terminal)**

```bash
# Health Check
curl http://localhost:3000/api/health

# Create Post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"content":"Test post","status":"draft"}'

# Get All Posts
curl http://localhost:3000/api/posts
```

#### **Option C: Using Postman**

1. Download Postman: https://www.postman.com/downloads/
2. Import collection from API_TESTING.md
3. Run tests

**✅ Success Criteria:**

-   Can create a post
-   Can fetch posts
-   Can create templates
-   Can upload an image

---

### **STEP 6: Test LinkedIn Automation** 🟡 HIGH PRIORITY

⚠️ **Do this carefully - LinkedIn may detect automation!**

#### **6.1: Configure for Testing**

Open `server/src/services/linkedin.js` and find this section:

```javascript
const browser = await puppeteer.launch({
	headless: true, // ← Change this to false
	args: ['--no-sandbox'],
});
```

**Change to:**

```javascript
const browser = await puppeteer.launch({
	headless: false, // See the browser
	slowMo: 50, // Slow down by 50ms
	args: ['--no-sandbox'],
});
```

This lets you **watch** what's happening!

#### **6.2: Test Manual Publish**

1. **Create a test post:**

    ```bash
    curl -X POST http://localhost:3000/api/posts \
      -H "Content-Type: application/json" \
      -d '{
        "content": "Testing automation - posted via API! 🤖",
        "status": "draft"
      }'
    ```

    **Copy the post ID from response!**

2. **Publish it:**

    ```bash
    curl -X POST http://localhost:3000/api/posts/POST_ID_HERE/publish
    ```

    Replace `POST_ID_HERE` with actual ID

3. **Watch the browser:**
    - Puppeteer will open a Chrome window
    - You'll see it navigate to LinkedIn
    - It will try to login
    - It will try to create a post

**Common Issues:**

-   **Login fails:** Check credentials in .env
-   **Captcha appears:** LinkedIn detected automation (use test account!)
-   **Post button not found:** LinkedIn UI changed, need to update selectors
-   **Browser crashes:** Increase memory or use headless: true

#### **6.3: If LinkedIn Blocks You**

-   Use a different test account
-   Wait 24 hours before retrying
-   Consider using LinkedIn API (official, paid)
-   For MVP, you can skip automation and post manually

---

### **STEP 7: Test Scheduler** 🟢 MEDIUM PRIORITY

The scheduler automatically publishes posts at their scheduled time.

#### **7.1: Verify Scheduler is Running**

When you start the server, you should see:

```
⏰ Scheduler started - checking every 5 minutes
```

#### **7.2: Create a Scheduled Post**

Create a post scheduled for **2 minutes from now**:

```bash
# Get current time + 2 minutes
date -u +"%Y-%m-%dT%H:%M:%S.000Z"

# Create scheduled post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This post is scheduled! ⏰",
    "status": "scheduled",
    "scheduledDate": "2024-11-11T14:35:00.000Z"
  }'
```

**Replace the date with your calculated time!**

#### **7.3: For Faster Testing**

Update `.env` to check every minute:

```env
SCHEDULER_INTERVAL=* * * * *
```

Restart server:

```bash
# Stop with Ctrl+C
npm run dev
```

#### **7.4: Watch Logs**

You should see:

```
⏰ Checking for scheduled posts...
Found 1 post(s) ready to publish
Publishing post: ...
✅ Post published successfully
```

**✅ Success Criteria:**

-   Scheduler runs at specified interval
-   Finds scheduled posts
-   Publishes them at correct time
-   Updates post status to "published"

---

### **STEP 8: Create Frontend API Service** 🔴 CRITICAL FOR INTEGRATION

This is the bridge between React (frontend) and Express (backend).

**I'll create this file for you:**

```bash
cd ../client
mkdir -p src/services
```

Create `client/src/services/api.js`:

```javascript
import axios from 'axios';

// Base API URL from environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance with defaults
const api = axios.create({
	baseURL: API_URL,
	headers: {
		'Content-Type': 'application/json',
	},
	timeout: 10000, // 10 seconds
});

// Request interceptor (for future auth tokens)
api.interceptors.request.use(
	(config) => {
		// Add auth token here if needed
		// const token = localStorage.getItem('token');
		// if (token) {
		//   config.headers.Authorization = `Bearer ${token}`;
		// }
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Response interceptor (for error handling)
api.interceptors.response.use(
	(response) => {
		return response.data;
	},
	(error) => {
		// Handle errors globally
		const message =
			error.response?.data?.message ||
			error.message ||
			'Something went wrong';
		console.error('API Error:', message);
		return Promise.reject(error);
	}
);

export default api;
```

Create `client/src/services/postsService.js`:

```javascript
import api from './api';

export const postsService = {
	// Get all posts
	getAllPosts: async (filters = {}) => {
		const params = new URLSearchParams(filters);
		return api.get(`/posts?${params}`);
	},

	// Get single post
	getPost: async (id) => {
		return api.get(`/posts/${id}`);
	},

	// Create new post
	createPost: async (postData) => {
		return api.post('/posts', postData);
	},

	// Update post
	updatePost: async (id, postData) => {
		return api.put(`/posts/${id}`, postData);
	},

	// Delete post
	deletePost: async (id) => {
		return api.delete(`/posts/${id}`);
	},

	// Publish post
	publishPost: async (id) => {
		return api.post(`/posts/${id}/publish`);
	},

	// Upload image
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
```

Create `client/src/services/templatesService.js`:

```javascript
import api from './api';

export const templatesService = {
	// Get all templates
	getAllTemplates: async () => {
		return api.get('/templates');
	},

	// Get single template
	getTemplate: async (id) => {
		return api.get(`/templates/${id}`);
	},

	// Create template
	createTemplate: async (templateData) => {
		return api.post('/templates', templateData);
	},

	// Update template
	updateTemplate: async (id, templateData) => {
		return api.put(`/templates/${id}`, templateData);
	},

	// Delete template
	deleteTemplate: async (id) => {
		return api.delete(`/templates/${id}`);
	},
};
```

---

### **STEP 9: Configure CORS for Frontend** 🔴 CRITICAL

Your React dev server runs on `http://localhost:5173` but backend is on `http://localhost:3000`.

You need to allow cross-origin requests.

**Already configured in your `server/src/server.js`:**

```javascript
app.use(cors());
```

This allows ALL origins. For production, you'd restrict it:

```javascript
app.use(
	cors({
		origin: 'http://localhost:5173', // React dev server
		credentials: true,
	})
);
```

**Test CORS:**

In your React app, try:

```javascript
import { postsService } from './services/postsService';

// In a component
const fetchPosts = async () => {
	try {
		const data = await postsService.getAllPosts();
		console.log('Posts:', data);
	} catch (error) {
		console.error('Error:', error);
	}
};
```

---

## ✅ Backend Setup Complete Checklist

-   [ ] MongoDB connected (Atlas or local)
-   [ ] LinkedIn test account created and credentials in .env
-   [ ] Uploads folder created
-   [ ] Server starts without errors
-   [ ] Can create posts via API
-   [ ] Can fetch posts via API
-   [ ] Can upload images via API
-   [ ] Templates API working
-   [ ] LinkedIn automation tested (at least once)
-   [ ] Scheduler tested with a scheduled post
-   [ ] Frontend API service files created
-   [ ] CORS configured

---

## 🔗 Integration with Frontend (When UI is Ready)

When your teammates finish the UI pages, you'll need to:

1. **Import the services:**

    ```javascript
    import { postsService } from '../services/postsService';
    import { templatesService } from '../services/templatesService';
    ```

2. **Use in components:**

    ```javascript
    const handleSubmit = async (formData) => {
    	try {
    		const result = await postsService.createPost(formData);
    		console.log('Success:', result);
    		// Show success message
    	} catch (error) {
    		console.error('Error:', error);
    		// Show error message
    	}
    };
    ```

3. **For image upload:**
    ```javascript
    const handleImageUpload = async (file) => {
    	try {
    		const result = await postsService.uploadImage(file);
    		console.log('Image URL:', result.imageUrl);
    		return result.imageUrl;
    	} catch (error) {
    		console.error('Upload failed:', error);
    	}
    };
    ```

---

## 🆘 Troubleshooting

### MongoDB Connection Fails

-   Check internet connection (for Atlas)
-   Verify connection string has correct password
-   Check IP whitelist in Atlas (should be 0.0.0.0/0)
-   Try local MongoDB instead

### LinkedIn Automation Fails

-   Verify credentials are correct
-   Try logging in manually first
-   Disable 2FA on test account
-   Use headless: false to watch what's happening
-   Check LinkedIn selector in code (UI might have changed)

### CORS Errors in Frontend

-   Verify backend is running
-   Check CORS is enabled in server.js
-   Try adding explicit origin in CORS config

### Port Already in Use

```bash
# Find what's using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change port in .env
PORT=3001
```

---

## 📚 Next Steps

Once backend is set up:

1. **Seed some templates:**

    ```bash
    cd server
    node scripts/seedTemplates.js
    ```

2. **Create sample posts** via API for testing

3. **Wait for frontend UI** from teammates

4. **Integrate** by connecting UI forms to your API services

5. **Test end-to-end** flow:
    - Create post from UI
    - Upload image from UI
    - Schedule post from UI
    - Watch it publish automatically

---

## 🎯 Your Role Going Forward

While teammates build UI:

-   ✅ Keep backend running
-   ✅ Test all API endpoints
-   ✅ Fix any bugs in backend
-   ✅ Monitor scheduler logs
-   ✅ Be ready to help with API integration

When UI is ready:

-   ✅ Help teammates use the API services
-   ✅ Debug integration issues
-   ✅ Add any missing API endpoints
-   ✅ Optimize performance

---

**You're all set! Start with STEP 1 (MongoDB) and work through each step.**

Need help? Check TROUBLESHOOTING.md or ask me! 🚀
