# 🚀 QUICK START - Backend Setup

## 📋 Your Checklist (Follow in Order)

### ✅ STEP 1: MongoDB Setup (15 mins)

**Choose ONE option:**

**Option A - MongoDB Atlas (Easier, Recommended):**

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up (free tier)
3. Create cluster (M0 Free)
4. Add database user
5. Allow IP access (0.0.0.0/0)
6. Get connection string
7. Update in `server/.env`:
    ```
    MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/marketing-automation
    ```

**Option B - Local MongoDB:**

```bash
brew install mongodb-community
brew services start mongodb-community
# Keep default in .env: mongodb://localhost:27017/marketing-automation
```

---

### ✅ STEP 2: LinkedIn Test Account (10 mins)

1. Create new email: testmarketing2024@gmail.com
2. Create LinkedIn account with that email
3. Fill profile (at least 50%)
4. Disable 2FA
5. Update in `server/.env`:
    ```
    LINKEDIN_EMAIL=testmarketing2024@gmail.com
    LINKEDIN_PASSWORD=yourpassword123
    ```

---

### ✅ STEP 3: Create Uploads Folder (1 min)

```bash
cd server
mkdir uploads
```

---

### ✅ STEP 4: Start Backend Server (2 mins)

```bash
cd server
npm run dev
```

**Expected output:**

```
✅ MongoDB Connected
🚀 Server running on: http://localhost:3000
⏰ Scheduler started
```

**If errors:** Check `server/.env` file formatting

---

### ✅ STEP 5: Test API (10 mins)

**Install Thunder Client:**

-   VS Code → Extensions → Search "Thunder Client" → Install

**Test these:**

1. **Health Check:**

    ```
    GET http://localhost:3000/api/health
    ```

2. **Create Post:**

    ```
    POST http://localhost:3000/api/posts
    Content-Type: application/json

    {
      "content": "Test post!",
      "status": "draft"
    }
    ```

3. **Get Posts:**
    ```
    GET http://localhost:3000/api/posts
    ```

✅ All 3 should return 200 OK

---

### ✅ STEP 6: Test LinkedIn (15 mins)

**Important:** Set headless to false first!

Edit `server/src/services/linkedin.js` line ~20:

```javascript
const browser = await puppeteer.launch({
	headless: false, // Change true to false
	slowMo: 50,
	args: ['--no-sandbox'],
});
```

**Create and publish a test post:**

```bash
# 1. Create post (save the ID from response)
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"content":"Test automation 🤖","status":"draft"}'

# 2. Publish it (replace POST_ID with actual ID)
curl -X POST http://localhost:3000/api/posts/POST_ID/publish
```

Watch browser window open and post!

---

### ✅ STEP 7: Test Scheduler (10 mins)

**Create scheduled post (2 mins in future):**

```bash
# Get current time + 2 minutes (use online tool or:)
date -u -v+2M +"%Y-%m-%dT%H:%M:%S.000Z"

# Create scheduled post
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "content":"Scheduled test ⏰",
    "status":"scheduled",
    "scheduledDate":"2024-11-11T14:35:00.000Z"
  }'
```

Wait and watch logs. Should publish automatically!

---

## 🎉 Done! Now What?

### While teammates build UI:

**Monitor server:**

```bash
cd server
npm run dev
# Keep this running
```

**Seed templates (optional):**

```bash
cd server
node scripts/seedTemplates.js
```

**Read documentation:**

-   `server/BACKEND_SETUP_GUIDE.md` (detailed version)
-   `server/API_TESTING.md`
-   `server/TROUBLESHOOTING.md`

---

## 🔗 When Frontend UI is Ready

Your teammates will use these service files:

-   `client/src/services/api.js`
-   `client/src/services/postsService.js`
-   `client/src/services/templatesService.js`

They have a guide: `client/FRONTEND_API_GUIDE.md`

**Example they'll use:**

```javascript
import { postsService } from '../services/postsService';

const createPost = async () => {
	const result = await postsService.createPost({
		content: 'From React UI!',
		status: 'draft',
	});
	console.log(result);
};
```

---

## 🆘 Common Issues

### MongoDB won't connect

-   Check `.env` has correct connection string
-   No extra spaces in `.env`
-   Password is URL-encoded
-   IP whitelist includes 0.0.0.0/0

### Port 3000 already in use

```bash
lsof -i :3000
kill -9 <PID>
# Or change PORT=3001 in .env
```

### LinkedIn fails

-   Use headless: false to see what's happening
-   Check credentials in `.env`
-   Disable 2FA on test account
-   Try logging in manually first

### Can't upload images

```bash
# Make sure uploads folder exists
cd server
mkdir uploads
```

---

## 📊 API Endpoints Reference

### Posts

-   `GET /api/posts` - All posts
-   `POST /api/posts` - Create
-   `PUT /api/posts/:id` - Update
-   `DELETE /api/posts/:id` - Delete
-   `POST /api/posts/:id/publish` - Publish
-   `POST /api/posts/upload` - Upload image

### Templates

-   `GET /api/templates` - All templates
-   `POST /api/templates` - Create
-   `PUT /api/templates/:id` - Update
-   `DELETE /api/templates/:id` - Delete

---

## 📞 Files Created For You

✅ `server/.env` - Your configuration
✅ `server/BACKEND_SETUP_GUIDE.md` - Detailed guide
✅ `client/.env` - Frontend config
✅ `client/src/services/api.js` - API setup
✅ `client/src/services/postsService.js` - Posts API
✅ `client/src/services/templatesService.js` - Templates API
✅ `client/FRONTEND_API_GUIDE.md` - Guide for teammates

---

## ⏱️ Time Estimate

-   MongoDB setup: 15 mins
-   LinkedIn account: 10 mins
-   Server test: 5 mins
-   API test: 10 mins
-   LinkedIn test: 15 mins
-   Scheduler test: 10 mins
    **Total: ~1 hour**

---

## 🎯 Success Checklist

-   [ ] Server runs without errors
-   [ ] MongoDB connected
-   [ ] Can create posts via API
-   [ ] Can fetch posts via API
-   [ ] LinkedIn test account working
-   [ ] At least one post published to LinkedIn
-   [ ] Scheduled post worked
-   [ ] Uploads folder created
-   [ ] Frontend can call APIs (test after UI done)

---

**Ready? Start with STEP 1! 🚀**

Full details in: `server/BACKEND_SETUP_GUIDE.md`
