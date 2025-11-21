# Theme System (Light/Dark Mode) - Test Cases & Documentation

## Overview

The theme system provides users with light and dark mode switching capabilities. The implementation uses:

- **Tailwind CSS** with dark mode support
- **localStorage** for persistent theme preference
- **View Transition API** for smooth animated theme switching
- **System preference detection** (prefers-color-scheme media query)
- **Responsive animations** that adapt to device capabilities

---

## Architecture

### Components

1. **ThemeToggle.tsx** (Wrapper)
   - Entry point for theme functionality
   - Handles SSR safety (no hydration mismatch)
   - Initializes theme on mount
   - Delegates UI to AnimatedThemeToggler

2. **AnimatedThemeToggler.tsx** (UI & Logic)
   - Renders toggle button with Sun/Moon icons
   - Handles theme switching with View Transition animation
   - Implements smart duration calculation based on device capabilities
   - Updates localStorage and DOM classList

3. **tailwind.config.js**
   - Enables dark mode with `class` strategy
   - Defines dark mode color schemes

### Storage & State

- **localStorage key**: `"theme"`
- **Values**: `"light"` or `"dark"`
- **CSS Class**: `.dark` on `<html>` element
- **Fallback**: System color scheme (prefers-color-scheme)

---

## Test Cases

### ✅ TC-1: Initial Load - Light Mode (Default)

**Preconditions:**
- Browser cache/localStorage is cleared
- System preference is Light mode (or not detected)
- First time visiting the application

**Steps:**
1. Navigate to the application
2. Wait for React hydration
3. Observe the DOM and UI

**Expected Results:**
- HTML element does NOT have `.dark` class
- Light mode colors are applied (light backgrounds, dark text)
- Sun icon is visible in theme toggle button (indicates dark mode available)
- localStorage has key `"theme"` with value `"light"`

**Pass Criteria:** ✓ Light mode applied correctly on first load

---

### ✅ TC-2: Initial Load - Dark Mode (System Preference)

**Preconditions:**
- Browser cache/localStorage is cleared
- System color scheme is set to Dark mode
- First time visiting the application

**Steps:**
1. Navigate to the application
2. Wait for React hydration
3. Observe the DOM and UI

**Expected Results:**
- HTML element has `.dark` class
- Dark mode colors are applied (dark backgrounds, light text)
- Moon icon is visible in theme toggle button (indicates light mode available)
- localStorage has key `"theme"` with value `"dark"`

**Pass Criteria:** ✓ Dark mode applied based on system preference

---

### ✅ TC-3: Toggle Theme - Light to Dark

**Preconditions:**
- Application is loaded in Light mode
- ThemeToggle button is visible

**Steps:**
1. Click the theme toggle button
2. Observe the transition animation
3. Wait for animation to complete (600-1400ms depending on device)
4. Check DOM and localStorage

**Expected Results:**
- View Transition animation displays (circular expansion from button)
- HTML element adds `.dark` class
- Dark mode colors are applied
- Moon icon changes to Sun icon
- localStorage `"theme"` value changes to `"dark"`
- Animation duration is appropriate for device (e.g., 600ms mobile, 1000ms desktop)

**Pass Criteria:** ✓ Smooth transition with correct final state

---

### ✅ TC-4: Toggle Theme - Dark to Light

**Preconditions:**
- Application is loaded in Dark mode
- ThemeToggle button is visible

**Steps:**
1. Click the theme toggle button
2. Observe the transition animation
3. Wait for animation to complete
4. Check DOM and localStorage

**Expected Results:**
- View Transition animation displays
- HTML element removes `.dark` class
- Light mode colors are applied
- Sun icon changes to Moon icon
- localStorage `"theme"` value changes to `"light"`

**Pass Criteria:** ✓ Smooth transition with correct final state

---

### ✅ TC-5: Persistence - Theme Preference Saved

**Preconditions:**
- User has toggled theme at least once
- localStorage contains theme preference

**Steps:**
1. Set theme to Dark mode (toggle button)
2. Close the application tab/window
3. Reopen the application in new tab/window
4. Observe initial state before animations

