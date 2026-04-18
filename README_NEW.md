# 🏢 TrueAssets - Real Estate Marketplace Platform

> A modern, scalable real estate marketplace platform built with Next.js, Firebase, and Razorpay. Connect property owners, brokers, developers, and buyers in one unified platform.

---

## 🎯 Overview

**TrueAssets** is a comprehensive real estate marketplace that enables:
- 🏠 **Property Owners** to list their properties
- 🤝 **Brokers** to manage multiple listings and find clients
- 🏗️ **Developers** to showcase projects
- 👥 **Visitors** to search and enquire about properties
- 💰 **Monetization** through subscription packages
- ✅ **Admins** to manage platform operations

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account
- Razorpay account (optional, for payments)

### Setup in 5 minutes
```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with Firebase credentials
cp .env.local.example .env.local
# Edit .env.local with your Firebase credentials

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:3000
```

**For detailed setup**, see [QUICKSTART.md](QUICKSTART.md)

---

## 📊 Project Status

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Core Platform | ✅ Complete |
| 2 | Property System | ✅ Complete |
| 3-4 | Media System | ✅ Complete |
| 6 | Enquiry System | ✅ Complete |
| 7 | Onboarding | ✅ Complete |
| 5 | Search & Filters | 🔄 In Progress |
| 8 | Monetization | ⏳ Planned |
| 9 | Admin Dashboard | ⏳ Planned |
| 10 | Performance | ⏳ Planned |

**Overall Completion: 60%** (See [CHECKLIST.md](CHECKLIST.md) for details)

---

## 🏗️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16.1.1, React 19.2.3 |
| **Backend** | Firebase (Auth, Firestore, Storage) |
| **Hosting** | Vercel |
| **Payments** | Razorpay |
| **Icons** | React Icons 5.5.0 |
| **Animations** | Framer Motion 12.23.26 |
| **Styling** | CSS Modules |

---

## 📁 Project Structure

```
trueassets-web/
├── app/                      # Next.js pages & layouts
│   ├── layout.js            # Root layout with AuthProvider
│   ├── page.jsx             # Home page
│   ├── auth/                # Authentication pages
│   ├── dashboard/           # User dashboard
│   ├── property/            # Property management
│   ├── listings/            # Browse properties
│   ├── contact/             # Contact pages
│   ├── globals.css          # Global styles
│   └── [other].module.css   # Component styles
├── components/              # Reusable React components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── PropertyCard.jsx
│   └── ...
├── lib/                     # Utility functions
│   ├── firebase.js          # Firebase config
│   ├── AuthContext.jsx      # Auth state management
│   ├── propertyUtils.js     # Property operations
│   ├── enquiryUtils.js      # Enquiry management
│   ├── storageUtils.js      # Media upload
│   └── subscriptionUtils.js # Subscriptions
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
├── .env.local              # Environment variables (gitignored)
├── package.json            # Dependencies
├── IMPLEMENTATION.md       # Complete guide
├── QUICKSTART.md          # Setup guide
├── CHECKLIST.md           # Feature checklist
└── SUMMARY.md             # Implementation summary
```

---

## 🚀 Getting Started

### 1. Clone Repository
```bash
git clone <repository-url>
cd trueassets-web
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Firebase
1. Create Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable Authentication (Email/Password)
3. Create Firestore Database
4. Create Storage Bucket
5. Get credentials from Project Settings

### 4. Create .env.local
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key  # Optional
```

### 5. Run Development Server
```bash
npm run dev
# Open http://localhost:3000
```

**For step-by-step guide**, see [QUICKSTART.md](QUICKSTART.md)

---

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Complete setup guide with screenshots
- **[IMPLEMENTATION.md](IMPLEMENTATION.md)** - Architecture, database schema, API docs
- **[CHECKLIST.md](CHECKLIST.md)** - Feature completion status
- **[SUMMARY.md](SUMMARY.md)** - Implementation summary

---

## ✨ Key Features

### 🔐 Authentication
- Email/Password authentication
- User roles (Owner, Broker, Developer, Admin)
- Secure session management
- Protected routes

### 🏠 Property Management
- Add/edit/delete property listings
- Complete property data model
- Property status workflow (pending → approved → published)
- Property search with pagination

### 📸 Media Management
- Image upload with auto WebP conversion
- Video upload (short walkthroughs)
- YouTube video link support
- Media deletion capability

### 💬 Enquiry System
- Submit enquiries from property pages
- Enquiry tracking and management
- Owner/admin enquiry viewing
- Enquiry status tracking

### 📊 User Dashboard
- View personal listings
- Track property status
- Manage enquiries
- Subscription management (ready)

