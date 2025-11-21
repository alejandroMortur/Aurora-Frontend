# Theme System Testing Guide

## 📋 Overview

Complete testing documentation for the Aurora Frontend Theme System (Light/Dark Mode).

This guide includes:
- **20 Manual Test Cases** with detailed steps and expected results
- **Jest Unit Tests** covering all theme functionality
- **Integration Tests** for complete user workflows
- **Performance Tests** for animation responsiveness
- **Accessibility Tests** for WCAG compliance

---

## 📂 Test Files

### Documentation

| File | Purpose |
|------|---------|
| `THEME_SYSTEM_TEST_CASES.md` | 20 detailed manual test cases with expected results |
| `README.md` (this file) | How to run and execute all tests |

### Automated Tests

| File | Description | Tests |
|------|-------------|-------|
| `theme-system.test.ts` | Unit tests for theme components | 40+ tests |
| `theme-system-integration.test.ts` | E2E style integration tests | 25+ tests |

---

## 🚀 Quick Start

### Prerequisites

```bash
# Node.js 16+ required
node --version

# Install dependencies
npm install
```

### Run All Theme Tests

```bash
# Run all theme-related tests
npm test -- theme-system

# Run with coverage report
npm test -- theme-system --coverage

# Run in watch mode (re-runs on file changes)
npm test -- theme-system --watch

# Run specific test suite
npm test -- theme-system.test.ts

# Run specific test case
npm test -- theme-system.test.ts -t "TC-1"
```

---

## 📝 Manual Test Execution

### Preparing for Manual Testing

1. **Clear Browser Data**
   ```javascript
   // Open DevTools Console and run:
   localStorage.clear();
   sessionStorage.clear();
   ```

2. **Open DevTools**
   - Press: `F12` or `Ctrl+Shift+I` (Windows/Linux) / `Cmd+Option+I` (Mac)
   - Go to Console tab to check for errors
   - Go to Network tab to simulate slow connections

3. **Set Network Throttling** (for TC-7 FOUC test)
   - DevTools → Network tab
   - Click "No throttling" dropdown
   - Select "Slow 3G" or "Slow 4G"

### Manual Test Checklist

Print and check off these as you test:

```
[ ] TC-1: Initial Light Mode
[ ] TC-2: Initial Dark Mode (System Preference)
[ ] TC-3: Light to Dark Toggle
[ ] TC-4: Dark to Light Toggle
[ ] TC-5: Theme Persistence
[ ] TC-6a: Mobile Animation Duration
[ ] TC-6b: Desktop Animation Duration
[ ] TC-7: No FOUC on Slow Network
[ ] TC-8: Header Theme Sync
[ ] TC-9: Cart Menu Theme Sync
[ ] TC-10: Account Menu Theme Sync
[ ] TC-11: Form Elements Theme
[ ] TC-12: CSS Animation Smoothness
[ ] TC-13: localStorage Fallback
[ ] TC-14: Multi-tab Sync
[ ] TC-15: Accessibility prefers-reduced-motion
[ ] TC-16: Dark Mode Contrast (WCAG AA)
[ ] TC-17: Light Mode Contrast (WCAG AA)
[ ] TC-18: Cross-browser Compatibility
[ ] TC-19: Performance Metrics
[ ] TC-20: Rapid Toggling
```

---

## 🧪 Detailed Test Sections

### Unit Tests (theme-system.test.ts)

Run unit tests:
```bash
npm test -- theme-system.test.ts
```

**Test Groups:**

1. **ThemeToggle Component**
   - Initial light mode rendering
   - System preference detection
   - Theme persistence
   - localStorage error handling

2. **AnimatedThemeToggler Component**
   - Light to dark toggle
   - Dark to light toggle
   - Device-responsive animation duration
   - View Transition API integration
   - Rapid toggle handling
   - Icon rendering

3. **localStorage Integration**
   - Reading theme from storage
   - Writing theme to storage
   - Invalid value handling

4. **DOM Class Management**
   - Adding/removing dark class
   - Class uniqueness

5. **System Preference Detection**
   - System dark mode detection
   - System light mode detection
   - localStorage override of system preference

6. **Integration Tests**
   - Full workflow: load → toggle → refresh
   - Component interaction

7. **Edge Cases & Error Handling**
   - Null/undefined values
   - Invalid theme values
   - Missing View Transition API support

8. **Performance Tests**
   - Animation completion time
   - Memory leak detection

