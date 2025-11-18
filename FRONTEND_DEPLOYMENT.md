# Frontend Deployment to Vercel

## Step 1: Deploy Frontend to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy from the root directory** (where your React app is):
   ```bash
   cd /Users/sareena/HeartSmiles/heart-smiles-tracker
   vercel
   ```

3. **Follow the prompts**:
   - Set up and deploy? **Yes**
   - Which scope? (select your account)
   - Link to existing project? **No** (for first deployment)
   - Project name: `heart-smiles-frontend` (or your preferred name)
   - Directory: `./` (current directory)
   - Override settings? **No**
   - Build command: `npm run build` (or leave default)
   - Output directory: `build` (for Create React App)

4. **After deployment**, Vercel will show you a URL like:
   ```
   ✅ Production: https://heart-smiles-frontend.vercel.app
   ```

## Step 2: Get Your Frontend URL

After deployment, you can find your frontend URL in several ways:

### Option A: From Terminal Output
After running `vercel`, it will display:
```
🔗  Production: https://your-frontend-app.vercel.app [copied to clipboard]
```

### Option B: From Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Click on your project (`heart-smiles-frontend`)
3. You'll see the deployment URL at the top of the page
4. It will look like: `https://heart-smiles-frontend.vercel.app`

### Option C: Check Recent Deployments
1. In Vercel dashboard, go to your project
2. Click on "Deployments" tab
3. Click on the latest deployment
4. The URL is shown at the top

## Step 3: Update Backend CORS Configuration

Once you have your frontend URL, you have two options:

### Option 1: Set Environment Variable (Recommended)
1. Go to your **backend** Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add a new variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://your-frontend-app.vercel.app` (your actual frontend URL)
   - **Environment**: Production, Preview, Development (select all)

The backend CORS configuration will automatically pick this up!

### Option 2: Hardcode in server.js (Not Recommended)
You can also add it directly to the `allowedOrigins` array in `backend/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3002',
  'http://localhost:3003',
  'https://your-frontend-app.vercel.app', // Add your frontend URL here
  process.env.FRONTEND_URL,
  // ...
].filter(Boolean);
```

## Step 4: Update Frontend API Configuration

After deploying the backend, update your frontend to use the backend URL:

1. In your frontend Vercel project, go to **Settings → Environment Variables**
2. Add:
   - **Key**: `REACT_APP_API_BASE_URL`
   - **Value**: `https://your-backend-app.vercel.app/api` (your backend URL)
   - **Environment**: Production, Preview, Development

3. **Redeploy** the frontend for the changes to take effect

## Quick Reference

- **Frontend URL**: `https://heart-smiles-frontend.vercel.app` (example)
- **Backend URL**: `https://heart-smiles-backend.vercel.app` (example)
- **Backend CORS**: Set `FRONTEND_URL` environment variable in backend project
- **Frontend API**: Set `REACT_APP_API_BASE_URL` environment variable in frontend project

## Note

Vercel also provides preview URLs for each deployment (like `https://heart-smiles-frontend-git-main-yourname.vercel.app`). If you want to allow these too, you can add a wildcard pattern or add them individually to the CORS configuration.

