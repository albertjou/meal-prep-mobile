# Implementation Plan - Meal Prep Mobile App

## 📋 Overview

This document outlines the implementation plan for the collaborative meal-prep mobile app based on the requirements and API documentation.

## 🔍 Clarifying Questions & Assumptions

### Critical Questions Requiring Answers:

1. **Authentication Endpoints**
   - The Swagger API doesn't show authentication endpoints (`/auth/login`, `/auth/logout`, `/auth/refresh`)
   - **Question**: What are the exact authentication endpoints and request/response formats?
   - **Assumption**: Will use standard REST auth endpoints (TBD)

2. **Meal Types (Lunch/Dinner)**
   - The API doesn't have a `meal_type` field in the meal schema
   - **Question**: How are meal types (lunch/dinner) represented? Is it:
     - A separate field in the meal model?
     - Implied by time/date?
     - A separate endpoint?
   - **Assumption**: May need to add `meal_type` field or use date/time to infer

3. **Week-based Meal Queries**
   - The API shows `GET /meals` but no query parameters for filtering by week
   - **Question**: How do we fetch meals for a specific week? Query params like `?meal_plan_id=1&start_date=2024-01-01&end_date=2024-01-07`?
   - **Assumption**: Will use query parameters for date range filtering

4. **`not_eating_users` Array Structure**
   - The schema shows `not_eating_users` as an array but doesn't specify the structure
   - **Question**: Is it an array of user IDs `[1, 2, 3]` or objects `[{user_id: 1}, {user_id: 2}]`?
   - **Assumption**: Array of user IDs `[1, 2, 3]`

5. **Meal Plan Sharing & Privacy**
   - Requirements mention sharing via unique link and privacy settings
   - **Question**: What are the API endpoints for:
     - Generating/regenerating share links?
     - Setting privacy (public/private)?
     - Joining via share link?
   - **Assumption**: These endpoints may be missing from Swagger or need to be added

6. **User Settings & Meal Plan Settings**
   - Requirements mention user settings and meal plan settings
   - **Question**: What specific settings exist? (start day of week, default meal types, etc.)
   - **Assumption**: Settings may be part of user/meal_plan PATCH endpoints

7. **Current User Context**
   - **Question**: How do we identify the current authenticated user? Is there a `/me` or `/current_user` endpoint?
   - **Assumption**: May need to decode JWT token or call a user endpoint with auth token

8. **Participant Management via Email**
   - Requirements say participants are added via email
   - **Question**: Is there an endpoint like `POST /meal_plan_participants/invite` that takes an email?
   - **Assumption**: May need to first look up user by email, then create participant

9. **API Base URL Configuration**
   - **Question**: What is the base URL for development/staging/production?
   - **Assumption**: Will use environment variables (`.env` files)

10. **Token Storage & Refresh**
    - **Question**: What is the token format? JWT? Where is refresh token stored?
    - **Assumption**: Will use Expo SecureStore for both access and refresh tokens

---

## 🏗️ Architecture Overview

### Tech Stack Confirmation
- ✅ **Frontend**: Expo (React Native) + TypeScript
- ✅ **Navigation**: Expo Router (already configured)
- ✅ **State Management**: Zustand (needs installation)
- ✅ **API Client**: Axios + TanStack Query (needs installation)
- ✅ **Styling**: Tamagui (preferred) or NativeWind (needs decision & installation)
- ✅ **Storage**: Expo SecureStore (needs installation)
- ✅ **Validation**: Zod (needs installation)
- ✅ **Testing**: Jest + React Native Testing Library (needs installation)

### Project Structure

```
/workspace
├── app/                          # Expo Router pages
│   ├── (auth)/                   # Auth flow (login)
│   │   ├── login.tsx
│   │   └── _layout.tsx
│   ├── (tabs)/                   # Main app tabs
│   │   ├── index.tsx             # Weekly meal grid (main screen)
│   │   ├── settings.tsx          # Settings screen
│   │   └── _layout.tsx
│   ├── meal-modal.tsx            # Meal edit modal (double tap)
│   └── _layout.tsx               # Root layout with auth guard
├── components/
│   ├── meal-grid/                # Meal grid components
│   │   ├── meal-cell.tsx         # Individual meal cell
│   │   ├── week-header.tsx       # Week navigation header
│   │   └── meal-grid.tsx         # Main grid component
│   ├── forms/                    # Form components
│   │   ├── meal-form.tsx         # Full meal form (modal)
│   │   └── participant-form.tsx  # Add participant form
│   └── ui/                       # Reusable UI components (Tamagui)
├── lib/
│   ├── api/                      # API client
│   │   ├── client.ts             # Axios instance with interceptors
│   │   ├── auth.ts               # Auth endpoints
│   │   ├── meals.ts              # Meal endpoints
│   │   ├── meal-plans.ts         # Meal plan endpoints
│   │   ├── participants.ts       # Participant endpoints
│   │   └── users.ts              # User endpoints
│   ├── schemas/                  # Zod schemas
│   │   ├── meal.ts
│   │   ├── user.ts
│   │   ├── meal-plan.ts
│   │   └── participant.ts
│   ├── hooks/                    # Custom hooks
│   │   ├── use-auth.ts           # Auth state & actions
│   │   ├── use-meal-plan.ts      # Current meal plan context
│   │   └── use-week-navigation.ts # Week navigation logic
│   └── utils/                    # Utilities
│       ├── date.ts               # Date/week utilities
│       ├── colors.ts             # Color assignment logic
│       └── cache.ts              # Offline caching
├── store/                        # Zustand stores
│   ├── auth-store.ts             # Auth state
│   ├── meal-plan-store.ts        # Current meal plan state
│   └── week-store.ts             # Current week state
├── constants/
│   ├── api.ts                    # API configuration
│   └── theme.ts                  # Theme constants (already exists)
└── docs/
    └── meal-prep-api.yaml        # API documentation
```

