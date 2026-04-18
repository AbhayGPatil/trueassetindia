# Implementation Roadmap - Complete Workflow

## 📋 BUILDING STRATEGY

**Approach:** Build COMPLETE features for one role at a time
- Owner (Phase 1) → Broker (Phase 2) → Buyer (Phase 3) → Polish UI (Phase 4)

**Not:** Building separate components in parallel
**Why:** Each role has distinct workflows; finishing one fully prevents bugs

---

## 🎯 PHASE 1: OWNER - COMPLETE FLOW (Week 1-2)

### Step 1: Owner Signup Page
**File:** `app/auth/signup/page.jsx` (MODIFY)

```
Changes:
- Add role selection (Owner / Broker / Buyer)
- If Owner selected:
  - Show: "You get 2 FREE property uploads!"
  - Form fields: Name, Email, Phone, Password, GST (optional), PAN (optional)
  - Confirmation message
```

**What happens on submit:**
- Create user in Firebase Auth
- Create user document in Firestore with:
  ```javascript
  {
    uid: auth.uid,
    role: "owner",
    name: "...",
    email: "...",
    phone: "...",
    freeUploadsUsed: 0,
    maxFreeUploads: 2,
    subscription: {
      plan: "free",
      status: "free",
      maxAllowed: 2
    },
    rentSubscription: {
      plan: "none",
      status: "none",
      maxAllowed: 0
    }
  }
  ```

---

### Step 2: Owner Login Page
**File:** `app/auth/login/page.jsx`

- No changes needed (already built)
- Just ensure redirect to `/dashboard/owner` after login

---

### Step 3: Owner Dashboard
**File:** `app/dashboard/owner/page.jsx` (NEW)

**Shows:**
```
┌─ Owner Dashboard ──────────────────────────┐
│                                            │
│ Welcome, [Name]!                          │
│                                            │
│ 📊 SUBSCRIPTION STATUS                    │
│ ├─ Plan: Free (2 uploads)                 │
│ ├─ Uploaded: 0/2                          │
│ ├─ Subscription Ends: -                   │
│ └─ Status: Active ✅                      │
│                                            │
│ 🏘️ YOUR PROPERTIES                        │
│ ├─ [+] Add New Property                   │
│ ├─ Property 1                             │
│ │  ├─ Status: Active                      │
│ │  ├─ Interested: 5                       │
│ │  ├─ [Edit] [Delete]                    │
│ │  └─ 👁️ 45 visitors                      │
│ │                                         │
│ └─ Property 2                             │
│    └─ [Edit] [Delete]                    │
│                                            │
│ 📱 INTERESTED VISITORS                    │
│ ├─ Name | Phone | Property | Date        │
│ ├─ John | 9876543210 | Prop1 | 3/17     │
│ ├─ Jane | 9988776655 | Prop1 | 3/16     │
│ └─ [📥 Download Excel]                   │
│                                            │
│ 📈 STATISTICS                             │
│ ├─ Total Visitors: 45                     │
│ ├─ Total Interested: 12                   │
│ └─ Avg Interest Rate: 26%                 │
│                                            │
└────────────────────────────────────────────┘
```

**Components needed:**
- SubscriptionCard (shows subscription status)
- PropertyList (shows all properties)
- InterestedVisitorsList (table with data)
- StatisticsCard (metrics)

**Data fetched:**
- User profile
- All properties for that owner
- All interested visitors for those properties
- Subscription details

---

### Step 4: Add Property for Owner
**File:** `app/property/add/page.jsx` (MODIFY)

**Add to existing form:**
```
Before showing form:
1. Check: canUploadProperty(userId)
2. If can't upload:
   - Show: "You've used 2/2 free uploads"
   - Show: "Subscribe to upload more"
   - Show 2 plan options:
     a) ProLister - ₹1,500 (unlimited uploads)
     b) RentMaster - ₹500 (5 rent properties)
   - [Subscribe Now] button

If can upload:
- Show property form as normal
- On submit: Increment freeUploadsUsed counter
```

---

### Step 5: Property Detail Page
**File:** `app/property/[id]/page.jsx` (MODIFY)

**Add to page:**
```
Changes:
- Add highlighted button: "🔔 Mark as Interested"
  - If not logged in → Show login CTA
  - If logged in → Allow click
  - If already interested → Show "Already interested"
  - On click → Save to interestedVisitors collection
```

---

### Step 6: Owner Subscriptions
**File:** `app/subscription/page.jsx` (NEW)

**Shows all plans:**
```
┌─ Choose Your Plan ──────────┐
│                             │
│ ProLister    | RentMaster   │
│ ₹1,500       | ₹500/month   │
│ 3 months     |              │
│ ✅ Unlimited | ✅ 5 Rent    │
│ [Subscribe]  | [Subscribe]  │
│                             │
└─────────────────────────────┘
```

**On click [Subscribe]:**
- Redirect to payment page with selected plan

---

### Step 7: Owner Subscription Payment
**File:** `app/payment/checkout/page.jsx` (NEW)

**Shows:**
```
Selected Plan: ProLister
Amount: ₹1,500
Duration: 3 months

[Pay with Razorpay]
```

