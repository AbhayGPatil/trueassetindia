# 🎬 OWNER PHASE - VISUAL FLOW & STATUS

## 📊 Implementation Timeline

```
Day 1 (Today):
├─ Firebase Setup ✅ COMPLETE
├─ Owner Signup ✅ COMPLETE
├─ Owner Dashboard ✅ COMPLETE
├─ Subscription Plans ✅ COMPLETE
├─ Razorpay Checkout ✅ COMPLETE
├─ API Routes ✅ COMPLETE
│
Day 2 (Tomorrow):
├─ Add Razorpay Secret ⏳ (5 min)
├─ Integrate Upload Limits ⏳ (20 min)
├─ Add Interested Button ⏳ (20 min)
├─ Test Complete Flow ⏳ (30 min)
└─ OWNER PHASE ✅ DONE

Then:
├─ Broker Phase (Similar structure)
├─ Buyer Phase (Simpler)
└─ UI Polish (Blue theme + 99acres style)
```

---

## 🎯 OWNER USER JOURNEY

```
┌─────────────────────────────────────────────────────────────┐
│                    OWNER USER JOURNEY                       │
└─────────────────────────────────────────────────────────────┘

START
  │
  ├─ Visit http://localhost:3002
  │  ├─ See home page
  │  └─ Click [Sign Up]
  │
  ├─ Sign Up Form
  │  ├─ Fill: Name, Email, Phone, Password
  │  ├─ Select: "Property Owner"
  │  │  └─ Shows: "2 FREE uploads to start!"
  │  └─ Click [Create Account]
  │
  ├─ Firebase Auth
  │  ├─ Creates user in Firebase Auth
  │  ├─ Creates user profile in Firestore with:
  │  │  └─ role: "owner"
  │  │  └─ freeUploadsUsed: 0
  │  │  └─ maxFreeUploads: 2
  │  └─ Redirect to /dashboard/owner
  │
  ├─ Owner Dashboard ✅
  │  ├─ Welcome header
  │  │  └─ "Welcome, [Name] 👋"
  │  ├─ Subscription Status
  │  │  └─ "📤 Free Uploads: 0/2 used | Remaining: 2"
  │  ├─ Statistics
  │  │  ├─ Total Properties: 0
  │  │  ├─ Total Visitors: 0
  │  │  └─ Upload Status: 2 remaining
  │  ├─ [+ Add New Property] button
  │  │  └─ Enabled (can use 2 free uploads)
  │  ├─ Properties List (empty)
  │  └─ Interested Visitors (empty)
  │
  ├─ User wants more uploads
  │  └─ Click [+ Add New Property] after 2 uploads (or click [Subscribe])
  │     └─ Redirects to /subscription
  │
  ├─ Subscription Plans ✅
  │  ├─ See 3 plans:
  │  │  ├─ ProLister: ₹1,500 (3 months, unlimited)
  │  │  ├─ RentMaster: ₹500 (1 month, 5 uploads)
  │  │  └─ DealMaker: ₹1,510 (3 months, unlimited, client tracking)
  │  └─ Click [Subscribe Now] on any plan
  │     └─ Redirects to /payment/checkout?plan=proLister
  │
  ├─ Razorpay Checkout ✅
  │  ├─ See Order Summary
  │  │  ├─ Plan: ProLister
  │  │  ├─ Duration: 3 months
  │  │  ├─ Features: Unlimited uploads...
  │  │  └─ Total: ₹1,500
  │  └─ Click [Pay ₹1,500 with Razorpay]
  │     └─ Razorpay gateway opens
  │
  ├─ Payment Gateway (Razorpay) ✅
  │  ├─ Enter card details (test mode)
  │  │  ├─ Card: 4111111111111111
  │  │  ├─ Expiry: 12/25
  │  │  └─ CVV: 123
  │  ├─ Enter OTP: 123456
  │  └─ Click [Pay]
  │
  ├─ Payment Verification ✅
  │  ├─ Backend verifies signature
  │  ├─ Activates subscription in Firestore:
  │  │  ├─ subscription.plan: "proLister"
  │  │  ├─ subscription.status: "active"
  │  │  ├─ subscription.startDate: now
  │  │  └─ subscription.endDate: now + 90 days
  │  └─ Redirect to /dashboard/owner
  │
  ├─ Owner Dashboard (Updated) ✅
  │  ├─ Welcome header
  │  └─ Subscription Status
  │     ├─ Now shows: ✅ ActivePlan: ProLister
  │     ├─ Expires: [future date]
  │     └─ "You now have unlimited uploads!"
  │
  ├─ Upload Properties (Unlimited)
  │  ├─ Click [+ Add New Property]
  │  ├─ No upload limit warning now
  │  └─ Can upload as many as needed
  │
  └─ Manage Properties
     ├─ Dashboard shows all properties
     ├─ Click on property
     ├─ Can see interested visitors
     ├─ Can download Excel list
     └─ Dashboard shows stats
```