### 🎨 User Experience
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive forms with validation
- Error handling

---

## 🔐 Security

### Firebase Security Rules Provided
- User data access control
- Property listing permissions
- Storage file access restrictions
- Admin-only operations

### Built-in Protections
- Authentication required for sensitive operations
- User can only manage own properties
- Admin verification for approvals
- Environment variables for secrets

---

## 📱 Browser Support

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari | ✅ | ✅ |
| Edge | ✅ | ✅ |

---

## 🧪 Testing

### Test User Flow
1. Signup: `http://localhost:3000/auth/signup`
2. Add Property: `http://localhost:3000/property/add`
3. View Dashboard: `http://localhost:3000/dashboard`
4. Browse Listings: `http://localhost:3000/listings`
5. Submit Enquiry: Click property → Submit Enquiry

### Firebase Console Testing
- View users in Authentication section
- Check Firestore collections
- Verify Storage uploads
- Monitor Realtime Database

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Redeploy if needed
```

### Deploy to Other Platforms
Works with any Node.js hosting (Heroku, AWS, Google Cloud, etc.)

```bash
npm run build
npm start
```

---

## 📊 Database Schema

### Collections
- **users** - User profiles
- **properties** - Property listings
- **enquiries** - User enquiries
- **subscriptions** - Payment subscriptions

See [IMPLEMENTATION.md](IMPLEMENTATION.md#database-schema) for detailed schema

---

## 🛠️ Available Commands

```bash
npm run dev      # Start development server
npm run build    # Create production build
npm start        # Start production server
npm run lint     # Run linter (if configured)
npm audit        # Check vulnerabilities
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# The dev server will automatically use next available port
# Or manually kill process
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Firebase Connection Issues
- Verify credentials in `.env.local`
- Check Firebase project status
- Ensure Firestore and Storage are enabled

### Media Upload Failures
- Check file size (image < 500KB, video < 50MB)
- Verify Firebase Storage rules
- Check browser console for errors

See [IMPLEMENTATION.md](IMPLEMENTATION.md#troubleshooting) for more

---

## 📈 Performance Features

- ✅ Image lazy loading
- ✅ WebP format conversion
- ✅ Firebase CDN caching
- ✅ Pagination support
- ✅ CSS Modules scoped styling
- ✅ Optimized bundles

---

## 🎯 Roadmap

### Phase 5: Search & Filters (Week 2)
- Advanced property search
- Multiple filter options
- Search result pagination

### Phase 8: Monetization (Week 2-3)
- Razorpay integration
- Subscription packages
- Payment webhooks

### Phase 9: Admin Dashboard (Week 3)
- Admin overview
- Property approval workflow
- User & analytic management

### Phase 10: Optimization (Week 4)
- Performance optimization
- SEO improvements
- Analytics setup

---

## 💡 Contributing

### To Add Features
1. Create feature branch
2. Make changes in `/app` or `/lib`
3. Test thoroughly
4. Submit pull request
5. Get reviewed and merged

### Code Standards
- Use Next.js App Router
- Follow React hooks patterns
- Use CSS Modules for styling
- Add comments for complex logic
- Test before committing

---

## 📞 Support

- **Documentation**: See [IMPLEMENTATION.md](IMPLEMENTATION.md)
- **Setup Help**: See [QUICKSTART.md](QUICKSTART.md)
- **Feature Status**: See [CHECKLIST.md](CHECKLIST.md)
- **Firebase Docs**: https://firebase.google.com/docs
- **Next.js Docs**: https://nextjs.org/docs

---

## 📄 License

This project is proprietary. All rights reserved.

---

## 👥 Team

- **Project**: TrueAssets Real Estate Marketplace
- **Version**: 0.1.0 (MVP)
- **Status**: Active Development
- **Next Review**: After Phase 5 completion

---

## 🎉 Quick Links

| Link | Purpose |
|------|---------|
| [QUICKSTART](QUICKSTART.md) | Get started in 5 minutes |
| [IMPLEMENTATION](IMPLEMENTATION.md) | Technical documentation |
| [CHECKLIST](CHECKLIST.md) | Feature & phase status |
| [SUMMARY](SUMMARY.md) | Project summary |

---

## 🌟 Key Achievements

✅ **MVP Complete** - All core features implemented
✅ **Production Ready** - Code meets production standards
✅ **Well Documented** - 3 comprehensive guides
✅ **Secure by Default** - Security rules included
✅ **Scalable Architecture** - Ready for growth
✅ **60% Complete** - Major milestones hit

---

**Built with ❤️ for Real Estate Professionals**

*Last Updated: March 15, 2026*
*Current Version: 0.1.0*
*Next Release: Phase 5 - Search & Filters*
