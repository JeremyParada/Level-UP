# Manual QA Testing Checklist - Level-UP Gamer Store

**Frontend:** http://localhost:3000  
**Backend:** http://localhost:8080  
**Date:** _____________  
**Tester:** _____________  

Instructions: Go through each test systematically. Check the box when complete and note any issues.

---

## ✅ Test 1: User Registration
**Objective:** Verify email validation and age check

**Steps:**
1. Open http://localhost:3000
2. Click "Registrarse" button (top right)
3. Fill form with:
   - **Email:** `qatest@duoc.cl` ← Note: @duoc.cl for testing discount
   - **Contraseña:** `TestPass123`
   - **Confirmar Contraseña:** `TestPass123`
   - **Nombre:** `Pedro`
   - **Apellido:** `QA Testing`
   - **Fecha de Nacimiento:** `1995-05-15` (must be 18+)
   - **Teléfono:** `+56 9 1234 5678`
   - **Calle:** `Av. Test`
   - **Número:** `123`
   - **Comuna:** `Santiago`
   - **Ciudad:** `Santiago`
   - **Región:** `Metropolitana`
   - **Código Postal:** `8320000`
4. Click "Registrarse"

**Expected Result:**
- ✅ Form validates all fields
- ✅ Success message appears
- ✅ Redirect to login or home page

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 2: Login/Logout
**Objective:** Verify authentication works

**Steps:**
1. Go to http://localhost:3000/login
2. Enter:
   - **Email:** `qatest@duoc.cl`
   - **Contraseña:** `TestPass123`
3. Click "Iniciar Sesión"
4. Check top-right navbar for user name
5. Click "Cerrar Sesión"

**Expected Result:**
- ✅ Login succeeds
- ✅ User name shows in navbar
- ✅ Logout returns to home

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 3: Products Display with Images
**Objective:** Verify products load and images show

**Steps:**
1. Navigate to http://localhost:3000/productos
2. Observe product grid
3. Look for images on product cards
4. Check if missing images show placeholder

**Expected Result:**
- ✅ Products load from backend
- ✅ Images display (or default placeholder)
- ✅ Product names and prices show
- ✅ Grid layout looks good

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 4: Cart Calculations
**Objective:** Verify math is correct

**Steps:**
1. Go to http://localhost:3000/productos
2. Add "Mouse Gaming Pro" (qty: 2) to cart
3. Add "Catan" (qty: 1) to cart
4. Click cart icon (top right)
5. Verify totals:
   - Check subtotal matches sum of items
   - Note shipping (FREE if > $50,000, else $5,000)
   - Verify final total

**Expected Calculation Example:**
```
Mouse: $45,990 × 2 = $91,980
Catan: $35,990 × 1 = $35,990
───────────────────────────
Subtotal:        $127,970
Shipping (FREE):      $0
───────────────────────────
TOTAL:           $127,970
```

**Your Calculation:**
```
Item 1: $_____× ___ = $_________
Item 2: $_____× ___ = $_________
───────────────────────────
Subtotal:        $_________
Shipping:        $_________
───────────────────────────
TOTAL:           $_________
```

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 5: Discount Code (DUOC20)
**Objective:** Verify discount applies

**Steps:**
1. With items in cart (from Test 4)
2. Find "Código de descuento" input
3. Enter: `DUOC20`
4. Click "Aplicar"
5. Verify 20% discount appears
6. Try invalid code: `INVALID123`

**Expected Result:**
- ✅ "DUOC20" applies 20% discount
- ✅ Total reduces correctly
- ✅ Invalid codes show error message
- ✅ Discount shows in summary

**20% Discount Example:**
```
Subtotal: $127,970
Discount (20%): -$25,594
Total: $102,376
```

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 6: DuocUC Email Discount (Database Check)
**Objective:** Verify @duoc.cl trigger works

**Steps:**
1. Open Oracle SQL Developer
2. Connect to database
3. Run this query:
```sql
SELECT nombre, apellido, email, descuento_duoc 
FROM usuarios 
WHERE email = 'qatest@duoc.cl';
```
4. Check `descuento_duoc` column value

**Expected Result:**
- ✅ Query returns the user
- ✅ `descuento_duoc` = **1** (trigger worked!)

**Actual Result:** 
```
descuento_duoc = _____
```

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 7: Product Search & Filtering
**Objective:** Search and filter work

**Steps:**
1. Go to http://localhost:3000/productos
2. Use search bar, type: "mouse"
3. Clear search
4. Try category filter (select any category)
5. Verify products filter correctly

