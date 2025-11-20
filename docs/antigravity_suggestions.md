# Antigravity Suggestions & Implementation Plan

Based on the codebase review, the following items need to be addressed to clean up the project and prepare it for Phase 2.

## 1. Architecture & Structure
- [x] **Consolidate Stores**: Delete the duplicate `store/` directory at the project root. The source of truth should be `lib/store/`.
- [x] **Sync Auth Status**: Comment out the Axios interceptors in `lib/api/client.ts`. The documentation (`TODO_AUTHENTICATION.md`) states auth is bypassed, but the code currently has them enabled. This prevents errors while the backend is unavailable.

## 2. UI & Boilerplate Cleanup
- [x] **Clean Home Screen**: Replace the default Expo "Hello World" in `app/(tabs)/index.tsx` with a placeholder for the "Weekly Meal Grid".
- [x] **Remove Explore Tab**: Delete `app/(tabs)/explore.tsx` as it is not part of the product requirements.
- [x] **Update Tab Layout**: Remove the "Explore" tab configuration from `app/(tabs)/_layout.tsx`.