---

## 📦 Dependencies to Install

### Core Dependencies
```bash
# State Management
npm install zustand

# API & Data Fetching
npm install axios @tanstack/react-query

# Validation
npm install zod

# Storage
npx expo install expo-secure-store

# Styling (Tamagui - preferred)
npm install @tamagui/core @tamagui/config @tamagui/animations-react-native
# OR NativeWind (if Tamagui not chosen)
# npm install nativewind tailwindcss

# Notifications (for future)
npx expo install expo-notifications

# Date utilities
npm install date-fns
```

### Dev Dependencies
```bash
npm install --save-dev @types/node jest @testing-library/react-native @testing-library/jest-native
```

---

## 🎯 Implementation Phases

### Phase 1: Foundation & Setup
**Goal**: Set up core infrastructure and dependencies

1. **Install Dependencies**
   - Install all required packages
   - Configure Tamagui or NativeWind
   - Set up Jest and testing library

2. **Project Structure**
   - Create folder structure as outlined above
   - Set up path aliases in `tsconfig.json` (already has `@/*`)

3. **Environment Configuration**
   - Create `.env.example` and `.env` files
   - Set up `expo-constants` for environment variables
   - Configure API base URL

4. **API Client Setup**
   - Create Axios instance with base configuration
   - Set up request/response interceptors
   - Implement token refresh logic
   - Create API endpoint functions (skeleton)

5. **Zod Schemas**
   - Create schemas for all API models (User, Meal, MealPlan, Participant)
   - Set up validation utilities

### Phase 2: Authentication
**Goal**: Implement auth flow

1. **Auth Store (Zustand)**
   - Create auth store with state (user, tokens, isAuthenticated)
   - Implement login, logout, token refresh actions

2. **Secure Storage**
   - Implement token storage/retrieval using Expo SecureStore
   - Handle token expiration and refresh

3. **Auth API Client**
   - Implement login endpoint (once endpoint is confirmed)
   - Implement logout endpoint
   - Implement token refresh endpoint

4. **Auth Guard**
   - Create auth guard component/HOC
   - Protect routes based on auth state
   - Redirect to login if not authenticated

5. **Login Screen**
   - Create login UI (email/password form)
   - Handle login submission
   - Show loading/error states

### Phase 3: Core Data Models & State
**Goal**: Set up data models and state management

1. **Zustand Stores**
   - Meal plan store (current meal plan, participants)
   - Week navigation store (current week, week navigation)
   - Settings store (user preferences)

2. **TanStack Query Setup**
   - Configure QueryClient with cache settings
   - Set up query keys factory
   - Configure offline support (cache previous/current/next week)

3. **API Hooks**
   - Create React Query hooks for all endpoints
   - Implement optimistic updates where appropriate
   - Handle error states

### Phase 4: Weekly Meal Grid UI
**Goal**: Build the main meal grid interface

1. **Week Navigation**
   - Create week header component
   - Implement swipe gestures (left/right to change weeks)
   - Calculate week boundaries based on start day setting
   - Persist current week in local storage

2. **Meal Grid Component**
   - Create grid layout (7 days × 2 meal types)
   - Handle empty states
   - Implement responsive sizing

3. **Meal Cell Component**
   - Display meal name
   - Color code by chef (participant color)
   - Show attendance indicator (bottom right)
   - Handle tap for in-place editing
   - Handle double-tap for modal

4. **In-Place Editing**
   - Text input overlay for quick meal name editing
   - Save on blur/enter

5. **Meal Modal (Double Tap)**
   - Full form with meal name input
   - Dropdown for chef selection
   - Toggles for each participant (eating/out)
   - Save/cancel actions

### Phase 5: Meal Plan Management
**Goal**: Handle meal plan context and switching

1. **Meal Plan Selection**
   - If user has multiple meal plans, add selection UI
   - If single meal plan, auto-select
   - Store current meal plan in state

2. **Meal Plan Context**
   - Create context/hook for current meal plan
   - Load participants for current meal plan
   - Load meals for current week

### Phase 6: Participant Management
**Goal**: Manage participants (admin only)

1. **Participant List**
   - Display participants in settings
   - Show participant colors and names
   - Show access levels (admin/viewer)

