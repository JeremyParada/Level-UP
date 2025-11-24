# QA Testing Results - Level-UP Gamer Store

**Test Date:** 2025-11-24  
**Tester:** AI Assistant  
**Environment:** Local Development (localhost)  
**Backend:** Port 8080  
**Frontend:** Port 3000  

---

## QA Checklist Progress

- [ ] 1. User registration works (email validation, age check)
- [ ] 2. Login/logout functions correctly
- [ ] 3. Products display with images
- [ ] 4. Cart calculations are accurate
- [ ] 5. Discount codes apply correctly (DUOC20)
- [ ] 6. DuocUC email discount triggers automatically
- [ ] 7. Product search and filtering works
- [ ] 8. Product details load correctly
- [ ] 9. Reviews can be submitted
- [ ] 10. Community events page loads
- [ ] 11. Responsive design works on mobile/tablet
- [ ] 12. All images display (or show placeholder)
- [ ] 13. Navigation works across all pages
- [ ] 14. LocalStorage persists cart data
- [ ] 15. Protected routes require authentication

---

## Detailed Test Results

### Test 1: User Registration
**Status:** PENDING  
**Test Data:**
- Email: test.qa@duoc.cl
- Password: TestPassword123
- Age: 29 years old (DOB: 1995-05-15)

**Results:**
- [ ] Email validation works
- [ ] Age validation (18+) works
- [ ] Password confirmation works
- [ ] Form submits successfully
- [ ] User created in database
- [ ] DuocUC discount auto-applied

**Issues Found:** (will update)

---

### Test 2: Login/Logout
**Status:** PENDING

**Results:**
- [ ] Login with valid credentials works
- [ ] JWT token stored
- [ ] User name displays in navbar
- [ ] Logout clears session
- [ ] Redirect to home after login

**Issues Found:** (will update)

---

### Test 3: Products Display with Images
**Status:** PENDING

**Results:**
- [ ] Products load from API
- [ ] Images display correctly
- [ ] Placeholder shown for missing images
- [ ] Product grid renders properly

**Issues Found:** (will update)

---

### Test 4: Cart Calculations
**Status:** PENDING

**Test Scenario:**
- Add Product 1: $45,990 × 2
- Add Product 2: $35,990 × 1
- Expected Subtotal: $127,970
- Shipping: TBD (free if >$50k)

**Results:**
- [ ] Subtotal calculates correctly
- [ ] Quantity changes update totals
- [ ] Shipping calculated correctly
- [ ] Final total accurate

**Issues Found:** (will update)

---

### Test 5: Discount Code (DUOC20)
**Status:** PENDING

**Results:**
- [ ] DUOC20 code applies 20% discount
- [ ] Invalid codes rejected
- [ ] Discount reflected in total

**Issues Found:** (will update)

---

### Test 6: DuocUC Email Discount
**Status:** PENDING

**Test:**
- Create user with @duoc.cl email
- Check database for descuento_duoc flag

**Results:**
- [ ] Trigger sets descuento_duoc = 1
- [ ] Discount applies automatically in cart

**Issues Found:** (will update)

---

### Test 7: Product Search & Filtering
**Status:** PENDING

**Results:**
- [ ] Search bar filters products
- [ ] Category filter works
- [ ] Results update in real-time

**Issues Found:** (will update)

---

### Test 8: Product Details Load
**Status:** PENDING

**Results:**
- [ ] Detail page loads
- [ ] All product info displayed
- [ ] Add to cart works
- [ ] Quantity adjustment works

**Issues Found:** (will update)

---

### Test 9: Reviews Submission
**Status:** PENDING

**Results:**
- [ ] Review form appears
- [ ] Validation works (1-5 stars)
- [ ] Review saves
- [ ] Review displays

**Issues Found:** (will update)

---

### Test 10: Community Events Page
**Status:** PENDING

**Results:**
- [ ] Page loads
- [ ] Events display
- [ ] Images show

**Issues Found:** (will update)

---

### Test 11: Responsive Design
**Status:** PENDING

**Tested Viewports:**
- [ ] Mobile (375px)
- [ ] Tablet (768px)
- [ ] Desktop (1920px)

**Results:**
- [ ] Layout adapts correctly
- [ ] Navigation responsive
- [ ] All elements usable

**Issues Found:** (will update)

---

### Test 12: All Images Display
**Status:** PENDING

**Results:**
- [ ] Product images load
- [ ] Default placeholder works
- [ ] Event images load
- [ ] Logo displays

**Issues Found:** (will update)

---

### Test 13: Navigation Works
**Status:** PENDING

**Routes Tested:**
- [ ] / (Home)
- [ ] /productos (Products)
- [ ] /carrito (Cart)
- [ ] /login (Login)
- [ ] /registro (Register)
- [ ] /comunidad (Community)
- [ ] /perfil (Profile - protected)

**Issues Found:** (will update)

---

### Test 14: LocalStorage Persistence
**Status:** PENDING

**Results:**
- [ ] Cart persists on page reload
- [ ] User session persists
- [ ] Data survives browser refresh

**Issues Found:** (will update)

---

### Test 15: Protected Routes
**Status:** PENDING

**Results:**
- [ ] /perfil requires auth
- [ ] /checkout requires auth
- [ ] Redirects to login when not authenticated

**Issues Found:** (will update)

---

## Summary

**Tests Passed:** 0/15  
**Tests Failed:** 0/15  
**Tests Pending:** 15/15  

**Critical Issues:** None yet  
**Minor Issues:** None yet  

**Overall Status:** Testing in progress...
