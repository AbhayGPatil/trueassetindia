# 🧪 OWNER PHASE - QUICK TEST GUIDE

**Status:** ✅ RAZORPAY CREDENTIALS ADDED - Ready to Test!

---

## 🎯 WHAT TO TEST NOW

Your Razorpay credentials are configured:
```
Test API Key: rzp_test_SSGoPuqGcCom1N ✅
Test Secret: N2mRQamZ7vz9Rb2SO5C2o0mY ✅
Merchant ID: SSFrfb6m7bby3X ✅
```

---

## 🚀 TEST 1: Owner Signup (5 minutes)

**URL:** http://localhost:3002/auth/signup

**Steps:**
1. Fill the form:
   ```
   Name: Test Owner
   Email: testowner@example.com
   Phone: 9876543210
   Role: Property Owner ← SELECT THIS
   Password: Test@1234
   Confirm: Test@1234
   ```

2. Click **[Create Account]**

**Expected Result:**
```
✅ Redirects to: /dashboard/owner
✅ Shows: "Welcome, Test Owner! 👋"
✅ Shows: "Free Uploads: 0/2 used"
✅ Shows statistics and empty properties
```

---

## 🎨 TEST 2: View Dashboard (3 minutes)

**Already on:** http://localhost:3002/dashboard/owner

**Check:**
- [x] Welcome header visible
- [x] Subscription status card showing "0/2"
- [x] Statistics: 0 properties, 0 visitors
- [x] [+ Add New Property] button
- [x] Empty properties grid
- [x] Empty interested visitors table
- [x] Everything is BLUE color (#0066FF)

---

## 💳 TEST 3: Subscription Plans (3 minutes)

**URL:** http://localhost:3002/subscription

**Steps:**
1. Click: **[+ Add New Property]** on dashboard
   OR go directly to subscription page

2. See 3 plan cards

**Check:**
- [x] ProLister: ₹1,500 (3 months)
- [x] RentMaster: ₹500 (1 month)
- [x] DealMaker: ₹1,510 (FEATURED - 3 months)
- [x] All [Subscribe Now] buttons present

---

## 💰 TEST 4: CRITICAL - Payment Flow (15 minutes)

### Step 1: Click Subscribe
1. Click **[Subscribe Now]** on any plan (e.g., ProLister)
2. Should redirect to: `/payment/checkout?plan=proLister`

### Step 2: Checkout Page
You'll see:
```
Order Summary
├─ Plan: ProLister
├─ Duration: 3 months
└─ Total: ₹1,500

[Pay ₹1,500 with Razorpay]
```

✅ Click the Razorpay button

### Step 3: Razorpay Gateway Opens
When the payment form appears, use **TEST card:**

```
Card Number:    4111111111111111
Expiry Month:   12
Expiry Year:    25 (or any future year)
CVV:            123
Cardholder:     Any name
```

### Step 4: Enter OTP
When asked for OTP:
```
OTP: 123456
```

Just enter any 6 digits - it's test mode!

### Step 5: Payment Success
You should see:
```
✅ "Payment successful"
✅ Redirects to dashboard
✅ Dashboard now shows:
   "✅ Active Plan: ProLister"
   "Expires: June 15, 2026"
```

### Step 6: Verify Upload Limit Changed
```
BEFORE payment:
└─ "Free Uploads: 0/2 used | Remaining: 2"

AFTER payment:
└─ "✅ Active Plan: ProLister | Expires: June 15, 2026"
   "Unlimited uploads!"
```

---

## ✓ SUCCESS CHECKLIST

**If all these work, you're READY for next phase!**

```
✓ Signup works
  └─ Owner account created
  └─ Redirects to dashboard
  
✓ Dashboard displays
  └─ Shows free upload limit (0/2)
  └─ Shows statistics
  └─ Shows empty properties
  
✓ Subscription page visible
  └─ 3 plans displayed
  └─ Subscribe buttons work
  
✓ Payment flow works
  └─ Razorpay form opens
  └─ Payment processes
  └─ Success message shows
  └─ Redirect works
  
✓ Subscription activates
  └─ Dashboard updates
  └─ Shows "Active Plan"
  └─ Shows expiry date
  └─ Upload limit is now unlimited
```

---

## 🐛 IF SOMETHING GOES WRONG

### Issue: "Razorpay not defined"
**Fix:** 
- Restart dev server: Press Ctrl+C then `npm run dev`
- Wait 10 seconds for rebuild

### Issue: "Payment button doesn't work"
**Fix:**
- Clear browser cache: Ctrl+Shift+Delete
- Refresh page: Ctrl+F5
- Check console: F12 → Console tab (any red errors?)

### Issue: "Razorpay form doesn't open"
**Fix:**
- Check AdBlock is off
- Check browser console for errors
- Try different browser (Chrome, Firefox)

### Issue: "Payment says failed"
**Fix:**
- Use EXACT test card: 4111111111111111
- Use expiry: 12/25
- Use CVV: 123
- Use any OTP: 123456

### Issue: "Subscription doesn't activate"
**Fix:**
- Refresh dashboard page
- Check browser console for errors
- Check that payment was successful

---

## 📊 AFTER SUCCESSFUL TEST

**Once payment test passes:**

1. ✅ Owner Phase core is WORKING!
2. Next: Integrate upload limit checks (20 min)
3. Then: Add interested button (20 min)
4. Finally: Full end-to-end test

**Total remaining work: ~60 minutes**

---

## 🎯 REPORT BACK

**Tell me:**

1. ✅/❌ Signup worked?
2. ✅/❌ Dashboard loaded?
3. ✅/❌ Saw subscription plans?
4. ✅/❌ Payment processed successfully?
5. ✅/❌ Subscription activated?

**If any ❌:**
- Describe what happened
- What error you saw
- Screenshot if possible

---

## 🚀 YOU'RE READY!

Dev server is running on: **http://localhost:3002**

Go test and let me know what happens! 💪
