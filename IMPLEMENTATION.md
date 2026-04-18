# TrueAssets Platform - Implementation Guide

## Project Overview
**TrueAssets** is a modern real estate marketplace platform built with Next.js, Firebase, and Razorpay. It supports property listings, media uploads, user authentication, and subscription-based monetization.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16.1.1 + React 19.2.3 |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **Hosting** | Vercel (planned) |
| **Payments** | Razorpay |
| **Icons** | React Icons 5.5.0 |
| **Animation** | Framer Motion 12.23.26 |
| **Styling** | CSS Modules |

---

## Project Structure

```
trueassets-web/
├── app/                           # Next.js App Router
│   ├── layout.js                 # Root layout with AuthProvider
│   ├── page.jsx                  # Home page
│   ├── globals.css              # Global styles
│   ├── auth/
│   │   ├── login/page.jsx       # User login
│   │   └── signup/page.jsx      # User registration
│   ├── dashboard/
│   │   ├── page.jsx             # Property dashboard
│   │   └── dashboard.module.css # Dashboard styles
│   ├── property/
│   │   ├── add/page.jsx         # Add/Edit property
│   │   ├── [id]/page.jsx        # Property details (to be created)
│   │   └── enquiry/page.jsx     # Submit enquiry
│   ├── listings/
│   │   ├── page.jsx             # Browse all properties (existing)
│   │   └── listings.module.css  # Listings styles
│   ├── contact/
│   │   ├── page.jsx             # Contact page (existing)
│   │   └── contact.module.css   # Contact styles
│   └── [other pages]/           # Broker, developer, about pages
├── components/                    # Reusable components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PropertyCard.jsx
│   ├── FeatureCard.jsx
│   ├── TestimonialCard.jsx
│   └── [*.module.css]
├── lib/                          # Utility functions
│   ├── firebase.js              # Firebase config & initialization
│   ├── AuthContext.jsx          # Authentication context
│   ├── propertyUtils.js         # Property CRUD operations
│   ├── enquiryUtils.js          # Enquiry management
│   └── storageUtils.js          # Media upload utilities
├── hooks/
│   └── useScrollReveal.js       # Scroll animation hook
├── public/                       # Static assets
├── .env.local                    # Environment variables (needs setup)
├── package.json
├── next.config.mjs
└── jsconfig.json
```

---

## Setup Instructions

### 1. Environment Configuration

Create `.env.local` in the project root with your Firebase and Razorpay credentials:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Razorpay Configuration (optional for Phase 2)
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key
NEXT_PUBLIC_RAZORPAY_KEY_SECRET=your_secret
```

### 2. Firebase Setup

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
2. Enable Authentication (Email/Password, Google)
3. Create Firestore Database
4. Create Storage Bucket
5. Copy credentials to `.env.local`

### 3. Firestore Collections & Schema

#### Users Collection
```javascript
{
  uid: string,
  name: string,
  email: string,
  phone: string,
  role: 'admin' | 'broker' | 'owner',
  createdAt: ISO timestamp,
  subscription: {
    plan: string,
    validUntil: ISO timestamp,
    status: 'active' | 'inactive'
  }
}
```

#### Properties Collection
```javascript
{
  id: string,
  title: string,
  description: string,
  price: number,
  city: string,
  locality: string,
  address: string,
  propertyType: 'sale' | 'rent' | 'resale' | 'bankAuction',
  assetType: '1RK' | '1BHK' | '2BHK' | 'villa' | 'office' | 'plot',
  bhk: number,
  areaSqft: number,
  bathrooms: number,
  furnishing: 'unfurnished' | 'semi-furnished' | 'fully-furnished',
  parking: number,
  floorNumber: number,
  totalFloors: number,
  facing: string,
  amenities: string[],
  ageOfProperty: number,
  maintenanceCost: number,
  listingType: 'owner' | 'broker' | 'builder',
  images: string[], // Download URLs
  videos: string[], // Download URLs
  youtubeVideoLinks: string[],
  ownerId: string,
  createdAt: ISO timestamp,
  status: 'pending' | 'approved' | 'rejected',
  rejectionReason: string
}
```

#### Enquiries Collection
```javascript
{
  id: string,
  name: string,
  email: string,
  phone: string,
  message: string,
  propertyId: string,
  userId: string | null, // null for visitors
  status: 'pending' | 'contacted' | 'closed',
  createdAt: ISO timestamp
}
```

#### Subscriptions Collection
```javascript
{
  id: string,
  userId: string,
  plan: 'basic' | 'pro' | 'premium',
  amount: number,
  validFrom: ISO timestamp,
  validUntil: ISO timestamp,
  razorpayOrderId: string,
  status: 'pending' | 'active' | 'expired',
  createdAt: ISO timestamp
}
```

### 4. Firebase Storage Rules

Set these rules in Firebase Console:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow public read
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

### 5. Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users - only own profile
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
      allow read: if request.auth.token.admin == true;
    }
    
    // Properties - public read, owner write
    match /properties/{docId} {
      allow read: if resource.data.status == 'approved';
      allow create: if request.auth != null && request.auth.uid == request.resource.data.ownerId;
      allow update, delete: if request.auth.uid == resource.data.ownerId || request.auth.token.admin == true;
    }
    
    // Enquiries - owner can read, anyone can create
    match /enquiries/{docId} {
      allow create: if true;
      allow read: if request.auth != null && (request.auth.uid == resource.data.ownerId || request.auth.token.admin == true);
      allow update: if request.auth.token.admin == true;
    }
    
    // Subscriptions - admin operation
    match /subscriptions/{docId} {
      allow read: if request.auth.uid == resource.data.userId;
      allow write: if request.auth.token.admin == true;
    }
  }
}
```