---

## 🔄 DATA FLOW

```
┌─────────────────────────────────────────────────────────┐
│              OWNER REGISTRATION DATA FLOW               │
└─────────────────────────────────────────────────────────┘

User Input (Signup Form)
  ├─ name: "John Doe"
  ├─ email: "john@example.com"
  ├─ phone: "9876543210"
  ├─ password: "***"
  └─ role: "owner"
       ↓
Firebase Auth
  ├─ Creates: user.uid = "abc123xyz"
  ├─ Stores: email, password (encrypted)
  └─ UID used for Firestore
       ↓
Firestore users Collection
  ├─ Document ID: "abc123xyz"
  └─ Data:
     ├─ uid: "abc123xyz"
     ├─ email: "john@example.com"
     ├─ name: "John Doe"
     ├─ phone: "9876543210"
     ├─ role: "owner"
     ├─ createdAt: "2026-03-17..."
     ├─ freeUploadsUsed: 0
     ├─ maxFreeUploads: 2
     └─ subscription:
        ├─ plan: "free"
        ├─ status: "free"
        ├─ startDate: null
        ├─ endDate: null
        └─ maxAllowed: 2
          ↓
Session Created
  ├─ User object stored in AuthContext
  ├─ Available to all components
  └─ Can access userProfile data
          ↓
Dashboard Loads
  ├─ Fetches user profile
  ├─ Shows: "2/2 free uploads available"
  └─ Shows: Add property button
```

---

## 💳 PAYMENT DATA FLOW

```
┌─────────────────────────────────────────────────────────┐
│              PAYMENT PROCESSING FLOW                    │
└─────────────────────────────────────────────────────────┘

User Action: [Subscribe Now]
  │
  └─ Razorpay Checkout Page
     ├─ Gets: planId from URL
     ├─ Gets: userId from AuthContext
     └─ Shows: Order summary
          │
          └─ User clicks: [Pay ₹1,500]
             │
             └─ API Call: /api/razorpay/create-order
                ├─ Body: { amount: 150000, planId, userId }
                ├─ Razorpay creates order
                └─ Returns: orderId
                     │
                     └─ Open Razorpay Gateway
                        ├─ User enters card details
                        ├─ User enters OTP
                        └─ Payment processed
                             │
                             └─ Razorpay returns:
                                ├─ razorpay_order_id
                                ├─ razorpay_payment_id
                                └─ razorpay_signature
                                   │
                                   └─ API Call: /api/razorpay/verify-payment
                                      ├─ Body: { orderId, paymentId, signature, userId, planId }
                                      ├─ Verify signature
                                      └─ If valid: return success
                                           │
                                           └─ Frontend calls: activateSubscription()
                                              ├─ Function: updateDoc(users/uid)
                                              └─ Update Firestore:
                                                 ├─ subscription.plan: planId
                                                 ├─ subscription.status: "active"
                                                 ├─ subscription.startDate: now
                                                 ├─ subscription.endDate: now + durationDays
                                                 ├─ subscription.razorpayOrderId: orderId
                                                 └─ subscription.razorpayPaymentId: paymentId
                                                    │
                                                    └─ Redirect: /dashboard/owner
                                                       └─ Dashboard fetches updated profile
                                                          └─ Shows: "Subscription Active"
```