**Expected Result:**
- ✅ Search filters products by name
- ✅ Results update instantly
- ✅ Category filter works
- ✅ Can clear filters

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 8: Product Details Load
**Objective:** Detail page works

**Steps:**
1. From products page, click any product
2. Verify detail page loads
3. Try +/- quantity buttons
4. Click "Agregar al Carrito"
5. Check for success notification

**Expected Result:**
- ✅ Product details displayed
- ✅ Image shows
- ✅ Quantity adjusts (min 1, max 10)
- ✅ Add to cart works
- ✅ Cart count updates

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 9: Reviews Submission
**Objective:** Can submit reviews

**Steps:**
1. On product detail page, scroll to reviews
2. Fill review form:
   - **Calificación:** 5 stars
   - **Tu nombre:** `Pedro Testing`
   - **Comentario:** `Excelente producto!`
3. Click "Publicar Reseña"

**Expected Result:**
- ✅ Review form appears
- ✅ Validation works
- ✅ Review submits
- ✅ Success message shows

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 10: Community Events Page
**Objective:** Community page loads

**Steps:**
1. Navigate to http://localhost:3000/comunidad
2. Observe events displayed
3. Check if event images load

**Expected Result:**
- ✅ Page loads without errors
- ✅ Events display in cards
- ✅ Event info shows (name, date, location)
- ✅ Images or placeholders display

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 11: Responsive Design
**Objective:** Mobile/tablet compatibility

**Steps:**
1. With browser open, press **F12** (DevTools)
2. Click device toolbar icon or press **Ctrl+Shift+M**
3. Test these sizes:
   - **Mobile:** 375px width
   - **Tablet:** 768px width
   - **Desktop:** 1920px width
4. Navigate through: Home, Products, Cart
5. Check hamburger menu on mobile

**Expected Result:**
- ✅ Layout adapts to screen size
- ✅ Mobile menu works
- ✅ All buttons clickable
- ✅ No horizontal scroll
- ✅ Images scale properly

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 12: All Images Display
**Objective:** No broken images

**Steps:**
1. Browse all pages:
   - Home
   - Products
   - Product detail
   - Community
2. Note any broken images (red X or missing)
3. Verify default placeholder shows when needed

**Expected Result:**
- ✅ Product images load
- ✅ Logo displays
- ✅ Event images load
- ✅ Default placeholder works

**Actual Result:** _____________________________________________

**Broken Images Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 13: Navigation Works
**Objective:** All links functional

**Steps:**
Test each navigation link:
1. **Home** → http://localhost:3000/
2. **Productos** → http://localhost:3000/productos
3. **Comunidad** → http://localhost:3000/comunidad
4. **Carrito** → http://localhost:3000/carrito
5. **Login** → http://localhost:3000/login
6. **Registro** → http://localhost:3000/registro
7. **Perfil** (when logged in) → http://localhost:3000/perfil

**Expected Result:**
- ✅ All links navigate correctly
- ✅ No 404 errors
- ✅ Pages load properly

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 14: LocalStorage Persistence
**Objective:** Data survives reload

**Steps:**
1. Add items to cart (don't checkout)
2. Press **F12** → Console tab
3. Type: `localStorage.getItem('carrito')` and hit Enter
4. Note the output
5. Press **F5** to refresh page
6. Check if cart still has items

**Expected Result:**
- ✅ Cart data in localStorage
- ✅ Cart survives page refresh
- ✅ User session persists

**Console Output:** _____________________________________________

**Actual Result:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## ✅ Test 15: Protected Routes
**Objective:** Auth guards work

**Steps:**
1. Logout if logged in
2. Try to access: http://localhost:3000/perfil directly
3. Note what happens
4. Login
5. Try accessing /perfil again

**Expected Result:**
- ✅ Redirects to login when not authenticated
- ✅ Allows access after login
- ✅ Protected routes work

**Actual Result:** _____________________________________________

**Issues Found:** _____________________________________________

- [ ] **PASSED** | - [ ] **FAILED**

---

## 📊 Final Summary

**Total Tests:** 15  
**Passed:** _____ / 15  
**Failed:** _____ / 15  

**Critical Issues Found:**
_____________________________________________
_____________________________________________
_____________________________________________

**Minor Issues Found:**
_____________________________________________
_____________________________________________
_____________________________________________

**Overall Assessment:**
- [ ] **APPROVED** - Ready for production
- [ ] **NEEDS FIXES** - Address issues before deployment
- [ ] **MAJOR ISSUES** - Significant rework required

**Tester Signature:** _____________  
**Date:** _____________