---

### Integration Tests (theme-system-integration.test.ts)

Run integration tests:
```bash
npm test -- theme-system-integration.test.ts
```

**Test Scenarios:**

1. **User Scenarios**
   - New user defaults to light mode
   - User toggles to dark mode and returns (persistence)
   - Rapid theme toggling
   - System theme changes while app is open

2. **Component Interactions**
   - Header updates colors
   - Cart menu visibility in both themes
   - Account menu theme consistency

3. **Form Elements**
   - Input field readability
   - Button visibility

4. **Persistence Across Navigation**
   - Theme persists during page navigation
   - Theme survives page reload

5. **Performance Under Load**
   - Toggle performance with complex DOM (100+ elements)

6. **Edge Cases**
   - localStorage quota exceeded
   - Private browsing mode
   - Invalid theme values

7. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - Contrast ratios (WCAG AA)

---

## 📊 Test Coverage Report

Generate coverage report:
```bash
npm test -- theme-system --coverage
```

**Expected Coverage:**
- Statements: > 95%
- Branches: > 90%
- Functions: > 95%
- Lines: > 95%

View coverage HTML report:
```bash
# After running coverage, open:
# coverage/lcov-report/index.html
open coverage/lcov-report/index.html
```

---

## 🔍 Testing Specific Scenarios

### Test Mobile Device Animation Duration

```bash
# Run just the mobile duration test
npm test -- theme-system.test.ts -t "TC-6a"
```

**Manual Verification:**
1. Open DevTools → Responsive Design Mode (Ctrl+Shift+M)
2. Set to mobile size (e.g., iPhone 12: 390x844)
3. Click theme toggle
4. Animation should complete in ~600-900ms

### Test Desktop Device Animation Duration

```bash
# Run just the desktop duration test
npm test -- theme-system.test.ts -t "TC-6b"
```

**Manual Verification:**
1. Maximize browser window
2. Set to full HD or larger (1920x1080+)
3. Click theme toggle
4. Animation should complete in ~1000-1100ms

### Test No Flash of Unstyled Content (FOUC)

```bash
# Run FOUC test
npm test -- theme-system.test.ts -t "TC-7"
```

**Manual Verification:**
1. Set localStorage: `localStorage.setItem('theme', 'dark')`
2. Enable network throttling: DevTools → Network → Slow 4G
3. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
4. Watch page load - should NOT show white flash before dark mode
5. Dark mode should apply immediately

### Test Rapid Theme Toggling

```bash
npm test -- theme-system.test.ts -t "TC-20"
```

**Manual Verification:**
1. Click theme toggle rapidly 5-10 times
2. No errors should appear in console
3. Final theme should match last click
4. App should remain responsive
5. localStorage should reflect final state

---

## 🛠️ Debugging Tests

### Run Single Test with Verbose Output

```bash
npm test -- theme-system.test.ts -t "TC-3" --verbose
```

### Run Tests with Debugger

```bash
node --inspect-brk node_modules/.bin/jest theme-system.test.ts --runInBand
```

Then open `chrome://inspect` in Chrome.

### Check Console for Errors

During manual testing:
```javascript
// In DevTools Console, check for errors
console.log(localStorage.getItem('theme'));
console.log(document.documentElement.classList.contains('dark'));
```

---

## 🌐 Cross-Browser Testing

### Chrome / Edge
- ✅ Full View Transition API support
- ✅ Smooth circular animation
- ✅ All features work

### Firefox
- ⚠️ No View Transition API support (uses fallback)
- ✅ Theme still toggles instantly
- ✅ No visual animation, but fully functional

### Safari
- ⚠️ View Transition API not yet supported
- ✅ Theme toggle works
- ✅ CSS transitions apply correctly

### Test Matrix

| Browser | Version | View Transition | Animation | Notes |
|---------|---------|----------------|-----------|-------|
| Chrome | 111+ | ✅ Full | Circular | Recommended |
| Edge | 111+ | ✅ Full | Circular | Same as Chrome |
| Firefox | 115+ | ❌ None | Instant | Works fine |
| Safari | 16+ | ❌ None | Instant | Works fine |

---

## 📈 Performance Benchmarks

### Animation Duration Targets

