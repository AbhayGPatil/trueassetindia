# TrueAssets - Complete Implementation Plan

## 🔴 PRIORITY 1: RAZORPAY SETUP (Required Before Everything)

### Step 1: Create Razorpay Account
Since you don't have one yet, here's how to set it up:

**PROCESS:**
1. Go to: https://razorpay.com
2. Click "Sign up"
3. Select: **Business Type: Real Estate / Property**
4. Enter your bank account details (you already have one ✅)
5. KYC verification will be required (GST, PAN, etc.)
6. Once approved, you'll get:
   - **Key ID** (like: `rzp_live_xxxxx`)
   - **Key Secret** (like: `abcd1234efgh5678`)

**Timeline:** 24-48 hours for approval

**Once approved, provide me:**
```
Razorpay Key ID: _______________
Razorpay Key Secret: _______________
Razorpay Account ID: _______________
```

---

## 💰 PRICING STRUCTURE (As Per Your Requirements)

### ✅ CONFIRMED PRICING:
```
Plan 1 (BASIC): Rs. 1,000
Plan 2 (PROFESSIONAL): Rs. 1,002
(You mentioned "differnt sections shld have subscription charged differently")

QUESTIONS TO CLARIFY:
- Is there a Plan 3 (PREMIUM)? If yes, what price?
- Is this per month or per quarter (3 months)?
- Should free tier users see a "Upgrade" button or just no listing option?
```

---

## 👥 USER ROLES & FEATURES

### 1. **VISITOR/BUYER** (Free Access)
```
Before Login/Signup:
✅ See home page with limited properties (3 of each category)
✅ Click on property → See full details
✅ Can scroll to see "Browse more properties" → Show CTA to signup

After Signup/Login (still free):
✅ Can view limited properties (limited access)
✅ Can submit enquiries to properties
✅ Cannot upload properties
❌ Cannot see premium features

Premium Features (Paid):
✅ Browse unlimited properties
✅ Can view premium properties
✅ Better search/filter
✅ Save favorite properties
```

### 2. **OWNER** (Property Uploader)
```
Free Tier:
✅ Can upload UP TO 2 PROPERTIES (FREE)
✅ Dashboard to manage 2 properties
✅ Can see: Total properties, subscription end date, visitor list
✅ Can CRUD own properties
✅ Can see who enquired about their property

After 2 Properties:
❌ Cannot upload 3rd property until subscription
✅ "Previous uploads available, buy plan to upload more" message

Paid Tier (BASIC - Rs. 1000/quarter):
✅ Can upload additional properties
✅ Listed for 3 MONTHS (then auto-delete)
✅ Dashboard with:
   - Total properties listed
   - Subscription end date
   - Property visitors list (with download to Excel)
   - Statistics by area
   - View inquiries per property
✅ Can extend on expiry

5 RENT PROPERTIES FEATURE:
- You mentioned "5 rent properties upload" separately
- Questions: 
  - Is this only for OWNERS or anyone?
  - Is this a separate plan?
  - Do these also auto-delete after 3 months?
```

### 3. **BROKER** (Multiple Properties)
```
Free Tier:
✅ Can upload UP TO 2 PROPERTIES (FREE)
✅ Dashboard to manage 2 properties
✅ Can see who enquired (interested clients)
✅ View: Name, Phone, Property, Which broker
✅ Can CRUD properties

After 2 Properties:
❌ Cannot upload until subscription

Paid Tier (PROFESSIONAL - Rs. 1002/quarter):
✅ Can upload unlimited properties
✅ Listed for 3 MONTHS (then auto-delete)
✅ SEPARATE DASHBOARD showing:
   - All properties listed (with status)
   - Interested clients list (can track)
   - Client details: Name, Phone, Property, Date of inquiry
   - Contact clients directly
   - Can filter/sort clients
   - Can mark as "contacted", "closed", "ongoing"
   - Statistics: Total inquiries, response rate

MISSING INFO - Need clarification:
- Can brokers create multiple properties under one account? (YES - assumed)
- Should there be team management? (Can assign properties to agents under broker?)
- Should brokers see client phone for direct contact?
```

---

## 📊 SUBSCRIPTION PLANS SUMMARY