2. **Add Participant**
   - Form to add participant by email
   - Handle user lookup/creation
   - Create meal plan participant

3. **Remove Participant**
   - Remove participant (admin only)
   - Handle leaving meal plan (non-admin)

4. **Color Assignment**
   - Auto-assign colors from palette
   - Ensure distinct colors
   - Store colors per user

### Phase 7: Settings
**Goal**: User and meal plan settings

1. **User Settings**
   - Start day of week (Sunday/Monday)
   - Theme preferences (light/dark)
   - Other user preferences

2. **Meal Plan Settings** (Admin only)
   - Meal plan title/description
   - Privacy settings (public/private)
   - Share link generation/regeneration
   - Default meal types

3. **Settings Persistence**
   - Save to API via PATCH endpoints
   - Cache locally for offline access

### Phase 8: Offline Support
**Goal**: Implement offline functionality

1. **Caching Strategy**
   - Cache previous week, current week, next week
   - Use TanStack Query cache
   - Persist cache to AsyncStorage

2. **Offline Detection**
   - Detect network status
   - Show subtle offline indicator (TODO: design)

3. **Offline Behavior**
   - Disable mutations when offline
   - Show cached data
   - Queue mutations for sync (future enhancement)

### Phase 9: Polish & Optimization
**Goal**: Performance and UX improvements

1. **Performance**
   - Optimize re-renders (React.memo, useMemo)
   - Lazy load screens
   - Optimize image loading

2. **Animations**
   - Smooth week transitions
   - Cell tap animations
   - Loading states

3. **Accessibility**
   - Add accessibility labels
   - Support screen readers
   - Keyboard navigation (web)

4. **Error Handling**
   - User-friendly error messages
   - Retry mechanisms
   - Offline error handling

### Phase 10: Testing
**Goal**: Comprehensive testing

1. **Unit Tests**
   - Utility functions
   - Zustand stores
   - API client functions

2. **Integration Tests**
   - API hooks
   - Component integration
   - Auth flow

3. **E2E Tests** (Future)
   - Critical user flows
   - Meal creation/editing
   - Participant management

---

## 🎨 Design Decisions

### Styling Library: Tamagui (Preferred)
- **Rationale**: Requirements prefer Tamagui, better performance, built-in animations
- **Alternative**: NativeWind if Tamagui proves problematic

### Color System
- **Approach**: Predefined palette of 8-12 distinct, accessible colors
- **Assignment**: Auto-assign colors to participants, ensure no duplicates
- **Storage**: Colors stored per user in API

### Week Identification
- **Format**: ISO week format or date range
- **Storage**: Store current week start date in local storage
- **Default**: Current week on app start

### Meal Type Handling
- **Current**: API doesn't have meal_type field
- **Solution**: Need to clarify with backend or add field
- **Temporary**: May use date/time or separate meals per type

---

## 🔐 Security Considerations

1. **Token Storage**: Use Expo SecureStore (encrypted storage)
2. **Token Refresh**: Automatic refresh before expiration
3. **API Security**: All requests include auth token in headers
4. **Input Validation**: Validate all inputs with Zod before API calls
5. **Error Handling**: Don't expose sensitive error details to users

---

## 📱 Platform-Specific Considerations

### iOS
- Use native navigation gestures
- Support safe area insets
- Handle keyboard avoidance

### Android
- Handle back button navigation
- Support edge-to-edge (already configured)
- Handle predictive back gesture

### Web
- Responsive design for different screen sizes
- Keyboard navigation support
- Browser storage fallback for SecureStore

---

## 🚀 Deployment Considerations

1. **EAS Build**: Set up EAS Build configuration
2. **Environment Variables**: Configure for dev/staging/prod
3. **OTA Updates**: Enable EAS Update for non-critical patches
4. **App Store**: Prepare for iOS App Store and Google Play Store

---

## ✅ Success Criteria

- [ ] User can log in and stay logged in
- [ ] Weekly meal grid displays correctly with proper colors
- [ ] Users can edit meals (tap and double-tap)
- [ ] Week navigation works smoothly (swipe)
- [ ] Participants can be added/removed (admin only)
- [ ] Settings persist correctly
- [ ] Offline mode works (read-only, cached data)
- [ ] App performs smoothly (60fps)
- [ ] Light/dark themes work
- [ ] All API calls are type-safe and validated

---

## 📝 Notes

- **API Gaps**: Several endpoints may be missing from Swagger (auth, sharing, settings)
- **Meal Types**: Need clarification on how lunch/dinner are represented
- **Week Queries**: Need to confirm query parameters for week-based meal fetching
- **Offline UI**: TODO item for subtle offline indicator design

---

## 🔄 Next Steps

1. **Get Answers**: Resolve all clarifying questions above
2. **Confirm API**: Verify all endpoints exist and work as expected
3. **Start Phase 1**: Begin with foundation setup
4. **Iterate**: Build incrementally, test frequently

---

**Last Updated**: Based on requirements.md and API documentation review
**Status**: Ready for clarification and implementation start
