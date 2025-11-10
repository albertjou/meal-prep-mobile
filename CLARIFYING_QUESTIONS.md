# 🔍 Critical Clarifying Questions

Before implementation can begin, we need answers to these questions:

## 🔴 High Priority (Blocking Implementation)

### 1. Authentication Endpoints
**Issue**: The Swagger API doesn't show authentication endpoints.

**Questions**:
- What are the exact endpoints for:
  - `POST /auth/login` (or similar)?
  - `POST /auth/logout` (or similar)?
  - `POST /auth/refresh` (or similar)?
- What is the request/response format for login?
  - Request: `{ email: string, password: string }`?
  - Response: `{ access_token: string, refresh_token: string, user: {...} }`?
- How is the auth token sent in requests?
  - Header: `Authorization: Bearer <token>`?
  - Other format?

**Impact**: Cannot implement authentication flow without this.

---

### 2. Meal Types (Lunch/Dinner)
**Issue**: The API meal schema doesn't have a `meal_type` field.

**Questions**:
- How are meal types represented?
  - Separate field: `meal_type: "lunch" | "dinner"`?
  - Implied by time: `time: "12:00"` vs `time: "18:00"`?
  - Separate endpoints: `/meals/lunch` and `/meals/dinner`?
  - Multiple meals per day with different types?

**Current API Schema**:
```yaml
meal:
  - id: integer
  - title: string
  - date: date
  - meal_plan_id: integer
  - chef_id: integer
  - not_eating_users: array
```

**Impact**: Cannot display lunch/dinner grid without knowing how to differentiate.

---

### 3. Week-based Meal Queries
**Issue**: `GET /meals` endpoint doesn't show query parameters.

**Questions**:
- How do we fetch meals for a specific week?
  - Query params: `GET /meals?meal_plan_id=1&start_date=2024-01-01&end_date=2024-01-07`?
  - Or: `GET /meal_plans/{id}/meals?week=2024-W15`?
  - Or: `GET /meal_plans/{id}/meals?start_date=2024-01-01`?
- What date format is expected? (ISO date: `YYYY-MM-DD`?)

**Impact**: Cannot fetch meals for the current week without knowing the query format.

---

### 4. `not_eating_users` Array Structure
**Issue**: Schema shows `not_eating_users: array` but doesn't specify contents.

**Questions**:
- What is the structure?
  - Array of user IDs: `[1, 2, 3]`?
  - Array of objects: `[{user_id: 1}, {user_id: 2}]`?
  - Array of user objects: `[{id: 1, name: "John"}, ...]`?

**Impact**: Cannot properly display attendance indicators.

---

### 5. Current User Endpoint
**Issue**: Need to identify the authenticated user.

**Questions**:
- Is there a `/me` or `/current_user` endpoint?
- Or do we decode the JWT token to get user ID?
- How do we get current user info after login?

**Impact**: Cannot determine current user context for permissions/display.

---

## 🟡 Medium Priority (Affects Features)

### 6. Meal Plan Sharing & Privacy
**Issue**: Requirements mention sharing via unique link, but API doesn't show endpoints.

**Questions**:
- What are the endpoints for:
  - Generating share link: `POST /meal_plans/{id}/share_link`?
  - Regenerating share link: `PATCH /meal_plans/{id}/share_link`?
  - Setting privacy: `PATCH /meal_plans/{id}` with `is_public: boolean`?
  - Joining via link: `POST /meal_plans/join?token=<share_token>`?
- What does the share link look like?
  - Format: `https://app.mealplanning.com/join/<token>`?

**Impact**: Cannot implement sharing feature.

---

### 7. Participant Invitation via Email
**Issue**: Requirements say participants are added via email.

**Questions**:
- Is there an invite endpoint: `POST /meal_plan_participants/invite`?
- Request format: `{ email: "user@example.com", meal_plan_id: 1 }`?
- What happens if user doesn't exist?
  - Auto-create user?
  - Return error?
  - Send invitation email?

**Impact**: Cannot implement "add participant by email" feature.

---

### 8. User & Meal Plan Settings
**Issue**: Requirements mention settings but API doesn't show specific fields.

**Questions**:
- **User Settings**:
  - `start_day_of_week`: `"sunday" | "monday"`?
  - Other settings?
- **Meal Plan Settings**:
  - `is_public`: boolean?
  - `share_token`: string?
  - `default_meal_types`: array?
  - Other settings?
- Are these part of the PATCH endpoints for user/meal_plan?

**Impact**: Cannot implement settings screens.

---

## 🟢 Low Priority (Nice to Have)

### 9. API Base URL Configuration
**Questions**:
- What are the base URLs for:
  - Development: `http://localhost:3000`?
  - Staging: `https://staging-api.mealplanning.com`?
  - Production: `https://api.mealplanning.com`?
- Should we use environment variables?

**Impact**: Can use defaults, but need for deployment.

---

### 10. Token Format & Storage
**Questions**:
- Token format: JWT? Custom format?
- Refresh token: Separate token or part of JWT?
- Token expiration: How long? (affects refresh logic)

**Impact**: Can implement with assumptions, but need for production.

---

### 11. Error Response Format
**Questions**:
- Standard error format: `{ errors: {...} }`?
- HTTP status codes: 400, 401, 403, 404, 422, 500?
- Validation errors: Nested structure?

**Impact**: Can handle generically, but better UX with specific handling.

---

## 📋 Assumptions Made (Can Proceed With)

1. **Token Storage**: Using Expo SecureStore for access + refresh tokens
2. **Color Assignment**: Auto-assign from predefined palette, store per user
3. **Week Format**: ISO week or date range (will use date range: start_date/end_date)
4. **Offline Caching**: Cache previous/current/next week using TanStack Query
5. **Styling**: Using Tamagui (as preferred in requirements)
6. **Date Format**: ISO date format (`YYYY-MM-DD`) for all dates

---

## 🎯 Recommended Next Steps

1. **Get API Answers**: Resolve all High Priority questions
2. **Test API Endpoints**: Verify endpoints work as expected
3. **Update Swagger**: Add missing endpoints to documentation
4. **Start Phase 1**: Begin foundation setup (can proceed in parallel)
5. **Iterate**: Build incrementally as answers come in

---

**Status**: ⏳ Waiting for API clarification before full implementation