| Feature | Free (Owner/Broker) | BASIC (Owner) | PROFESSIONAL (Broker) |
|---------|------------------|---|---|
| **Price** | FREE | Rs. 1000/quarter | Rs. 1002/quarter |
| **Properties** | 2 | Additional | Unlimited |
| **Duration** | - | 3 months | 3 months |
| **Auto-renew** | - | NO | NO |
| **Upload Period Expires** | - | Auto-delete after 3 months | Auto-delete after 3 months |
| **Dashboard** | Basic | With stats | Advanced with client tracking |
| **Visitor Tracking** | ✅ | ✅ | ✅ |
| **Client Tracking** | - | - | ✅ |
| **Excel Download** | - | ✅ | ✅ |
| **Renewal** | - | Ask at day 89 | Ask at day 89 |

---

## 🎨 UI REDESIGN REQUIREMENTS (Like 99Acres)

### Current Pages to Redesign:

1. **Home Page** (/app/page.jsx)
   ```
   BEFORE: Hero + Features + Testimonials
   AFTER: 
   - Search bar at top
   - Property categories (horizontal scroll)
   - Featured properties grid
   - Limited listings (3 per category shown)
   - "Browse More" with CTA to signup
   - Location filters
   - Price range filter
   - Similar to 99acres.com design
   ```

2. **Browse Properties Page** (NEW - /app/browse/page.jsx)
   ```
   - Search + filters on left sidebar (99acres style)
   - Properties grid on right
   - Pagination
   - If free tier: Limited results, "View More" → CTA to subscribe
   - If paid tier: All results visible
   ```

3. **Signup Page** (/app/auth/signup/page.jsx)
   ```
   CHANGE FROM: Simple form
   CHANGE TO:
   - Role selection at TOP (Buyer / Owner / Broker)
   - Different form fields based on role
   - For Owner/Broker: Show "2 free properties included"
   - Phone verification
   - Email verification
   ```

4. **Owner Dashboard** (NEW - /app/dashboard/owner/page.jsx)
   ```
   - Total properties count
   - Properties list with status
   - Visitor list with name, phone, timeline
   - Statistics by area and property type
   - Subscription status
   - Excel download button for visitors
   - Renewal button if subscription ending
   ```

5. **Broker Dashboard** (NEW - /app/dashboard/broker/page.jsx)
   ```
   - Similar to owner but with CLIENT TRACKING
   - Clients table: Name, Phone, Property of Interest, Date, Status
   - Filter by status (new, contacted, closed)
   - Contact button for each client
   - Response rate metrics
   - Properties list
   - Excel download for clients
   ```

6. **Add Property Page** (/app/property/add/page.jsx)
   ```
   EXISTING: Already built (14.5 KB)
   MODIFY:
   - Add upload limit check
   - Show "2 free uploads used" before asking for subscription
   - Show storage limit by plan
   - Add category selection (residential, commercial, plotland)
   ```

7. **Property Detail Page** (/app/property/[id]/page.jsx)
   ```
   MODIFY:
   - Show owner details (for brokers/buyers can contact)
   - Show similar properties
   - Enquiry form built into page
   - Virtual tour support (if videos uploaded)
   ```

---

## 🛠️ IMPLEMENTATION ARCHITECTURE

### Database Changes Required:

**1. Users Collection - ADD FIELDS:**
```javascript
{
  uid: "user123",
  role: "owner|broker|buyer|admin",
  email: "...",
  phone: "...",
  
  // Subscription info
  subscription: {
    plan: "free|basic|professional|premium",
    startDate: timestamp,
    endDate: timestamp,
    status: "active|expired|free",
    propertiesUploaded: 2, // Count
    maxAllowed: 2, // For free tier, unlimited for paid
  },
  
  // For brokers
  agentTeam: [
    {agentId, name, email, phone} // Can assign properties to agents
  ],
  
  // KYC verification (for owner/broker)
  kyc: {
    verified: true/false,
    gstNumber: "...",
    panNumber: "...",
    bankAccount: "..."
  }
}
```

**2. Properties Collection - ADD FIELDS:**
```javascript
{
  // Existing fields...
  
  // Subscription tracking
  uploadedUnder: "free|basic|professional", // Which plan was used
  uploadedDate: timestamp,
  expiryDate: timestamp, // 3 months from upload
  isExpired: false, // AUTO-SET to true when expiryDate passes
  
  // Visitor tracking
  visitors: [
    {userId, visitDate, visitorType: "owner|broker|buyer"}
  ],
  visitorCount: 0, // Total unique visitors
  
  // Enquiry tracking
  enquiriesList: [
    {enquiryId, name, phone, date, status}
  ],
  enquiryCount: 0,
  
  // Category for display
  category: "residential|commercial|plotland",
  isFeatured: false,
}
```