**Expected Results:**
- Application loads with previously selected Dark mode
- HTML element has `.dark` class on initial load
- No flash of wrong theme color (FOUC prevention)
- localStorage still contains `"dark"` value

**Pass Criteria:** ✓ Theme preference persists across sessions

---

### ✅ TC-6: Device-Responsive Animation Duration

**Test Case 6a: Mobile Device**

**Preconditions:**
- Using mobile device or emulated mobile browser (width < 1000px, RAM ≤ 3GB)

**Steps:**
1. Click theme toggle button
2. Measure animation duration

**Expected Results:**
- Animation completes in ~600-900ms (optimized for mobile)
- UI remains responsive during animation
- Animation is smooth without stuttering

**Pass Criteria:** ✓ Animation duration ≤ 900ms on mobile

---

**Test Case 6b: Desktop Device**

**Preconditions:**
- Using desktop browser (width > 1920px, RAM ≥ 8GB)

**Steps:**
1. Click theme toggle button
2. Measure animation duration

**Expected Results:**
- Animation completes in ~1000-1100ms (optimized for desktop)
- Smooth circular expansion animation
- Animation uses hardware acceleration

**Pass Criteria:** ✓ Animation duration 1000-1100ms on desktop

---

### ✅ TC-7: No Flash of Unstyled Content (FOUC)

**Preconditions:**
- Slow network connection simulated (DevTools Network throttling)
- User has Dark mode saved in localStorage

**Steps:**
1. Open DevTools Network tab
2. Set throttling to "Slow 4G"
3. Hard refresh the page (Ctrl+Shift+R)
4. Observe initial page load

**Expected Results:**
- No white flash visible before dark mode applies
- Dark mode is applied from the start
- CSS is properly loaded and applied
- All text remains visible (no FOUC)

**Pass Criteria:** ✓ No unstyled content flash

---

### ✅ TC-8: Header Component Theme Sync

**Preconditions:**
- Application is loaded with Header component visible
- Header contains ThemeToggle button

**Steps:**
1. Toggle theme from Light to Dark
2. Observe Header styling changes
3. Toggle theme back to Light
4. Observe Header styling returns

