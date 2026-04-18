# ⚡ Quick Action Items - Owner Phase

## 🔴 BLOCKING ISSUE (5 minutes)

### Add Razorpay Secret Key to .env.local

**This is REQUIRED for payment to work**

**Steps:**
1. Go to: https://dashboard.razorpay.com/app/dashboard
2. Click: Settings (bottom left)
3. Click: API Keys
4. Look for: "KEY SECRET" (test mode)
5. Copy the secret key
6. Send it to me or paste into `.env.local`:

```env
RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
```

**Example:**
```env
RAZORPAY_KEY_SECRET=abcd1234efgh5678ijkl9012mnop3456
```

Then restart dev server: `npm run dev`

---

## ✨ TESTING NOW (No secret needed yet)

**You can test these RIGHT NOW:**

### Test 1: Owner Signup
```
1. Go to http://localhost:3002/auth/signup
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Phone: 9876543210
   - Role: Property Owner ← Select this!
   - Password: Password123
3. Click [Create Account]
4. Should redirect to /dashboard/owner
5. Should show "2 free uploads" message
```

### Test 2: See Dashboard
```
1. You should be on Owner Dashboard
2. See:
   - Welcome message
   - "2/2 free uploads" or subscription status
   - Statistics cards (0 properties, 0 visitors)
   - [+ Add New Property] button
   - Empty properties list
```

### Test 3: Click Subscribe Button
```
1. Go to /subscription (or click [+ Add New Property] without uploads)
2. See 3 subscription plans
3. Click [Subscribe Now] on any plan
4. Should go to checkout page
5. See payment form (Razorpay button)
6. ⚠️ Without secret key, payment won't work yet
```

---

## 🎯 NEXT: These 3 Things

### AFTER Razorpay Secret Key Added:

**1. Test Real Payment (Razorpay test card)**
```
Card Number: 4111111111111111
Expiry: Any future date (e.g., 12/25)
CVV: 123
OTP: 123456

This will complete a TEST payment
Your subscription will activate
```

**2. Verify Subscription Activated**
```
After payment success:
- Should redirect to dashboard
- Should show "Subscription active until [date]"
- Upload limit should be unlimited
```

**3. Try Upload Property (optional for now)**
```
Click [+ Add New Property]
Form should appear
This will be fully tested after we add upload limit checks
```

---

## 📋 What's Ready to Use

✅ Owner can sign up
✅ Owner sees dashboard
✅ Owner can view subscription plans
✅ Razorpay payment form is built
✅ Payment verification is ready
✅ Upload limits logic is created
✅ Interested visitor tracking is created

⏳ Just need: Razorpay secret key + 2 integrations

---

## 🚀 Command to Restart Server

If you make changes to .env.local:

```powershell
# Kill current server
Ctrl+C

# Start again
npm run dev
```

---

## 💬 Ready?

**Tell me:**
1. Razorpay secret key (from your Razorpay dashboard)
2. If you tested signup → what happened?
3. If you tested checkout page → did it load?

Then I'll complete the last 20%! 🎉