**On payment success:**
- Update user subscription in Firestore:
  ```javascript
  subscription: {
    plan: "proLister",
    startDate: now,
    endDate: now + 90 days,
    status: "active",
    maxAllowed: 999,
    razorpayOrderId: "...",
    razorpayPaymentId: "..."
  }
  ```
- Redirect to `/payment/success`
- Show: "Subscription activated! Start uploading"
- Dashboard now shows unlimited uploads

---

### Step 8: Owner - Complete Features

**At this point, Owner can:**
- ✅ Sign up with 2 free uploads
- ✅ See dashboard with subscription status
- ✅ Upload 2 properties free
- ✅ See visitors/interested people
- ✅ Download interested visitors as Excel
- ✅ Buy subscription with Razorpay
- ✅ Upload unlimited after subscription
- ✅ See auto-expiry date (90 days)

---

## 🎯 PHASE 2: BROKER - COMPLETE FLOW (Week 3)

### Exact same process but:

**Differences:**
- 3 free uploads (not 2)
- Broker-specific dashboard with **Client Tracking**
- Can see "Status" of each client (New/Contacted/Closed)
- Can download Excel with client info
- Response rate metrics
- Different subscription plan (DealMaker)

**Files:**
1. Modify `app/auth/signup/page.jsx` (add Broker role option)
2. Create `app/dashboard/broker/page.jsx` (similar to owner but different layout)
3. Modify `app/property/add/page.jsx` (same upload logic)
4. Already have subscription pages from Owner phase

---

## 🎯 PHASE 3: BUYER - COMPLETE FLOW (Week 4)

### Simpler than Owner/Broker:

**Changes:**
1. Buyer signup (no uploads)
2. Home page shows limited properties (3 per category)
3. Buyer can click "Browse More" → Pay for BuyerPlus (optional)
4. Buyer marks properties as "Interested"
5. See dashboard with interested properties

---

## 🎨 PHASE 4: POLISH & UI (Week 5)

**Changes:**
1. Home page redesign (99acres style)
2. Add **BLUE color scheme** throughout
3. Professional styling
4. Animations
5. Responsive design
6. Test on mobile

---

## 📊 TIMELINE SUMMARY

```
┌─────────────────────────────────────────────────────┐
│ Week 1 (Days 1-3): Owner Signup + Dashboard        │
│ Week 1 (Days 4-5): Owner Add Property + Payments   │
│ ───                                                 │
│ Week 2 (Days 1-3): Owner Subscriptions Complete    │
│ Week 2 (Days 4-5): Owner Testing + Bug Fixes       │
│ ───                                                 │
│ Week 3 (Days 1-3): Broker Signup + Dashboard       │
│ Week 3 (Days 4-5): Broker Subscriptions Complete   │
│ ───                                                 │
│ Week 4 (Days 1-3): Buyer Signup + Limited Browse   │
│ Week 4 (Days 4-5): Buyer Payments + Full Testing   │
│ ───                                                 │
│ Week 5: Final UI Polish (99acres style, Blue theme)│
└─────────────────────────────────────────────────────┘
```

---

## 🚀 STARTING NOW - WHAT I NEED

**From you:**
1. Firebase account setup (follow FIREBASE_SETUP_GUIDE.md)
2. Provide 6 Firebase credentials:
   - API Key
   - Auth Domain
   - Project ID
   - Storage Bucket
   - Messaging Sender ID
   - App ID

3. Confirm Blue color code: (e.g., #0066FF or #1E40AF)

**Then I'll:**
1. Add credentials to .env.local
2. Test Firebase connection
3. Start building Owner phase immediately

---

## 🔴 IMPORTANT: BUILD ONE ROLE AT A TIME

**Don't mix features between roles:**
- Finish OWNER completely → Then BROKER → Then BUYER
- Prevents integration bugs
- Each role has unique workflows
- Testing is easier

---

## ✅ OWNER PHASE CHECKLIST

When Owner phase is complete, you should be able to:
- [ ] Visit localhost:3002
- [ ] Sign up as Owner (see "2 free uploads" message)
- [ ] Go to dashboard
- [ ] Add 2 properties (free)
- [ ] Try to add 3rd → See "Subscribe" CTA
- [ ] Click subscribe
- [ ] Complete Razorpay payment (test mode)
- [ ] Successfully add more properties
- [ ] See dashboard with statistics
- [ ] Download interested visitors as Excel
- [ ] See subscription ending date
- [ ] After 90 days → See properties auto-delete (we'll test manually)

---

## 💡 WORKING APPROACH

**Each day workflow:**
1. Morning: Plan what to build
2. Build features in `lib/` first (logic)
3. Then build UI components
4. Test with real data
5. Report progress & blockers

**Communication:**
- Every feature → Show you the result
- Every 2 days → Full status update
- Ask questions immediately if unclear

---

## 🎯 READY TO START?

**Next message I need:**
```
Firebase Setup Status:
- Account created? (Yes/No)
- If yes, provide 6 credentials:
  1. API Key: _______________
  2. Auth Domain: _______________
  3. Project ID: _______________
  4. Storage Bucket: _______________
  5. Messaging Sender ID: _______________
  6. App ID: _______________

UI Preference:
- Blue color code: _______________ (e.g., #0066FF)
- Should I start with Owner phase? (Yes/No)
```

Once you provide these, I'll start building IMMEDIATELY! 🚀