---

## 📱 DATABASE SCHEMA (Firestore)

```
Collections:

┌─ users/ ─────────────────────────────────────────┐
│ [Document: uid = "abc123xyz"]                    │
│                                                  │
│ ├─ uid: "abc123xyz"                             │
│ ├─ email: "john@example.com"                    │
│ ├─ name: "John Doe"                             │
│ ├─ phone: "9876543210"                          │
│ ├─ role: "owner"                                │
│ ├─ createdAt: "2026-03-17T10:30:00Z"           │
│ │                                               │
│ ├─ freeUploadsUsed: 1                          │
│ ├─ maxFreeUploads: 2                           │
│ │                                               │
│ └─ subscription: {                              │
│    ├─ plan: "proLister"                        │
│    ├─ status: "active"                         │
│    ├─ startDate: "2026-03-17T10:40:00Z"       │
│    ├─ endDate: "2026-06-15T10:40:00Z"         │
│    ├─ maxAllowed: 999                          │
│    ├─ razorpayOrderId: "order_abc123"         │
│    └─ razorpayPaymentId: "pay_xyz789"         │
│                                                  │
└──────────────────────────────────────────────────┘

┌─ properties/ ─────────────────────────────────────┐
│ [Document: id = "prop_abc123"]                   │
│                                                  │
│ ├─ id: "prop_abc123"                            │
│ ├─ title: "2BHK Apartment"                      │
│ ├─ location: "Mumbai"                           │
│ ├─ price: "50,00,000"                           │
│ ├─ uploadedBy: "uid_abc123" (owner uid)         │
│ ├─ uploadedDate: "2026-03-17T10:50:00Z"        │
│ ├─ expiryDate: "2026-06-15T10:50:00Z"         │
│ ├─ visitorCount: 15                            │
│ ├─ interestedCount: 3                          │
│ └─ imageUrls: [                                 │
│    ├─ "gs://bucket/prop_abc123/img1.jpg"       │
│    ├─ "gs://bucket/prop_abc123/img2.jpg"       │
│    └─ ...                                       │
│    ]                                             │
│                                                  │
└──────────────────────────────────────────────────┘

┌─ interestedVisitors/ ────────────────────────────┐
│ [Document: id = "int_xyz789"]                   │
│                                                  │
│ ├─ id: "int_xyz789"                            │
│ ├─ propertyId: "prop_abc123"                   │
│ ├─ visitorId: "uid_visitor123"                 │
│ ├─ visitorName: "Rajesh Kumar"                 │
│ ├─ visitorPhone: "9876543210"                  │
│ ├─ interestedDate: "2026-03-17T11:00:00Z"     │
│ ├─ status: "new"                               │
│ ├─ notes: ""                                    │
│ └─ ownerId: "uid_abc123"                       │
│                                                  │
└──────────────────────────────────────────────────┘

┌─ subscriptions/ ──────────────────────────────────┐
│ [Document: id = "sub_abc123"]                   │
│                                                  │
│ ├─ userId: "uid_abc123"                        │
│ ├─ plan: "proLister"                           │
│ ├─ startDate: "2026-03-17T10:40:00Z"          │
│ ├─ endDate: "2026-06-15T10:40:00Z"            │
│ ├─ status: "active"                            │
│ ├─ razorpayOrderId: "order_abc123"            │
│ ├─ razorpayPaymentId: "pay_xyz789"            │
│ └─ amount: 1500                                │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 📈 STATISTICS CALCULATED

```
Director's Dashboard shows:
├─ Total Properties: COUNT(properties WHERE uploadedBy == userId)
├─ Total Visitors: COUNT(interestedVisitors WHERE ownerId == userId)
├─ Uploads Remaining: maxFreeUploads - freeUploadsUsed
│
└─ Premium subscribers see:
   ├─ Subscription status (active/expired)
   └─ Days remaining: endDate - today