---

## Key Files & Components

### lib/firebase.js
Initializes Firebase services (Auth, Firestore, Storage)

### lib/AuthContext.jsx
Provides authentication state and methods globally
- `useAuth()` hook for accessing user state
- `signup()`, `login()`, `logout()` methods

### lib/propertyUtils.js
CRUD operations for properties:
- `addProperty()` - Create new listing
- `getProperty()` - Fetch single property
- `getApprovedProperties()` - List with pagination
- `searchProperties()` - Search with filters
- `updateProperty()` - Edit listing
- `deleteProperty()` - Remove listing
- `approveProperty()` - Admin function
- `rejectProperty()` - Admin function

### lib/enquiryUtils.js
Enquiry management:
- `submitEnquiry()` - Create new enquiry
- `getPropertyEnquiries()` - Get enquiries for a property
- `getUserEnquiries()` - Get user's enquiries
- `getAllEnquiries()` - Admin function

### lib/storageUtils.js
Media upload & management:
- `uploadImage()` - Upload & convert to WebP
- `uploadVideo()` - Upload short videos
- `deleteImage()` - Delete from storage
- `deleteVideo()` - Delete from storage
- `validateVideoDuration()` - Check video length

---

## Pages Status

| Page | Status | Description |
|------|--------|-------------|
| `/` | ✅ Complete | Home/landing page with featured listings |
| `/listings` | ✅ Existing | Browse all properties |
| `/property/[id]` | 🔄 Partial | Property details (needs enquiry button) |
| `/property/add` | ✅ Complete | Add/edit property with media upload |
| `/property/enquiry` | ✅ Complete | Submit enquiry form |
| `/auth/signup` | ✅ Complete | User registration |
| `/auth/login` | ✅ Complete | User login |
| `/dashboard` | ✅ Complete | User's property dashboard |
| `/admin` | ❌ Not Started | Admin panel |
| `/broker` | ⏳ Partial | Broker info page |
| `/about` | ⏳ Partial | About page |
| `/contact` | ⏳ Partial | Contact page |
| `/developer` | ⏳ Partial | Developer partnerships |

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Server runs on http://localhost:3000 (or 3002 if 3000 is in use)

# Build for production
npm run build

# Start production server
npm start
```

---

## Implementation Phases Completed

✅ **Phase 1 - Core Platform (MVP)**
- User roles: Visitor, Broker, Owner, Admin
- Authentication system
- Basic property listing

✅ **Phase 2 - Property Listing System**
- Complete data model
- CRUD operations

✅ **Phase 3-4 - Media System**
- Image upload to Firebase Storage
- Video upload support
- Media deletion

✅ **Phase 6 - Enquiry System**
- Enquiry submission form
- Data storage in Firestore

---

## Implementation Phases Remaining

🔄 **Phase 5 - Search System**
- Advanced filters (city, price, type, amenities, etc.)
- Full-text search capability

🔄 **Phase 7 - Admin Dashboard**
- Property approval/rejection
- User management
- Analytics

🔄 **Phase 8 - Monetization**
- Razorpay integration
- Subscription management
- Payment webhooks

🔄 **Phase 9 - Performance Optimization**
- Image optimization with Next.js Image
- Pagination
- CDN setup

---

## Running the Application

1. **Setup Firebase credentials** in `.env.local`
2. **Install dependencies**: `npm install`
3. **Start dev server**: `npm run dev`
4. **Open browser**: `http://localhost:3000`

---

## Next Steps

1. Set up Firebase project and update `.env.local`
2. Create admin dashboard for property approval
3. Implement Razorpay payment integration
4. Add advanced search filters
5. Set up analytics tracking
6. Deploy to Vercel
7. Set up CI/CD pipeline

---

## Key Features Implemented

✅ User authentication (Email/Password)
✅ Property CRUD operations
✅ Image/video upload with Firebase Storage
✅ WebP format conversion for images
✅ Role-based access (Owner, Broker, Visitor, Admin)
✅ Property enquiry system
✅ Scroll animations
✅ Responsive design
✅ User dashboard
✅ Property search with pagination

---

## Security Considerations

1. **Authentication**: Firebase Auth handles secure login
2. **Database**: Firestore rules enforce user-specific access
3. **Storage**: Only file owners can delete their media
4. **Admin Functions**: Protected with role checks
5. **Environment Variables**: Sensitive data in `.env.local` (gitignored)

---

## Performance Features

- ✅ Image lazy loading (Next.js Image)
- ✅ Auto WebP conversion
- ✅ Firebase CDN for media
- ✅ Pagination for listings
- ✅ CSS Modules for scoped styling
- ✅ Scroll reveal animations

---

## Troubleshooting

### Port Already in Use
The dev server automatically uses the next available port. If you need port 3000:
```bash
netstat -ano | findstr :3000  # Windows - find process using port 3000
taskkill /PID <PID> /F         # Kill the process
```

### Firebase Connection Issues
- Verify `.env.local` has correct credentials
- Check Firebase project is active
- Ensure Firestore and Storage are enabled

### Media Upload Failures
- Check Firebase Storage rules
- Verify image size < 500KB
- Verify video size < 50MB
- Check file format is supported

---

## Documentation & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Razorpay Integration](https://razorpay.com/docs)

---

## Support & Contribution

For issues, questions, or contributions, please contact the development team.

---

**Last Updated**: March 15, 2026
**Current Version**: 0.1.0 (MVP)
**Status**: Active Development
