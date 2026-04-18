# 🧪 OWNER PHASE - COMPLETE TEST GUIDE

**Status:** ✅ Login + Signup + Dashboard + Payment ALL READY  
**Date:** March 17, 2026

---

## 📝 FULL TEST FLOW

### Step 1: Signup (First Time)
**URL:** http://localhost:3000/auth/signup

**Fill Form:**
```
Name:         Test Owner 1
Email:        testowner1@gmail.com
Phone:        9876543210
Role:         Property Owner ✓
Password:     Test@1234
Confirm:      Test@1234
```

**Click:** [Create Account]

**Expected Result:**
- ✅ Account created
- ✅ Redirect to `/dashboard/owner`
- ✅ Welcome message: "Welcome, Test Owner 1! 👋"
- ✅ Shows "Free Uploads: 0/2"
- ✅ Shows empty properties

---

### Step 2: Dashboard (First Login)
**Already at:** http://localhost:3000/dashboard/owner

**Check:**
```
✓ Welcome header visible
✓ Statistics cards:
  - Properties Listed: 0
  - Interested Visitors: 0
  - Free Uploads Left: 0/2
  - Subscription Status: Free
✓ [+ Add New Property] button visible
✓ Empty properties grid
✓ [Subscribe Now] button in header
```

---

### Step 3: Subscription Plans
**Click:** [Subscribe Now] button (or go to http://localhost:3000/subscription)

**See 3 Plans:**
```
1. ProLister
   ├─ ₹1,500 / 3 months
   └─ [Subscribe Now]

2. RentMaster
   ├─ ₹500 / 1 month
   └─ [Subscribe Now]

3. DealMaker ⭐ MOST POPULAR
   ├─ ₹1,510 / 3 months
   └─ [Subscribe Now]
```

---

### Step 4: Checkout (Choose One Plan)
**Click:** [Subscribe Now] on any plan (e.g., DealMaker)

**Should Redirect To:** http://localhost:3000/payment/checkout?plan=dealmaker

**See:**
```
Order Summary
├─ Plan Name: DealMaker
├─ Duration: 90 days
├─ Amount: ₹1,510
├─ Tax: Included
└─ Total: ₹1,510

[Pay ₹1,510 with Razorpay]

💡 Test Card: 4111111111111111 | Expiry: 12/25 | CVV: 123
```

---

### Step 5: Payment (CRITICAL TEST)
**Click:** [Pay ₹1,510 with Razorpay]

**Razorpay Form Opens:**
```
Enter details:
├─ Card: 4111111111111111
├─ Expiry: 12/25
├─ CVV: 123
└─ OTP: 123456 (any 6 digits)
```

**Expected Result:**
```
✅ Payment processing...
✅ "Payment successful"
✅ Order summary shows checkmark
✅ Redirects to dashboard
```

---

### Step 6: Verify Subscription Activated
**Redirected To:** http://localhost:3000/dashboard/owner

**Check:**
```
✅ Header shows: [✓ Subscribed] or similar
✅ Subscription banner visible:
   "Active Plan: DealMaker"
   "Expires: June 15, 2026" (or similar)
✅ Statistics updated:
   "Subscription Status: Active" (shown in blue)
✅ Free uploads might show "Unlimited" or "∞"
```

---

### Step 7: Logout & Login Test
**Logout:** (We'll need to add this - for now skip)

**Then Test Login:**
**URL:** http://localhost:3000/auth/login

**Fill Form:**
```
Email:    testowner1@gmail.com
Password: Test@1234
```

**Click:** [Sign In]

**Expected Result:**
```
✅ Logs in successfully
✅ Redirects to `/dashboard/owner`
✅ Shows same account: "Welcome, Test Owner 1! 👋"
✅ Shows active subscription
✅ All data persists
```

---

## 🔄 FULL TEST CHECKLIST

| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Visit signup page | Form loads | ✓/✗ |
| 2 | Fill & submit form | Account created | ✓/✗ |
| 3 | Redirect to dashboard | Welcome message | ✓/✗ |
| 4 | Click Subscribe | Plans page loads | ✓/✗ |
| 5 | Click DealMaker | Checkout page opens | ✓/✗ |
| 6 | Click Pay button | Razorpay form opens | ✓/✗ |
| 7 | Enter test card | Payment processing | ✓/✗ |
| 8 | Complete payment | Success message | ✓/✗ |
| 9 | Redirects to dashboard | Subscription active | ✓/✗ |
| 10 | Go to login page | Login form loads | ✓/✗ |
| 11 | Enter credentials | Successfully logs in | ✓/✗ |
| 12 | In dashboard | Account data shows | ✓/✗ |

---

## 🐛 IF SOMETHING FAILS

### Payment fails with "Failed to create order"
```
1. Check F12 Console for error details
2. Verify .env.local has Razorpay credentials
3. Restart server: Kill Node + npm run dev
4. Try again
```

### Can't login
```
1. Verify email & password are correct
2. Make sure you created account first
3. Check Firebase is connected (test data in Firestore)
```

### Subscription doesn't show as active
```
1. Refresh page (F5)
2. Wait 5 seconds
3. Check Firestore: users collection → your account
4. Verify subscription field is updated
```

### Login page shows 404
```
Already created: /auth/login/page.jsx
Just restart server and it should work
```

---

## 📍 KEY URLS

| Page | URL | Purpose |
|------|-----|---------|
| Signup | /auth/signup | Create new account |
| Login | /auth/login | Login existing user |
| Dashboard | /dashboard/owner | View account & properties |
| Plans | /subscription | View subscription plans |
| Checkout | /payment/checkout | Complete payment |

---

## 🚀 QUICK START

```bash
# Make sure server is running
npm run dev

# Go to browser
http://localhost:3000/auth/signup

# Or login if you have account
http://localhost:3000/auth/login
```

---

## ✅ SUCCESS CRITERIA

**All tests pass when:**
1. ✅ Can sign up new owner account
2. ✅ Dashboard shows with correct data
3. ✅ Can view all 3 subscription plans
4. ✅ Checkout page shows correct amount
5. ✅ Payment processes successfully
6. ✅ Subscription activates in dashboard
7. ✅ Can login with same credentials
8. ✅ Logged in user sees correct account data

---

## 🎯 NEXT STEPS (After all tests pass)

1. **Add logout button** to dashboard header
2. **Add property upload** page with upload limit checks
3. **Add "Mark as Interested"** button on property details
4. **Start Broker Phase** (same structure, different limits)
5. **UI Polish** with animations

---

**Ready to test?**

1. Go to http://localhost:3000/auth/signup
2. Create account
3. Follow the checklist above
4. Report back! ✅

Good luck! 💪