**3. NEW Collection: Subscriptions**
```javascript
{
  subscriptionId: "sub123",
  userId: "user123",
  plan: "basic|professional",
  price: 1000 or 1002,
  startDate: timestamp,
  endDate: timestamp,
  status: "active|expired|cancelled",
  razorpayOrderId: "...",
  razorpayPaymentId: "...",
  autoRenew: false,
}
```

**4. NEW Collection: Enquiries** (Modified)
```javascript
{
  enquiryId: "enq123",
  propertyId: "prop123",
  buyerId: "user123", // Who enquired
  sellerId: "seller123", // Property owner
  name: "...",
  phone: "...",
  email: "...",
  status: "new|contacted|closed",
  enquiryDate: timestamp,
}
```

---

## 🔄 COMPLETE USER FLOW

### FLOW 1: Unregistered Visitor (Free Browse)
```
1. User visits homepage
2. See 3 properties per category
3. Click property → See full details
4. Try to click "Enquire" → Show "Sign up to enquire"
5. Click "Sign up" → Go to signup
```

### FLOW 2: New Owner Signup
```
1. Visit /auth/signup
2. Select "Owner" role
3. Fill: Email, Phone, Password, Name
4. Select: Property type (residential/commercial/etc)
5. Agree to terms
6. Account created → Show "Welcome! You have 2 free uploads"
7. Go to dashboard → See empty properties list + "Add Property" CTA
8. Upload property 1 (FREE) ✅
9. Upload property 2 (FREE) ✅
10. Try to upload property 3 → Show "Subscription required"
11. Show plans: BASIC - Rs.1000 for 3 months
12. Click "Subscribe" → Razorpay payment
13. After payment → Can upload unlimited (for 3 months)
14. At day 89 → Show "Subscription ending in 7 days"
15. At day 90 → Subscription expired, features disabled, listing deleted
```

### FLOW 3: New Broker Signup
```
1. Visit /auth/signup
2. Select "Broker" role
3. Fill: Email, Phone, Password, Company Name, GST
4. Account created → "Welcome! You have 2 free uploads"
5. Upload property 1 (FREE)
6. Upload property 2 (FREE)
7. Try to upload property 3 → "Subscribe to upload more"
8. Show plan: PROFESSIONAL - Rs.1002 for 3 months
9. Subscribe → Payment
10. After payment → Can upload unlimited (3 months)
11. Dashboard shows: All properties + Interested clients list
12. When buyer enquires → Broker sees:
    - Client name, phone, property interested, date
    - Can mark as "contacted", "closed", etc.
    - Can download Excel of all clients
```

### FLOW 4: Buyer Search & Enquiry
```
1. Unregistered → See limited browse
2. Register as "Buyer"
3. Free access → See limited properties
4. Optional: Pay for BASIC (get unlimited browse)
5. Browse properties → Click property
6. See full details including owner/broker contact
7. Submit enquiry → Goes to seller's dashboard
```

---

## 🗂️ FILES TO CREATE/MODIFY

### NEW FILES NEEDED:
```
1. app/browse/page.jsx - Browse with filters (like 99acres)
2. app/dashboard/owner/page.jsx - Owner dashboard
3. app/dashboard/broker/page.jsx - Broker dashboard  
4. app/payment/checkout/page.jsx - Payment page
5. app/payment/success/page.jsx - Success page
6. app/payment/failed/page.jsx - Failed page
7. lib/subscriptionManager.js - Handle subscription logic
8. lib/propertyExpiryManager.js - Auto-delete expired properties
9. lib/clientTrackingUtils.js - Broker client tracking
10. lib/paymentUtils.js - Razorpay integration
```

### MODIFY EXISTING:
```
1. app/page.jsx - New home page design (99acres style)
2. app/auth/signup/page.jsx - Add role selection
3. app/auth/login/page.jsx - No changes needed
4. app/property/add/page.jsx - Add upload limit check
5. app/property/[id]/page.jsx - Add enquiry form, owner details
6. lib/AuthContext.jsx - Add subscription tracking
```

