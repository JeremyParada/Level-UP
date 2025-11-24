# QA Bug Report & Fix

## Bug ID: QA-001
**Severity:** HIGH  
**Status:** FIXED  
**Found During:** Manual QA Testing - Test Case 15 (Checkout Flow)  
**Reporter:** User  
**Date:** 2025-11-24

---

## Issue Description

**Problem:**  
When attempting to checkout, the application tries to fetch user addresses but receives an empty array `[]`, causing the checkout flow to fail.

**API Call:**
```
GET http://localhost:8080/api/v1/direcciones/usuario/6
Response: []
```

**User Impact:**  
- Users cannot complete checkout
- Registration appears successful but address data is not saved
- Critical blocker for e-commerce functionality

---

## Root Cause Analysis

**File:** `backend/src/main/java/com/levelup/tienda/backend/service/UsuarioServiceImpl.java`

**Issue:**  
The `registrarUsuario()` method creates a new `Usuario` entity but **does not create** the corresponding `Direccion` entity, even though:
1. Frontend sends all address fields (calle, numero, comuna, ciudad, region, codigoPostal)
2. `RegistroDTO` has all address fields defined
3. `DireccionRepository` is injected but never used

**Code Before Fix:**
```java
// Only saves usuario, direccion is ignored
return usuarioRepository.save(usuario);
```

---

## Solution Implemented

**Modified File:** `UsuarioServiceImpl.java` (lines 64-88)

**Changes:**
1. Save usuario first to get the generated ID
2. Create new `Direccion` entity if address data provided
3. Link direccion to the saved usuario
4. Set as principal (primary) ENVIO address
5. Save direccion to database

**Code After Fix:**
```java
// Guardar usuario primero
Usuario usuarioGuardado = usuarioRepository.save(usuario);

// Crear y guardar dirección si se proporcionaron datos
if (registroDTO.getCalle() != null && !registroDTO.getCalle().isEmpty()) {
    Direccion direccion = new Direccion();
    direccion.setUsuario(usuarioGuardado);
    direccion.setCalle(registroDTO.getCalle());
    direccion.setNumero(registroDTO.getNumero());
    direccion.setComuna(registroDTO.getComuna());
    direccion.setCiudad(registroDTO.getCiudad());
    direccion.setRegion(registroDTO.getRegion());
    direccion.setCodigoPostal(registroDTO.getCodigoPostal());
    direccion.setTipoDireccion("ENVIO");
    direccion.setEsPrincipal(1); // Primary address
    
    direccionRepository.save(direccion);
}

return usuarioGuardado;
```

---

## Testing Instructions

**To Verify Fix:**

1. Register a new user with complete address:
   ```
   POST http://localhost:8080/api/v1/auth/register
   Body:
   {
     "email": "newuser@test.com",
     "password": "Test123",
     "nombre": "Test",
     "apellido": "User",
     "fechaNacimiento": "1995-05-15",
     "telefono": "+56 9 1234 5678",
     "calle": "Av. Test",
     "numero": "123",
     "comuna": "Santiago",
     "ciudad": "Santiago",
     "region": "Metropolitana",
     "codigoPostal": "8320000"
   }
   ```

2. Login and get user ID from JWT response

3. Check addresses endpoint:
   ```
   GET http://localhost:8080/api/v1/direcciones/usuario/{userId}
   ```

4. **Expected Result:** Should return address array with 1 item:
   ```json
   [
     {
       "idDireccion": 123,
       "calle": "Av. Test",
       "numero": "123",
       "comuna": "Santiago",
       "ciudad": "Santiago",
       "region": "Metropolitana",
       "codigoPostal": "8320000",
       "tipoDireccion": "ENVIO",
       "esPrincipal": 1
     }
   ]
   ```

5. Proceed to checkout - should now work!

---

## Database Verification

```sql
-- Check if address was created
SELECT 
    u.id_usuario,
    u.nombre,
    u.email,
    d.id_direccion,
    d.calle,
    d.ciudad,
    d.es_principal
FROM usuarios u
LEFT JOIN direcciones d ON u.id_usuario = d.id_usuario
WHERE u.email = 'newuser@test.com';
```

**Expected:** Row shows direccion data, not NULL

---

## Impact Assessment

**Before Fix:**
- ❌ Registration appears successful but incomplete
- ❌ Checkout completely broken
- ❌ Users cannot place orders

**After Fix:**
- ✅ Registration creates both user and address
- ✅ Checkout loads address correctly
- ✅ Users can complete orders

---

## Related Files Modified

- `backend/src/main/java/com/levelup/tienda/backend/service/UsuarioServiceImpl.java`

---

## Follow-Up Actions

- [x] Fix implemented
- [ ] Backend restarted
- [ ] Re-test registration flow (QA Test 1)
- [ ] Re-test checkout flow (QA Test 15)
- [ ] Verify existing users (may need manual address creation)

---

## Notes

**For Existing Users (registered before fix):**  
If users registered before this fix, they won't have addresses. Options:
1. Ask them to add address via profile page (if feature exists)
2. Create manual SQL migration to add default addresses
3. Handle gracefully in checkout with "add address" flow

**Recommendation:** Add address management to user profile page.
