# TrueAssets - Quick Start Guide

## 📋 Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Firebase account
- Razorpay account (for payments)

---

## 🚀 Project Setup

### Step 1: Clone/Setup Project
```bash
cd d:\RITIK\trueassets-web
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create Firebase Project
1. Go to [firebase.google.com](https://firebase.google.com)
2. Click "Create a new project"
3. Fill in project details
4. Skip Google Analytics (optional)
5. Click "Create project"

### Step 4: Setup Firebase Services

#### Enable Authentication
1. In Firebase Console, go to **Authentication**
2. Click **Get started**
3. Enable **Email/Password**
4. (Optional) Enable **Google**

#### Create Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Select **Start in test mode** (for development)
4. Choose **Location** (recommended: nearest to you)
5. Click **Create**

#### Setup Storage
1. Go to **Storage**
2. Click **Get started**
3. Choose **Start in test mode**
4. Click **Create**

### Step 5: Get Firebase Credentials
1. Go to **Project Settings** (gear icon)
2. Copy these values:
   - `apiKey` → `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `authDomain` → `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `projectId` → `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `storageBucket` → `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `messagingSenderId` → `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `appId` → `NEXT_PUBLIC_FIREBASE_APP_ID`

### Step 6: Create .env.local
Create a new file `.env.local` in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_here  # Optional, needed for payments
```

### Step 7: Setup Firestore Security Rules
1. In Firebase Console, go to **Firestore Database**
2. Click on **Rules** tab
3. Replace with these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if request.auth.token.admin == true;
    }
    
    match /properties/{docId} {
      allow read: if resource.data.status == 'approved';
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerId;
      allow update, delete: if request.auth.uid == resource.data.ownerId || request.auth.token.admin == true;
      allow list: if request.auth.token.admin == true;
    }
    
    match /enquiries/{docId} {
      allow create: if true;
      allow read: if request.auth != null && (request.auth.uid == resource.data.ownerId || request.auth.token.admin == true);
      allow update: if request.auth.token.admin == true;
    }
    
    match /subscriptions/{docId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

4. Click **Publish**

### Step 8: Setup Firebase Storage Rules
1. Go to **Storage** > **Rules** tab
2. Replace with:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /properties/{userId}/{propertyId}/images/{imageId} {
      allow read: if true;
      allow write, delete: if request.auth.uid == userId;
    }
    
    match /properties/{userId}/{propertyId}/videos/{videoId} {
      allow read: if true;
      allow write, delete: if request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

---

## 🏃 Running the Application

```bash
# Start development server
npm run dev

# Open in browser
http://localhost:3000

# If port 3000 is busy, it will use 3002
http://localhost:3002
```

---

## 🧪 Testing the Platform

### 1. Create Test User
1. Go to `http://localhost:3000/auth/signup`
2. Fill in details:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Role: Property Owner
   - Password: Test@123
3. Click "Create Account"

### 2. Add a Property
1. Go to `http://localhost:3000/property/add` (should redirect to login if not signed in)
2. Fill in property details:
   - Title: "Beautiful 2BHK Apartment"
   - Price: 5000000
   - City: "Mumbai"
   - Property Type: "For Sale"
   - Asset Type: "2BHK"
   - Etc.
3. Upload images (JPG/PNG, max 500KB)
4. Click "List Property"
5. Property will appear as "pending" until admin approves

### 3. View Properties
1. Go to `http://localhost:3000/listings`
2. See all approved properties

### 4. Submit Enquiry
1. Click on any property
2. Click "Submit Enquiry" or go to `/property/enquiry/[propertyId]`
3. Fill in your details and submit

### 5. View Dashboard
1. Go to `http://localhost:3000/dashboard` (after login)
2. See all your listings with status

---

## 📁 Project Structure

```
trueassets-web/
├── app/                 # Next.js pages
├── components/          # React components
├── lib/                 # Utility functions
│   ├── firebase.js      # Firebase config
│   ├── AuthContext.jsx  # Auth management
│   ├── propertyUtils.js # Property CRUD
│   ├── enquiryUtils.js  # Enquiry management
│   ├── storageUtils.js  # Media upload
│   └── subscriptionUtils.js # Subscription logic
├── hooks/               # Custom React hooks
├── public/              # Static assets
├── .env.local           # Environment variables
├── package.json         # Dependencies
└── IMPLEMENTATION.md    # Full documentation
```

---

## 🔑 Important Files to Know

| File | Purpose |
|------|---------|
| `app/layout.js` | Root layout with AuthProvider |
| `lib/firebase.js` | Firebase initialization |
| `lib/AuthContext.jsx` | Global authentication state |
| `lib/propertyUtils.js` | All property operations |
| `app/auth/signup/page.jsx` | User registration |
| `app/dashboard/page.jsx` | User's property dashboard |
| `app/property/add/page.jsx` | Add/edit property page |

---

## 🎯 User Flows

### Property Owner Flow
```
1. Signup → 2. Login → 3. Add Property
4. View Dashboard → 5. Receive Enquiries → 6. View Enquiry Details
```

### Visitor Flow
```
1. Browse Home → 2. Search Listings → 3. View Property Details
4. Submit Enquiry
```

### Admin Flow (To be implemented)
```
1. Admin Login → 2. View Pending Properties
3. Approve/Reject → 4. Monitor Enquiries
5. View Analytics
```

---

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm start            # Start production server

# Utilities
npm run lint         # Run linter (if configured)
npm audit            # Check vulnerabilities
npm audit fix        # Fix vulnerabilities
```

---

## 🌐 Deployment to Vercel

### 1. Connect Repository
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### 2. Setup Environment Variables in Vercel
1. Go to Vercel project settings
2. Go to **Environment Variables**
3. Add all variables from `.env.local`
4. Redeploy project

### 3. Verify Deployment
- Visit your Vercel URL
- Test authentication
- Test property listing

---

## 📞 Testing User Accounts

After signup, test accounts are available in Firebase Console:
1. Go to Firebase Console
2. Authentication > Users
3. You'll see created users

To manually create a test user in Firebase:
1. Go to Authentication
2. Click "Add user"
3. Enter email and password
4. Click "Create user"

---

## 🐛 Debugging

### Chrome DevTools
- F12 to open DevTools
- Console tab for error messages
- Network tab for API calls
- Application tab for local storage

### Firebase Console
- Check Firestore data in **Database**
- Check storage files in **Storage**
- Check logs in **Logs**

### Common Issues

**Issue**: "Port 3000 is in use"
```bash
# Kill process using port 3000
netstat -ano | findstr :3000    # Windows
taskkill /PID <PID> /F          # Kill process
```

**Issue**: Firebase connection errors
- Check `.env.local` has correct credentials
- Verify Firebase project is active
- Check internet connection

**Issue**: Media upload fails
- Check file size (image < 500KB, video < 50MB)
- Check Firebase Storage rules
- Check browser console for errors

---

## 📚 Additional Resources

- **Next.js**: https://nextjs.org/docs
- **Firebase**: https://firebase.google.com/docs
- **React**: https://react.dev
- **Razorpay**: https://razorpay.com/docs

---

## ✅ Getting Help

1. Check `IMPLEMENTATION.md` for detailed docs
2. Check `CHECKLIST.md` for feature status
3. Check Firebase Console for data issues
4. Check browser DevTools for frontend errors

---

## 🎉 You're Ready!

Your TrueAssets platform is now set up and ready for development.

**Next Steps:**
1. Run `npm run dev`
2. Test user signup and property listing
3. Review `IMPLEMENTATION.md` for backend setup
4. Start building additional features

Happy coding! 🚀