```

---

## 🎨 UI COMPONENTS BUILT

```
╔════════════════════════════════════════════════════════════╗
║                    OWNER DASHBOARD                         ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  [Logo]           Welcome, John Doe! 👋       [Logout]    ║
║                                                            ║
║  ┌──────────────────────────────────────────────────┐     ║
║  │ 📞 Subscription Status                           │     ║
║  │ ✅ Active Plan: ProLister | Expires: Jun 15     │     ║
║  └──────────────────────────────────────────────────┘     ║
║                                                            ║
║  ┌──────────┬──────────┬──────────┐                       ║
║  │ 📝 Total │ 👁️ Total │ 📤 Upload │                       ║
║  │ Propert... Properties │ Status   │                       ║
║  │    5     │    12    │    2     │                        ║
║  │ listings │ visitors │Remaining │                        ║
║  └──────────┴──────────┴──────────┘                       ║
║                                                            ║
║  ┌──────────────────────────────────────────────────┐     ║
║  │ [+ Add New Property]                             │     ║
║  └──────────────────────────────────────────────────┘     ║
║                                                            ║
║  ┌──────────────────────────────────────────────────┐     ║
║  │ 🏘️ Your Properties                               │     ║
║  ├─────────────────────────────────────────────────┤     ║
║  │ ┌─────────┐  ┌─────────┐  ┌─────────┐           │     ║
║  │ │ 2BHK    │  │ 1BHK    │  │ Villa   │           │     ║
║  │ │Mumbai   │  │Delhi    │  │Bangalore│           │     ║
║  │ │50 Lakhs │  │30 Lakhs │  │80 Lakhs │           │     ║
║  │ │👁️5 ❤️2  │  │👁️3 ❤️1  │  │👁️4 ❤️ 0│           │     ║
║  │ └─────────┘  └─────────┘  └─────────┘           │     ║
║  └──────────────────────────────────────────────────┘     ║
║                                                            ║
║  ┌──────────────────────────────────────────────────┐     ║
║  │ 📱 Interested Visitors                           │     ║
║  ├─────────────────────────────────────────────────┤     ║
║  │ [📥 Download Excel]                             │     ║
║  │                                                  │     ║
║  │ Name    │ Phone       │ Property │ Status    │   │     ║
║  │ John... │ 9876543210  │ 2BHK     │ ⭕ NEW    │   │     ║
║  │ Sara... │ 9988776655  │ 1BHK     │ 🔵 Contact│   │     ║
║  │ Raj...  │ 9765432109  │ 2BHK     │ ✅ Closed│   │     ║
║  └──────────────────────────────────────────────────┘     ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
```

---

## 🚀 WHAT HAPPENS NEXT

```
Current: Day 1 Complete
  ├─ Firebase setup ✅
  ├─ Owner signup/dashboard ✅
  ├─ Payment system ✅
  └─ Database ready ✅

Tomorrow: Finishing touches (75 min)
  ├─ Add Razorpay secret (5 min)
  ├─ Integrate upload checks (20 min)
  ├─ Add interested button (20 min)
  ├─ Run tests (30 min)
  └─ OWNER PHASE COMPLETE! ✅

Week 2: Broker Phase
  ├─ Same structure as owner
  ├─ 3 free uploads (not 2)
  ├─ Client tracking dashboard
  └─ Response rate analytics

Week 3: Buyer Phase
  ├─ Limited property browsing
  ├─ Optional premium access
  └─ Marked as "interested" feature

Week 4: Polish
  ├─ Blue color scheme throughout
  ├─ 99acres style redesign
  └─ Final testing
```

---

## ✨ SUCCESS INDICATORS

**Owner Phase will be complete when:**

```
✅ User can sign up as owner
✅ Owner sees dashboard with "2 free uploads"
✅ Owner can view subscription plans
✅ Owner can complete payment with Razorpay
✅ After payment, shows "subscription active"
✅ Can upload unlimited properties
✅ Can see interested visitors
✅ Can download visitor list as Excel
✅ All with BLUE color scheme
```

**Status: 80% DONE** 🎉

Ready to finish tomorrow! 💪
