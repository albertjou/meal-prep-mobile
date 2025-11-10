# REQUIREMENTS.md

## 🧭 Overview

We are building a **mobile-native collaborative meal-prep app** that connects to an **external API** for authentication and all server-side operations.  
The app will allow two or more users to collaboratively plan meals for the week, assign cooks, and mark attendance for each meal.

**Core Tech Stack:**

- **Frontend:** Expo (React Native) + TypeScript
- **Backend:** External API (Rails 8 or similar)
- **Data Layer:** Axios + TanStack Query
- **State Management:** Zustand
- **Styling:** Tamagui (preferred) or NativeWind
- **Navigation:** Expo Router
- **Storage:** Expo SecureStore
- **Testing:** Jest + React Native Testing Library

---

## 🍽️ Product Specification

### Purpose

Enable collaborative weekly meal planning between multiple participants.  
The app provides a simple, minimalist view of meals across the week and shows who is cooking and who will be eating each meal.

### Key Features

1. **API Integration**

   - Integrate with an external API that handles authentication, data persistence, and user management.
   - The app is client-only for logic and UI; all server-side functionality resides in the API.

2. **Minimalist Weekly Meal Display**

   - Display a grid of days (Monday–Sunday or configurable start day).
   - Two meal types: Lunch and Dinner (with potential expansion to others).
   - Each grid cell represents a meal for a specific day.

3. **Meal Cells**

   - Each cell displays the **meal name**.
   - The **text color corresponds to the person cooking** that meal.
   - A small **indicator icon** on the bottom right shows if participants are **eating** or **out** for that meal.
   - If **all participants are out**, the cell should remain **empty (no meal entry)**.

4. **Participant Management**

   - Add or remove participants via settings.
   - Each participant has a unique color assigned automatically or manually.
   - Support multiple users (2+).

5. **Settings**

   - Configure start-day-of-week (Sunday or Monday).
   - Add/remove participants.
   - Manage default meal types (Lunch/Dinner).

6. **Navigation**

   - Swipe or tap controls to navigate between weeks.
   - Persist week selection in local storage or memory until logout.

7. **Auth Flow**

   - Login and logout with API credentials.
   - Store auth tokens securely in Expo SecureStore.
   - Refresh token handling with automatic renewal.

8. **Offline Support**

   - Cached data for the current week persists locally for quick loading.
   - Read-only offline mode.

9. **Visual Design**
   - Clean, minimalist design with accent color per participant.
   - Light and dark mode supported.
   - Consistent typography and spacing system.
   - Use Tamagui (preferred) for UI components, animations

---

## 🧱 Architecture Summary

(Existing content retained — React Native + TypeScript + Expo + Query + Zustand structure.)

---

## 🧰 Development Standards

Code Quality
• ESLint + Prettier for formatting and linting.
• Follow Airbnb or Expo lint rules.
• Use consistent imports and alias paths (e.g. @/lib/api).

TypeScript
• Enable strict mode.
• Use Zod schemas for runtime validation of API responses.

Commits
• Conventional commits (e.g. feat: add login screen, fix: handle token refresh).

CI/CD
• EAS Build and Submit for iOS/Android deployment.
• OTA updates enabled for non-critical patches.

---

## 📈 Performance Targets

    •	App startup time < 2s (cold).
    •	60fps animations and transitions.
    •	Reduce re-renders via memoization and React Query caching.
    •	Lazy-load non-critical screens.

---

### 🔔 Notifications & Permissions

Push Notifications
• Use expo-notifications to register and send tokens to backend.
• Rails API stores Expo push tokens linked to users.
• Use Expo Push API or direct FCM/APNs integration.

Permissions
• Always request runtime permissions with context and rationale (e.g. notifications, file system).

---

## ✅ Quality Checklist

Before release:

- [ ] API integration tested (auth, CRUD for meals/participants)
- [ ] All API calls type-safe and validated.
- [ ] Weekly navigation verified
- [ ] Cell coloring and attendance indicators correct
- [ ] Settings persist correctly
- [ ] Offline caching functional
- [ ] Accessibility compliant
- [ ] Performance smooth (60fps)
- [ ] Light/dark themes verified
- [ ] Navigation transitions smooth
- [ ] Linting and formatting passed

---

**Author’s Note:**  
The app should feel **collaborative, lightweight, and joyful to use**, making it easy for multiple users to coordinate meal prep visually and intuitively.
