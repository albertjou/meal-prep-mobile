# 🔐 Authentication TODO

## Status: Bypassed for Development

Authentication is currently **bypassed** in the API client to allow development to proceed without requiring auth endpoints. All API requests are made without authentication tokens.

## What Needs to be Implemented

### 1. API Client Authentication ✅ (Code Ready, Needs Re-enabling)
- [ ] Re-enable request interceptor to add auth tokens to requests
- [ ] Re-enable response interceptor for token refresh on 401 errors
- [ ] Test token refresh flow

**Location:** `lib/api/client.ts`
- Request interceptor is commented out (lines ~118-129)
- Response interceptor token refresh logic is commented out (lines ~151-203)

### 2. Auth API Endpoints ⏳ (Pending API Confirmation)
- [ ] Confirm login endpoint: `POST /auth/login`
- [ ] Confirm logout endpoint: `POST /auth/logout`
- [ ] Confirm refresh endpoint: `POST /auth/refresh`
- [ ] Confirm current user endpoint: `GET /auth/me` or `/users/me`
- [ ] Implement login function in `lib/api/auth.ts`
- [ ] Implement logout function in `lib/api/auth.ts`
- [ ] Implement getCurrentUser function in `lib/api/auth.ts`

**Location:** `lib/api/auth.ts`
- Functions are placeholders and throw errors
- Need actual endpoint URLs and request/response formats

### 3. Auth Store (Zustand) 📝 (Not Started)
- [ ] Create `store/auth-store.ts` with:
  - User state
  - Token state (access_token, refresh_token)
  - isAuthenticated flag
  - Login action
  - Logout action
  - Token refresh action
  - Initialize from SecureStore on app start

### 4. Auth Guard 📝 (Not Started)
- [ ] Create auth guard component/HOC
- [ ] Protect routes based on auth state
- [ ] Redirect to login if not authenticated
- [ ] Handle deep linking with auth state

**Location:** Should be added to `app/_layout.tsx` or create `components/auth-guard.tsx`

### 5. Login Screen 📝 (Not Started)
- [ ] Create login UI (email/password form)
- [ ] Handle login submission
- [ ] Show loading/error states
- [ ] Navigate to main app on success

**Location:** `app/(auth)/login.tsx` (needs to be created)

## How to Re-enable Authentication

1. **Uncomment the request interceptor** in `lib/api/client.ts`:
   ```typescript
   const token = await getAccessToken();
   if (token && config.headers) {
     config.headers.Authorization = `Bearer ${token}`;
   }
   ```

2. **Uncomment the response interceptor** token refresh logic in `lib/api/client.ts`

3. **Implement auth endpoints** in `lib/api/auth.ts` once API endpoints are confirmed

4. **Create auth store** in `store/auth-store.ts`

5. **Add auth guard** to protect routes

6. **Create login screen** for user authentication

## Current Behavior

- ✅ All API requests work without authentication
- ✅ No auth tokens are added to requests
- ✅ No token refresh logic is executed
- ✅ All auth-related code is preserved and commented for future use

## Related Documentation

- See `CLARIFYING_QUESTIONS.md` for pending API questions about auth endpoints
- See `IMPLEMENTATION_PLAN.md` Phase 2 for detailed auth implementation plan

---

**Last Updated:** 2024-11-10
**Status:** Authentication bypassed, ready for implementation when API endpoints are confirmed