| Device | Screen | RAM | Target Duration |
|--------|--------|-----|-----------------|
| iPhone SE | 375x667 | 3GB | 600-700ms |
| iPhone 14 | 390x844 | 4GB | 800-900ms |
| iPad Air | 1024x1366 | 4GB | 900-1000ms |
| MacBook Air | 1440x900 | 8GB | 1000-1100ms |
| Desktop 4K | 3840x2160 | 16GB | 900-1000ms |

### Paint & Render Times

```javascript
// In DevTools Performance tab:
// Expected metrics:
// - Paint time: < 50ms
// - Recalc styles: < 20ms
// - Layout: < 30ms
// - Composite: < 30ms
// Total: < 150ms for click → animation start
```

---

## ♿ Accessibility Verification

### WCAG AA Compliance Checks

#### Color Contrast Ratios

```javascript
// Test in both themes:
// Heading (H1, H2, etc): >= 3:1
// Body text: >= 4.5:1
// UI components: >= 3:1

// Use: WebAIM Contrast Checker
// https://webaim.org/resources/contrastchecker/
```

#### Keyboard Navigation

- [ ] Tab to theme toggle button
- [ ] Space/Enter to activate
- [ ] Focus visible on button
- [ ] Can access without mouse

#### Screen Reader

- [ ] Button has aria-label or text
- [ ] Icon is non-semantic (decorative)
- [ ] sr-only text says "Toggle theme"

#### Motion Preferences

```css
/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  /* Reduce animation duration */
  /* Or skip animation entirely */
}
```

---

## 📱 Mobile Testing

### iOS Safari

```bash
# Use actual device or simulator
# Test on iPhone 12, 14, or latest
```

Steps:
1. Open browser on iPhone
2. Navigate to app
3. Click theme toggle
4. Verify animation smoothness
5. Close and reopen app
6. Verify theme persists

### Android Chrome

Steps:
1. Connect Android device
2. Enable USB debugging
3. Open Chrome DevTools
4. Test as above

---

## 🔄 Continuous Integration

### GitHub Actions

Theme tests run automatically on:
- Every push to `main` or `main-ui-dark-light-system`
- Every pull request
- Daily schedule (midnight)

**Test Results:**
- View in "Actions" tab
- Check for failing tests
- Coverage report attached

### Pre-commit Hooks

```bash
# Install husky (if not done)
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test -- theme-system"
```

---

## 🐛 Common Issues & Troubleshooting

### Issue: Tests Fail with "localStorage is not defined"

**Solution:**
```javascript
// jest.config.js already has testEnvironment: 'jsdom'
// If still failing, ensure test uses:
/** @jest-environment jsdom */
```

### Issue: Animation Tests Fail

**Solution:**
```javascript
// Mock View Transition API in test setup:
document.startViewTransition = jest.fn((callback) => {
  callback();
  return {
    ready: Promise.resolve(),
    updateCallbackDone: Promise.resolve(),
    finished: Promise.resolve(),
  };
});
```

### Issue: "Cannot find module 'AnimatedThemeToggler'"

**Solution:**
```bash
# Ensure path alias is configured in tsconfig.json:
# "@/components": ["src/components"]
npm test -- --clearCache
```

### Issue: Manual Test Won't Show Animation

**Possible Causes:**
- Browser doesn't support View Transition API (Firefox, Safari)
- Animation disabled in system settings
- GPU acceleration disabled

**Solutions:**
- Use Chrome/Edge for full animation
- Check `prefers-reduced-motion` setting
- Enable hardware acceleration in browser settings

---

## 📚 Additional Resources

### Documentation Files

1. **THEME_SYSTEM_TEST_CASES.md** - Detailed test cases
2. **README.md** (this file) - Testing guide
3. **Source Code Comments** - Component documentation

### External References

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## ✅ Test Sign-Off

When all tests pass (both automated and manual), update this checklist:

- [ ] All 40+ unit tests passing
- [ ] All 25+ integration tests passing
- [ ] All 20 manual test cases passed
- [ ] Code coverage > 95%
- [ ] Cross-browser testing complete
- [ ] Accessibility verification complete
- [ ] Performance benchmarks met
- [ ] No console errors or warnings

---

## 📞 Support

For issues or questions about testing:
1. Check test file comments for detailed explanations
2. Review THEME_SYSTEM_TEST_CASES.md for scenario details
3. Check test failure messages for specific errors
4. Review component source code comments for implementation details

---

**Last Updated:** November 21, 2025
**Test Suite Version:** 1.0
**Status:** ✅ Complete & Ready for Testing
