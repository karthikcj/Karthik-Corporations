# Vercel Deployment Guide

This guide explains how to deploy this website to Vercel.

## Prerequisites

1. **MongoDB Atlas Account**: Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Vercel Account**: Create a free account at [Vercel](https://vercel.com)

## Setup Steps

### 1. MongoDB Atlas Setup

1. Create a new cluster in MongoDB Atlas
2. Create a database user (save the username and password)
3. Whitelist IP addresses (or use 0.0.0.0/0 for development)
4. Get your connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/brandDB?retryWrites=true&w=majority`)

### 2. Environment Variables

Set the following environment variable in Vercel:

- `MONGODB_URI`: Your MongoDB Atlas connection string

To set environment variables in Vercel:
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add `MONGODB_URI` with your MongoDB Atlas connection string
4. Apply to all environments (Production, Preview, Development)

### 3. Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to project directory
cd brand-template

# Deploy
vercel

# Follow the prompts to complete deployment
```

#### Option B: Using GitHub Integration

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure:
   - Framework Preset: "Other"
   - Root Directory: `brand-template`
   - Environment Variables: Add `MONGODB_URI`
6. Click "Deploy"

### 4. Default Admin Credentials

After deployment, the default admin account is automatically created:

- **Username**: `admin`
- **Password**: `adminsData`

**Important**: Change this password after first login in production!

### 5. Testing the Deployment

1. Visit your Vercel deployment URL
2. Test user registration at `/users.html`
3. Test admin login at `/admin.html` with default credentials
4. Verify API endpoints are working:
   - `/api/products` - Should return products
   - `/api/users` - User management
   - `/api/admin` - Admin authentication

## API Endpoints

The following serverless functions are available:

- `GET /api/products` - Get all products
- `POST /api/products` - Create a product
- `PUT /api/products?id=<id>` - Update a product
- `DELETE /api/products?id=<id>` - Delete a product
- `POST /api/admin` - Admin login (username: admin, password: adminsData)
- `POST /api/users` - User registration/login
- `GET /api/users?username=<username>` - Get user profile
- `GET /api/users?all=true` - Get all users (admin only)
- `PUT /api/users` - Update user profile
- `DELETE /api/users?username=<username>` - Delete user (admin only)
- `POST /api/demo-request` - Submit demo request
- `GET /api/demo-request` - Get all demo requests

## Troubleshooting

### MongoDB Connection Issues

- Verify your `MONGODB_URI` environment variable is set correctly
- Check that your IP is whitelisted in MongoDB Atlas (or use 0.0.0.0/0)
- Verify database user credentials are correct

### Function Errors

- Check Vercel function logs in the dashboard
- Verify all dependencies are in `package.json`
- Ensure Node.js version is compatible (using 18.x)

### Build Issues

- Ensure all required files are in the repository
- Check that `vercel.json` is properly configured
- Verify file paths are correct (especially API routes)

## Local Development

To test serverless functions locally:

```bash
# Install Vercel CLI
npm install -g vercel

# Run local development server
vercel dev

# Set environment variable locally
# Create .env.local file with:
# MONGODB_URI=your_mongodb_connection_string
```

## Notes

- The serverless functions use MongoDB Atlas for data persistence
- User sessions are managed via localStorage (client-side)
- For production, consider implementing server-side session management
- Default admin account is created automatically on first API call

