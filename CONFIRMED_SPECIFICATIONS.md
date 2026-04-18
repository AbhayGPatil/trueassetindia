# TrueAssets - CONFIRMED SPECIFICATIONS

## ✅ RAZORPAY SETUP - READY TO GO

```
Status: ✅ Test Mode Enabled

Test API Key: rzp_test_SSGoPuqGcCom1N
Test Key Secret: N2mRQamZ7vz9Rb2SO5C2o0mY
Merchant ID: SSFrfb6m7bby3X
Owner: Abhay Gururaj Patil

Environment: TEST (for development)
```

---

## 👥 USER ROLES & FREE UPLOADS

| Role | Free Uploads | Free Features | Paid Plan |
|------|--------------|---|---|
| **Owner** | 2 properties | Dashboard, tracking | "Rent Lister" - ₹500/month (5 rent properties) |
| **Broker** | 3 properties | Dashboard, tracking | Subscription plan |
| **Buyer** | 0 | Browse limited | Optional unlimited |

---

## 💰 SUBSCRIPTION PLANS (CONFIRMED)

### Plan 1 - FOR OWNERS (Paid Plan After 2 Free)
```
Name: "ProLister" or "EliteLister"
Price: ₹1,500 per quarter (3 months)
For: Owners who want unlimited property uploads
Features:
  - Unlimited property uploads (for 3 months)
  - Advanced analytics dashboard
  - Visitor tracking
  - Excel export of visitors
```

### Plan 2 - RENT PROPERTIES (Special Plan for Owners)
```
Name: "RentPro" or "RentMaster"
Price: ₹500 per month
For: Owners who want to upload exclusively RENT type properties
Features:
  - Can upload 5 RENT properties
  - Listed for 3 months each
  - Separate from main subscription
  - Dashboard tracking only for rent properties
```

### Plan 3 - FOR BROKERS (Paid Plan After 3 Free)
```
Name: "BrokerPro" or "DealMaker"
Price: ₹1,510-1,600 per quarter (3 months) [exact price TBD for testing]
For: Brokers who want unlimited property uploads
Features:
  - Unlimited property uploads (for 3 months)
  - Client tracking dashboard
  - "Interested" button tracking
  - Excel export of interested clients
  - Response rate metrics
```

### Plan 4 - FOR BUYERS (Optional - Unlimited Browse)
```
Name: "BuyerPlus" or "PropertyPro"
Price: ₹499 per month (optional)
For: Buyers who want unlimited property browsing
Features:
  - Browse all properties without limits
  - No ads (hide limited-access messages)
  - Save favorites
```

---

## 🏘️ PROPERTY CATEGORIES

✅ Confirmed categories:
- Residential
- Bank Auction
- Commercial
- Rent
- Lease

---

## 📱 PROPERTY "INTERESTED" FEATURE

**Highlighted Button on Each Property:**
```
"🔔 Mark as Interested" button (prominent color)
```

**When Visitor Clicks "Interested":**
1. Record: Visitor name, phone, email, property ID
2. Store in database: interested_visitors collection
3. Broker/Owner can see: Who is interested in each property
4. Dashboard: List all interested visitors with details
5. Excel Export: Name, Phone, Property, Interest Date, Basic Info

**For Broker Dashboard:**
- See all interested candidates across all their properties
- Export to Excel with filters
- Can mark as "Contacted", "Closed", "Ongoing"
- See response rate

---

## 🎨 UNIQUE PLAN NAMES (Eye-Catching)

**Instead of "BASIC" and "PROFESSIONAL":**

For OWNERS:
- ✅ "ProLister" / "EliteLister" / "PropertyMaxx" / "ListForever"

For RENT PROPERTIES:
- ✅ "RentMaster" / "RentPro" / "RentKing" / "RentBoost"

For BROKERS:
- ✅ "BrokerPro" / "DealMaker" / "DealMaxx" / "SalesPro"

For BUYERS:
- ✅ "BuyerPlus" / "PropertyHunter" / "PremiumByte" / "ExploreAll"

**Which names do you prefer? Or suggest others?**

---

## 🔄 UPDATED USER FLOWS

### Owner Flow:
```
1. Signup → Select "Owner"
2. Confirm: "You get 2 FREE property uploads as Owner"
3. Upload property 1 ✅ (FREE)
4. Upload property 2 ✅ (FREE)
5. Try property 3 → "Subscribe to list more"
6. Show 2 options:
   a) "ProLister" - ₹1,500 for unlimited (3 months)
   b) "RentMaster" - ₹500 for 5 rent properties (1 month)
7. Payment → Listed
8. Auto-expiry after 90 days
```