---

## 📋 IMPLEMENTATION ORDER (PRIORITY)

### STAGE 1: Foundation (Week 1)
- [ ] Razorpay account setup ⬅️ **START HERE**
- [ ] Redesign home page (99acres style)
- [ ] Modify signup to ask for role
- [ ] Create role-based access logic

### STAGE 2: Subscription System (Week 2)
- [ ] Build subscription plans UI
- [ ] Integrate Razorpay payment
- [ ] Create payment flow (checkout → success → failed)
- [ ] Track subscription in user document

### STAGE 3: Property Upload Limits (Week 2-3)
- [ ] Add upload counter to user profile
- [ ] Block 3rd upload without subscription
- [ ] Show subscription prompt
- [ ] Set property expiry to 3 months

### STAGE 4: Dashboards (Week 3-4)
- [ ] Build owner dashboard with visitor tracking
- [ ] Build broker dashboard with client tracking
- [ ] Add Excel export functionality
- [ ] Add statistics/analytics

### STAGE 5: Polish & Testing (Week 4-5)
- [ ] Test all user flows
- [ ] Security rules for Firestore
- [ ] Performance optimization
- [ ] Bug fixes

---

## 🔐 Firestore Security Rules (To Add)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      allow read: if request.auth.uid != null; // Brokers/Owners can see other user names
    }
    
    // Properties - Read if published
    match /properties/{propertyId} {
      allow read: if true; // Anyone can view published properties
      allow create: if request.auth.uid != null && 
                       request.resource.data.ownerId == request.auth.uid;
      allow update, delete: if request.auth.uid == resource.data.ownerId;
    }
    
    // Enquiries - Creator and property owner can access
    match /enquiries/{enquiryId} {
      allow read, write: if request.auth.uid == resource.data.buyerId ||
                            request.auth.uid == resource.data.sellerId;
      allow create: if request.auth.uid != null;
    }
    
    // Subscriptions - User can only see their own
    match /subscriptions/{subId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🎯 NEXT ACTIONS FOR YOU

### IMMEDIATE (Today):
1. **Create Razorpay account** → Go to razorpay.com
2. **Copy these details once approved:**
   - Key ID
   - Key Secret
   - Account ID

### SHORT TERM (This Week):
3. Review the UI designs I'll create
4. Approve role signup flow
5. Decide on "5 rent properties" feature clarity

### THEN I WILL:
1. Help you get Razorpay API keys
2. Redesign home page (99acres style)
3. Implement role-based signup
4. Build subscription system
5. Create dashboards
6. Implement upload limits
7. Setup auto-expiry (3 months)

---

## ❓ CLARIFICATION QUESTIONS BEFORE I START CODING

1. **"5 rent properties upload"** - Is this:
   - A separate plan tier?
   - Only for owners (not brokers)?
   - Do these also expire after 3 months?

2. **"Different sections should have subscription charged differently"** - What does this mean?
   - Different price for residential vs commercial?
   - Different price for sale vs rent?
   - Clarify with examples

3. **Free preview of property** - You mentioned:
   - "3 of each category shown before login"
   - Which categories? (Residential, Commercial, PlotLand?)
   - Or by property type? (Sale, Rent, Resale?)

4. **Property Categories** - Should I use:
   - Residential / Commercial / PlotLand? (Standard)
   - Or something else specific to India market?

5. **Broker Team Management** - Should brokers be able to:
   - Add team members/agents under their account?
   - Assign properties to specific agents?
   - See all team inquiries or agent-specific?

6. **Client Database Export** - For brokers, should:
   - Excel include contact history?
   - Include follow-up dates/notes?
   - Just name, phone, property, date?

---

## 📧 NEXT MESSAGE I NEED FROM YOU

```
RAZORPAY SETUP STATUS:
- Account created? (Yes/No)
- If yes, provide:
  - Key ID: _______________
  - Key Secret: _______________

CLARIFICATIONS:
1. What does "5 rent properties upload" mean? _______
2. "Different sections charged differently" - clarify _______
3. Property categories to use: _______
4. Should brokers manage team? (Yes/No)
5. What to include in Excel export? _______

PREFERENCE:
- Keep "BASIC" and "PROFESSIONAL" as plan names? (Yes/No)
- Any other plan? (Yes/No - if yes, what?)
```

Once I get these, I'll start coding the complete system!
