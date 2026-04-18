# Firebase Free Tier Setup Guide

## ✅ STEP-BY-STEP FIREBASE SETUP (5-10 minutes)

### Step 1: Create Firebase Project
1. Go to: **https://console.firebase.google.com**
2. Click "Create a project"
3. Project name: **"TrueAssets"** (or your choice)
4. Accept terms
5. Click "Create project"
6. Wait for setup Complete... (takes ~1 minute)

### Step 2: Enable Firestore Database
1. Left sidebar → Click **"Firestore Database"**
2. Click **"Create Database"**
3. Location: Choose **nearest to you** (e.g., asia-southeast1 for India)
4. Security rules: Select **"Start in test mode"** (we'll add security rules later)
5. Click **"Enable"**
6. Wait for creation (2-3 minutes)

### Step 3: Enable Firebase Authentication
1. Left sidebar → Click **"Authentication"**
2. Click **"Get started"**
3. Under "Sign-in providers" → Click **"Email/Password"**
4. Enable **"Email/Password"**
5. Click **"Save"**

### Step 4: Create Firebase Storage
1. Left sidebar → Click **"Storage"**
2. Click **"Get started"**
3. Storage location: Same as Firestore
4. Security rules: Start with **test rules** (we'll update)
5. Click **"Done"**

### Step 5: Get Your API Keys
1. Left sidebar → Click **"Project settings"** (gear icon at top)
2. Click **"Your apps"** tab
3. Under "Apps", look for **Web app** section
4. If none exists, click **"Add app"** → Select **"Web"**
5. App nickname: **"trueassets-web"**
6. Check "Also set up Firebase Hosting for this app" (optional)
7. Click **"Register app"**
8. Copy the configuration object:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

---

## 🔐 FIRESTORE TEST MODE SECURITY RULES

After setting up Firestore, add these test rules:

1. Go to **Firestore Database**
2. Click **"Rules"** tab
3. Replace all content with this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow all reads and writes for now (TEST MODE)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Click **"Publish"**

⚠️ **Note:** This is for testing only. Before going live, we'll add proper security rules.

---

## 📝 ADD CREDENTIALS TO .env.local

Once you have all credentials, add to your `.env.local` file:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Razorpay Configuration (already added)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_SSGoPuqGcCom1N
NEXT_PUBLIC_RAZORPAY_MERCHANT_ID=SSFrfb6m7bby3X
```

---

## ✅ VERIFY SETUP

After adding credentials, test with this:

1. Go to http://localhost:3002
2. Click "Sign up"
3. Try to create account
4. If it works → Firebase is connected! ✅

---

## 🎯 WHAT'S FREE TIER LIMIT

```
Database (Firestore):
✅ 1 GB storage (enough for ~100k properties)
✅ 50K reads/day
✅ 20K writes/day
✅ 20K deletes/day

Authentication:
✅ Unlimited user creation
✅ All methods free

Storage:
✅ 5 GB per month
✅ 1 GB per day for downloads
```

**For your use case:** This is more than enough for testing & launch!

---

## 🚀 ONCE YOU PROVIDE CREDENTIALS

I'll immediately:
1. ✅ Add credentials to .env.local
2. ✅ Test Firebase connection
3. ✅ Start building OWNER signup/signin
4. ✅ Build owner dashboard
5. ✅ Build owner subscription flow
6. Then repeat for BROKER
7. Then for BUYER
8. Finally polish UI with blue theme

**Timeline:** 4-5 weeks to complete

---

## ❓ QUESTIONS BEFORE WE START?

1. Do you have a Google account? (Required for Firebase - just need to login)
2. Preferred storage region? (Asia-Southeast1 for India)
3. Any specific project name? (or use "trueassets-web"?)

**Once Firebase is set up, reply with all 6 credentials and I'll start coding!** 🚀