### Broker Flow:
```
1. Signup → Select "Broker"
2. Confirm: "You get 3 FREE property uploads as Broker"
3. Upload property 1 ✅ (FREE)
4. Upload property 2 ✅ (FREE)
5. Upload property 3 ✅ (FREE)
6. Try property 4 → "Subscribe to list more"
7. Show: "DealMaker" - ₹1,510 for unlimited (3 months)
8. Payment → Listed
9. See interested candidates dashboard
10. Auto-expiry after 90 days
```

---

## 🛠️ DATABASE UPDATES

**Add to Users Collection:**
```javascript
{
  // ... existing fields ...
  role: "owner|broker|buyer|admin",
  createdAt: timestamp,
  
  subscription: {
    // For primary subscription
    plan: "proLister|dealMaker|buyerPlus|free",
    startDate: timestamp,
    endDate: timestamp,
    status: "active|expired|free",
    propertiesUploaded: 2,
    maxAllowed: 2, // Changes based on plan
  },
  
  rentSubscription: {
    // ONLY for owners - separate subscription for rent properties
    plan: "rentMaster|none",
    startDate: timestamp,
    endDate: timestamp,
    status: "active|expired|none",
    rentPropertiesUploaded: 0,
    maxAllowed: 5, // When rentMaster plan active
  },
  
  freeUploadsUsed: 2, // Owners: max 2, Brokers: max 3
  maxFreeUploads: 2, // Changes by role
}
```

**Add to Properties Collection:**
```javascript
{
  // ... existing fields ...
  
  interestedVisitors: [
    {
      visitorId: "user123",
      name: "John Doe",
      phone: "9876543210",
      email: "john@example.com",
      interestedDate: timestamp,
      status: "new|contacted|closed",
      notes: ""
    }
  ],
  interestedCount: 5,
  
  uploadedUnder: "free|proLister|rentMaster|dealMaker",
  uploadedDate: timestamp,
  expiryDate: timestamp,
  isExpired: false,
}
```

**New Collection: InterestedVisitors**
```javascript
{
  visitorId: "unique_interested_id",
  propertyId: "prop123",
  visiterId: "user456", // Who clicked interested
  visitorName: "John",
  visitorPhone: "9876543210",
  visitorEmail: "john@example.com",
  ownerId: "owner123",
  brokerId: "broker123",
  interestedDate: timestamp,
  status: "new|contacted|closed",
  notes: "[For broker to add follow-up notes]"
}
```

---

## ✅ IMPLEMENTATION PRIORITY

### PHASE 1: Foundation (Next 2-3 days)
- [ ] Setup .env.local with Razorpay test keys
- [ ] Redesign signup form with role selection
- [ ] Add "Interested" button to property pages
- [ ] Create role-based free upload limits
- [ ] Update AuthContext with new subscription fields

### PHASE 2: Subscription & Payment (Next 2-3 days)
- [ ] Create subscription plan pages
- [ ] Integrate Razorpay payment (test mode)
- [ ] Create payment success/failed pages
- [ ] Track subscription in user profile

### PHASE 3: Dashboards (Next 3-4 days)
- [ ] Owner dashboard with visitor tracking
- [ ] Broker dashboard with interested clients
- [ ] Excel export functionality
- [ ] Statistics/analytics

### PHASE 4: Upload Limits & Auto-Expiry (Next 2-3 days)
- [ ] Count free uploads by role
- [ ] Block 3rd upload for owner (until subscription)
- [ ] Block 4th upload for broker (until subscription)
- [ ] Setup auto-delete after 90 days
- [ ] Setup auto-disable of old subscriptions

### PHASE 5: Home Page Redesign (2-3 days)
- [ ] 99acres style search bar
- [ ] Category showcase
- [ ] Limited property preview (3 per category)
- [ ] "Browse More" CTA

### PHASE 6: Polish & Testing (2-3 days)
- [ ] Test all flows with test API keys
- [ ] Security rules
- [ ] Bug fixes
- [ ] Performance optimization

---

## 💡 NEXT STEPS

1. **Add Razorpay credentials to .env.local**
2. **Confirm plan names** (do you like the suggestions?)
3. **Confirm exact pricing for broker plan** (₹1,510 or ₹1,600?)
4. **I'll start coding immediately.** First:
   - Update signup with role selection
   - Add interested button tracking
   - Implement free upload limits by role
   - Integrate Razorpay test mode

**Timeline: Complete system ready in 2-3 weeks**

Ready to start coding?