**Expected Results:**
- Header background changes from light to dark (#1e293b → #020617)
- Header text colors update (white maintained, opacity changes)
- Border colors update (#e0e7ff → #475569)
- All transitions use smooth 300ms duration

**Pass Criteria:** ✓ Header syncs with theme changes

---

### ✅ TC-9: Cart Menu Theme Sync

**Preconditions:**
- Cart icon is visible in Header
- Cart dropdown menu is open

**Steps:**
1. Open cart dropdown menu
2. Toggle theme to Dark
3. Observe cart menu styling
4. Toggle theme to Light
5. Observe cart menu styling

**Expected Results:**
- Cart menu background updates based on theme
- Text colors remain readable in both modes
- Border colors update appropriately
- Dropdown remains open and functional during theme switch

**Pass Criteria:** ✓ Cart menu colors update correctly

---

### ✅ TC-10: Account Menu Theme Sync

**Preconditions:**
- Account menu is visible
- User is logged in or account menu is accessible

**Steps:**
1. Open account dropdown menu
2. Toggle theme to Dark
3. Observe account menu styling
4. Hover over menu items

**Expected Results:**
- Account menu background: light (light mode) → dark (dark mode)
- Text colors update for readability
- Hover states are clearly visible in both themes
- Menu remains functional during theme transition

**Pass Criteria:** ✓ Account menu theme syncs correctly

---

### ✅ TC-11: Form Elements Theme Consistency

**Preconditions:**
- Login form is accessible
- Form contains input fields and buttons

**Steps:**
1. Navigate to login page
2. Toggle theme to Dark
3. Observe form styling
4. Click on input fields
5. Observe focus states

**Expected Results:**
- Input fields have appropriate background colors
- Text remains readable in both modes
- Focus ring appears in both light and dark modes
- Button styling updates to match theme
- Placeholder text is visible

**Pass Criteria:** ✓ Form elements adapt to theme changes

---

### ✅ TC-12: CSS Animations During Theme Toggle

**Preconditions:**
- Animations are enabled on the device
- ThemeToggle button is visible

**Steps:**
1. Toggle theme
2. Observe View Transition animation
3. Measure animation smoothness (60fps target)

**Expected Results:**
- View Transition API renders circular expansion
- Animation is smooth (no jank)
- Animation originates from button center
- Radius calculation is correct (~1400px)
- Animation respects device motion preferences

**Pass Criteria:** ✓ Animation renders smoothly at 60fps

---

### ✅ TC-13: localStorage Write Protection

**Preconditions:**
- Browser with localStorage disabled or in private mode
- Application is loaded

**Steps:**
1. Attempt to toggle theme
2. Check for console errors
3. Observe UI behavior

**Expected Results:**
- Theme toggle still works in UI
- No JavaScript errors logged
- localStorage.setItem() gracefully handles quota exceeded
- Theme persists only in current session (lost on refresh)

**Pass Criteria:** ✓ App gracefully degrades without localStorage

---

### ✅ TC-14: Multiple Tab Synchronization

**Preconditions:**
- Application is open in two browser tabs
- Both tabs are visible

**Steps:**
1. Toggle theme in Tab 1 to Dark
2. Observe Tab 2 after 1-2 seconds
3. Toggle theme in Tab 2 to Light
4. Observe Tab 1 after 1-2 seconds

**Expected Results (Ideal):**
- Both tabs show the same theme
- Storage event listeners can sync across tabs
- If tabs don't auto-sync, manual refresh shows correct theme

**Pass Criteria:** ✓ Theme is consistent across tabs (with refresh)

---

### ✅ TC-15: Accessibility - prefers-reduced-motion

**Preconditions:**
- Browser has `prefers-reduced-motion: reduce` enabled in OS settings
- ThemeToggle button is visible

**Steps:**
1. Set OS-level motion preference to "Reduce Motion"
2. Click theme toggle button
3. Observe animation behavior

**Expected Results:**
- Theme still toggles (functionality preserved)
- Animation duration is minimal or skipped (respects preference)
- App remains fully functional
- No animation-related WCAG violations

**Pass Criteria:** ✓ Respects motion preferences

---

### ✅ TC-16: Color Contrast - Dark Mode

**Preconditions:**
- Application is in Dark mode
- Various text elements are visible

**Steps:**
1. Use WCAG contrast checker or DevTools to verify contrast ratios
2. Check headings (H1, H2, etc.)
3. Check body text
4. Check buttons and links

**Expected Results:**
- All text has contrast ratio ≥ 4.5:1 (WCAG AA standard)
- Headings have contrast ratio ≥ 3:1 minimum
- Links are distinguishable from body text
- Disabled elements have sufficient contrast

**Pass Criteria:** ✓ All WCAG AA contrast ratios met

---

### ✅ TC-17: Color Contrast - Light Mode

**Preconditions:**
- Application is in Light mode
- Various text elements are visible

**Steps:**
1. Use WCAG contrast checker or DevTools
2. Check all text elements for contrast
3. Verify buttons and interactive elements

**Expected Results:**
- All text has contrast ratio ≥ 4.5:1 (WCAG AA)
- Links stand out from body text
- All interactive elements have sufficient contrast
- No readability issues

**Pass Criteria:** ✓ All WCAG AA contrast ratios met

---

### ✅ TC-18: Browser Compatibility - CSS Transitions

**Preconditions:**
- Testing on multiple browsers (Chrome, Firefox, Safari, Edge)

**Steps:**
1. Toggle theme in each browser
2. Observe transition smoothness
3. Check for any browser-specific issues

**Expected Results (Chrome/Edge):**
- View Transition API works smoothly
- Circular animation renders correctly

**Expected Results (Firefox):**
- May not support View Transition API
- Fallback to instant theme change
- No errors in console
- Theme toggle still functional

**Expected Results (Safari):**
- Verify dark mode class application
- Check CSS transitions work
- Ensure no layout shifts

**Pass Criteria:** ✓ Works across all major browsers

---

### ✅ TC-19: Performance - Theme Toggle Timing

**Preconditions:**
- DevTools Performance tab open
- ThemeToggle button visible

**Steps:**
1. Record performance during theme toggle
2. Measure paint timing
3. Check for layout thrashing
4. Verify no memory leaks

**Expected Results:**
- View Transition animation: 600-1400ms
- Paint time: < 50ms
- No layout recalculation loops
- Memory released after animation completes
- CPU usage returns to baseline

**Pass Criteria:** ✓ Animation completes without performance issues

---

### ✅ TC-20: Edge Case - Rapid Theme Toggling

**Preconditions:**
- ThemeToggle button is visible
- Application is responsive

**Steps:**
1. Rapidly click theme toggle button 5-10 times in quick succession
2. Observe animation behavior
3. Check final theme state
4. Check console for errors

**Expected Results:**
- Each click triggers animation
- Theme toggles correctly with each click
- Final state matches last click
- No console errors
- UI remains responsive (no freezing)
- localStorage reflects final state

**Pass Criteria:** ✓ Handles rapid toggling without issues

---

## Test Execution Environment

### Browser DevTools Setup

```javascript
// In Console - Verify theme state
document.documentElement.classList.contains('dark') // true/false
localStorage.getItem('theme') // "dark" or "light"

// Verify View Transition API support
document.startViewTransition // function (Chrome/Edge)

// Simulate network throttling
// DevTools → Network tab → Slow 3G / Slow 4G
```

### Test Data

| Device Type | Screen Width | RAM | Expected Duration | Test Case |
|-------------|-------------|-----|-------------------|-----------|
| Mobile | < 800px | ≤ 3GB | 600ms | TC-6a |
| Tablet | 800-1400px | 4GB | 900ms | TC-6b |
| Laptop | 1400-1920px | 8GB | 1000ms | TC-6b |
| Desktop 4K | > 1920px | ≥ 8GB | 900-1000ms | TC-6b |

---

## Automated Test Script (Jest)

See `tests/modules/theme-system.test.ts` for Jest test implementation.

### Running Tests

```bash
# Run all theme tests
npm test -- theme-system.test.ts

# Run specific test case
npm test -- theme-system.test.ts -t "TC-1"

# Run with coverage
npm test -- theme-system.test.ts --coverage
```

---

## Manual Testing Checklist

- [ ] TC-1: Initial Light Mode
- [ ] TC-2: Initial Dark Mode (System Preference)
- [ ] TC-3: Light to Dark Toggle
- [ ] TC-4: Dark to Light Toggle
- [ ] TC-5: Theme Persistence
- [ ] TC-6a: Mobile Animation Duration
- [ ] TC-6b: Desktop Animation Duration
- [ ] TC-7: No FOUC
- [ ] TC-8: Header Theme Sync
- [ ] TC-9: Cart Menu Theme Sync
- [ ] TC-10: Account Menu Theme Sync
- [ ] TC-11: Form Elements Theme
- [ ] TC-12: CSS Animation Smoothness
- [ ] TC-13: localStorage Fallback
- [ ] TC-14: Multi-tab Sync
- [ ] TC-15: Accessibility prefers-reduced-motion
- [ ] TC-16: Dark Mode Contrast
- [ ] TC-17: Light Mode Contrast
- [ ] TC-18: Cross-browser Compatibility
- [ ] TC-19: Performance Metrics
- [ ] TC-20: Rapid Toggling

---

## Known Issues & Limitations

1. **View Transition API** - Only supported in Chrome/Edge 111+
   - Fallback: Instant theme change without animation

2. **Multi-tab Sync** - localStorage doesn't auto-sync across tabs
   - Workaround: Listen to `storage` event for sync

3. **SSR** - Theme applied after hydration may cause flicker
   - Mitigation: Inline script in `<head>` to apply theme early

4. **prefers-reduced-motion** - Current implementation may not fully respect
   - Status: Should be enhanced to skip animation when preference set

---

## Future Improvements

- [ ] Add `storage` event listener for cross-tab synchronization
- [ ] Implement inline theme script in HTML head for zero FOUC
- [ ] Add support for `prefers-reduced-motion`
- [ ] Add theme transition config for customization
- [ ] Support for theme preview before applying
- [ ] Analytics for theme preference distribution

---

## References

- [Tailwind CSS Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API)
- [prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG 2.1 Contrast Requirements](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [Web.dev: Prefers Reduced Motion](https://web.dev/prefers-reduced-motion/)
