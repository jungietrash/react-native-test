# 🤖 Project Context: Pocket Manager (Expo 54)

This file serves as the source of truth for AI Code Assistance. When generating code, refactoring, or debugging, adhere to the following architectural constraints and patterns.

---

## 🏗 Framework & Environment

- **Core:** React Native / Expo SDK 54 (Latest)
- **Routing:** Expo Router (File-based)
- **Language:** TypeScript (Strict Mode)
- **Target:** Responsive Hybrid (Mobile & Tablet optimized)

---

## 📐 Layout & UI Guidelines

- **Grid System:**
  - Mobile: 1 Column.
  - Tablet: 2 Columns (`numColumns={2}` or `flexWrap: 'wrap'`).
- **Max Width:** Content wrapper should be constrained to `1000px` for tablet/web legibility.
- **Theming:** Use `@/components/themed-text` and `@/components/themed-view` for auto-dark mode support.
- **Color Palette:**
  - Primary: `#007AFF` (iOS Blue)
  - Success: `#34C759` (iOS Green)
  - Danger: `#FF3B30` (iOS Red)
  - Background: `#F2F2F7` (System Gray)

---

## ⚙️ Logic & State Patterns

- **Functional State:** Always use functional updates to prevent stale data in asynchronous closures.
  ```typescript
  setItems((prev) =>
    prev.map((item) => (item.id === id ? { ...item, total: val } : item)),
  );
  ```
