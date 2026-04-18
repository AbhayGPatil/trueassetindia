# 🔧 FIX: Firebase "Missing or Insufficient Permissions" Error

## ⚡ QUICK FIX (5 minutes)

### Option 1: Temporary Fix (For Testing)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **trueassetindia-469cb** project
3. Go to **Firestore Database** → **Rules** tab
4. Replace all rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

5. Click **Publish**
6. Done! Server should work now.

---

### Option 2: Permanent Fix (Production Ready)
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **trueassetindia-469cb** project
3. Go to **Firestore Database** → **Rules** tab
4. Replace all rules with content from [firestore.rules](../firestore.rules) file
5. Click **Publish**

This gives proper security:
- ✅ Users can only edit their own profile
- ✅ Owners can only delete their own properties
- ✅ Visitors can mark interested
- ✅ Owners can view interested visitors

---

## 🚀 After Fixing Rules

Then run:
```bash
npm run build      # Should pass now
npm run dev        # Start server
```

---

## ❓ Why This Error Happens

Firebase has security rules that control who can read/write data. By default, they're very restrictive.

**Your app needs:**
- Read user profiles ✓
- Create/read/update properties ✓
- Mark interested ✓

The rules file provides this access.

---

## 📝 Current firestore.rules

See [firestore.rules](../firestore.rules) for the production-ready security rules.

Rules include:
- User profile access (self + read other profiles)
- Property CRUD operations
- Interested visitor management
- Proper owner authorization

---

## ✅ After Publishing Rules

Build will work:
```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data

No errors!
```

Then start dev server:
```
npm run dev
```

Go to http://localhost:3000 and test! 💪
