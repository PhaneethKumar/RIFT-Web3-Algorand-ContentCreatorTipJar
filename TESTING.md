# Testing Guide 🧪

Complete testing checklist for the Content Creator Tip Jar platform.

## Quick Test (5 minutes)

### 1. Basic Setup
```bash
# Start local server
python -m http.server 8000
# OR
npm start
```

### 2. Landing Page Test
- [ ] Open http://localhost:8000
- [ ] Verify hero section displays
- [ ] Check all navigation links work
- [ ] Click "Browse Creators" button
- [ ] Click "Become a Creator" button

### 3. Wallet Connection Test
- [ ] Click "Connect Wallet" button
- [ ] Verify wallet address appears in button
- [ ] Check button turns green
- [ ] Verify address is shortened (e.g., ABCD...XYZ)

### 4. Profile Creation Test
- [ ] Navigate to "Become a Creator"
- [ ] Fill in all required fields:
  - Name: "Test Artist"
  - Category: "Artist"
  - Bio: "This is a test bio"
  - Avatar URL: https://via.placeholder.com/150
  - Portfolio: https://via.placeholder.com/400
- [ ] Click "Create Profile"
- [ ] Verify success message appears
- [ ] Verify redirect to profile page

### 5. Tipping Test
- [ ] On profile page, click "1 ALGO" button
- [ ] Verify success message appears
- [ ] Check tip appears in "Recent Tips"
- [ ] Verify total tips updated
- [ ] Check supporter count increased

## Comprehensive Test (30 minutes)

### Feature 1: Navigation
**Test all page links**
- [ ] Home → Creators
- [ ] Home → Dashboard
- [ ] Home → Become a Creator
- [ ] Creators → Individual Profile
- [ ] Profile → Dashboard
- [ ] Dashboard → Edit Profile

**Expected:** All links work, no 404 errors

### Feature 2: Wallet Connection
**Test wallet functionality**
- [ ] Connect wallet on index.html
- [ ] Navigate to different pages
- [ ] Verify wallet stays connected
- [ ] Check wallet address displays consistently
- [ ] Refresh page, verify wallet persists

**Expected:** Wallet connection persists across pages and refreshes

### Feature 3: Profile Creation
**Test profile form validation**
- [ ] Try submitting empty form → Should show error
- [ ] Fill only name → Should show error
- [ ] Fill all required fields → Should succeed
- [ ] Create profile without wallet → Should show error
- [ ] Create profile with wallet → Should succeed

**Test profile data**
- [ ] Create profile with all fields
- [ ] Verify data displays on profile page
- [ ] Check avatar loads correctly
- [ ] Verify portfolio images display
- [ ] Confirm category badge shows

**Expected:** Form validation works, all data displays correctly

### Feature 4: Tipping System
**Test preset amounts**
- [ ] Click "1 ALGO" → Verify transaction
- [ ] Click "5 ALGO" → Verify transaction
- [ ] Click "10 ALGO" → Verify transaction
- [ ] Click "25 ALGO" → Verify transaction

**Test custom amount**
- [ ] Enter 0.5 ALGO → Should work
- [ ] Enter 100 ALGO → Should work
- [ ] Enter negative amount → Should fail
- [ ] Enter text → Should fail
- [ ] Leave empty and click → Should show error

**Test without wallet**
- [ ] Clear localStorage
- [ ] Try to tip → Should show "connect wallet" error

**Expected:** All tip amounts work, validation prevents invalid inputs

### Feature 5: Dashboard
**Test dashboard display**
- [ ] Navigate to dashboard
- [ ] Verify all stats display:
  - Total tips received
  - Total supporters
  - Average tip
  - This month's tips
- [ ] Check profile info displays
- [ ] Verify wallet address shows
- [ ] Check "View Public Profile" link works

**Test dashboard data**
- [ ] Send multiple tips to yourself
- [ ] Refresh dashboard
- [ ] Verify stats update correctly
- [ ] Check tip history shows recent tips
- [ ] Verify leaderboard displays top supporters

**Expected:** Dashboard shows accurate, real-time data

### Feature 6: Leaderboard
**Test leaderboard functionality**
- [ ] Send tips from different "wallets" (clear localStorage between)
- [ ] Verify leaderboard ranks correctly
- [ ] Check amounts display properly
- [ ] Verify top 10 limit works
- [ ] Confirm addresses are formatted

**Expected:** Leaderboard ranks supporters by total amount

### Feature 7: Tip History
**Test history display**
- [ ] Send multiple tips
- [ ] Verify all tips appear
- [ ] Check timestamps are relative (e.g., "5m ago")
- [ ] Verify amounts display correctly
- [ ] Check addresses are formatted
- [ ] Confirm most recent tips show first

**Expected:** History shows all tips in reverse chronological order

### Feature 8: Creators Listing
**Test creator display**
- [ ] Create multiple creator profiles
- [ ] Navigate to Creators page
- [ ] Verify all creators display
- [ ] Check stats show for each creator
- [ ] Verify clicking card opens profile

**Test filtering**
- [ ] Select "Artist" category → Only artists show
- [ ] Select "Musician" category → Only musicians show
- [ ] Select "All Categories" → All show

**Test sorting**
- [ ] Sort by "Most Recent" → Newest first
- [ ] Sort by "Most Tips" → Highest tips first
- [ ] Sort by "Most Supporters" → Most supporters first

**Expected:** Filtering and sorting work correctly

### Feature 9: Embeddable Widget
**Test widget generation**
- [ ] Go to profile page
- [ ] Scroll to embed section
- [ ] Verify embed code displays
- [ ] Click "Copy Code" button
- [ ] Verify "Copied!" message appears

**Test widget functionality**
- [ ] Open widget.html directly
- [ ] Add ?creator=WALLET_ADDRESS to URL
- [ ] Verify creator name loads
- [ ] Test tip buttons work
- [ ] Check custom amount works

**Expected:** Widget generates and functions independently

### Feature 10: Responsive Design
**Test mobile view**
- [ ] Resize browser to 375px width
- [ ] Check all pages are readable
- [ ] Verify navigation works
- [ ] Test forms are usable
- [ ] Check buttons are tappable

**Test tablet view**
- [ ] Resize browser to 768px width
- [ ] Verify layout adjusts
- [ ] Check grid layouts work
- [ ] Test navigation

**Test desktop view**
- [ ] Resize browser to 1920px width
- [ ] Verify content is centered
- [ ] Check max-width constraints
- [ ] Test all features

**Expected:** Site works on all screen sizes

## Browser Compatibility Test

### Chrome/Edge
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct
- [ ] Performance good

### Firefox
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct
- [ ] Performance good

### Safari
- [ ] All features work
- [ ] No console errors
- [ ] Styling correct
- [ ] Performance good

## Performance Test

### Load Time
- [ ] Homepage loads < 2 seconds
- [ ] Profile page loads < 2 seconds
- [ ] Dashboard loads < 2 seconds
- [ ] Images load progressively

### Interaction Speed
- [ ] Button clicks respond instantly
- [ ] Form submissions are quick
- [ ] Page navigation is smooth
- [ ] No lag or freezing

## Data Persistence Test

### LocalStorage
- [ ] Create profile → Refresh → Data persists
- [ ] Send tip → Refresh → Tip shows
- [ ] Connect wallet → Refresh → Wallet connected
- [ ] Clear localStorage → All data gone

### Multiple Sessions
- [ ] Open in two browser tabs
- [ ] Create profile in tab 1
- [ ] Refresh tab 2 → Profile appears
- [ ] Send tip in tab 2
- [ ] Refresh tab 1 → Tip appears

## Edge Cases Test

### Empty States
- [ ] Dashboard with no profile → Shows message
- [ ] Profile with no tips → Shows "No tips yet"
- [ ] Leaderboard with no supporters → Shows message
- [ ] Creators page with no creators → Shows message

### Invalid Data
- [ ] Profile with missing avatar → Shows placeholder
- [ ] Profile with broken image URLs → Handles gracefully
- [ ] Invalid wallet address → Validation catches
- [ ] Extremely long bio → Displays properly

### Boundary Values
- [ ] Tip amount 0.001 ALGO → Works
- [ ] Tip amount 999999 ALGO → Works
- [ ] Bio with 1000 characters → Displays
- [ ] 100 portfolio items → Displays

## Security Test

### Input Validation
- [ ] Try XSS in name field → Sanitized
- [ ] Try SQL injection in bio → Sanitized
- [ ] Try script tags in URLs → Blocked
- [ ] Try invalid characters → Handled

### Data Exposure
- [ ] Check no private keys in localStorage
- [ ] Verify no sensitive data in console
- [ ] Check no API keys in code
- [ ] Verify wallet addresses only

## Accessibility Test

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Press Enter on buttons → Works
- [ ] Navigate forms with keyboard
- [ ] Escape closes modals (if any)

### Screen Reader
- [ ] All images have alt text
- [ ] Buttons have descriptive labels
- [ ] Forms have proper labels
- [ ] Headings are hierarchical

### Color Contrast
- [ ] Text is readable on backgrounds
- [ ] Links are distinguishable
- [ ] Buttons have sufficient contrast
- [ ] Error messages are visible

## Integration Test Scenarios

### Scenario 1: New Creator Journey
1. [ ] User visits site
2. [ ] Connects wallet
3. [ ] Creates profile
4. [ ] Views public profile
5. [ ] Checks dashboard
6. [ ] Copies embed code
7. [ ] Shares profile link

### Scenario 2: Supporter Journey
1. [ ] User visits site
2. [ ] Browses creators
3. [ ] Filters by category
4. [ ] Opens creator profile
5. [ ] Connects wallet
6. [ ] Sends tip
7. [ ] Views leaderboard position

### Scenario 3: Multi-Creator Test
1. [ ] Create 5 different profiles
2. [ ] Send tips between them
3. [ ] Check all dashboards
4. [ ] Verify leaderboards
5. [ ] Test filtering
6. [ ] Test sorting

## Automated Testing (Optional)

### Setup Jest
```bash
npm install --save-dev jest @testing-library/dom
```

### Sample Test
```javascript
// app.test.js
test('formatAddress shortens wallet address', () => {
  const address = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890ABCDEFGHIJKLMNOPQR';
  const formatted = window.tipJar.formatAddress(address);
  expect(formatted).toBe('ABCDEF...KLMNOPQR');
});

test('calculateTotalTips sums correctly', () => {
  const tips = [
    { amount: 1000000 },
    { amount: 5000000 },
    { amount: 10000000 }
  ];
  // Test implementation
});
```

## Bug Reporting Template

When you find a bug, document it:

```
**Bug Title:** Brief description

**Steps to Reproduce:**
1. Go to...
2. Click on...
3. Enter...
4. See error

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Browser:**
Chrome 120 / Firefox 121 / Safari 17

**Console Errors:**
Any error messages
```

## Testing Checklist Summary

### Critical Features (Must Work)
- [x] Wallet connection
- [x] Profile creation
- [x] Tipping functionality
- [x] Dashboard display
- [x] Data persistence

### Important Features (Should Work)
- [x] Creator listing
- [x] Filtering/sorting
- [x] Leaderboard
- [x] Tip history
- [x] Embed widget

### Nice-to-Have Features (Could Work)
- [x] Responsive design
- [x] Animations
- [x] Error messages
- [x] Loading states

## Performance Benchmarks

### Target Metrics
- Page load: < 2 seconds
- Time to interactive: < 3 seconds
- First contentful paint: < 1 second
- Lighthouse score: > 90

### Test with Lighthouse
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Run audit
4. Check scores:
   - Performance: > 90
   - Accessibility: > 90
   - Best Practices: > 90
   - SEO: > 90

## Final Verification

Before considering testing complete:

- [ ] All critical features work
- [ ] No console errors
- [ ] All pages load correctly
- [ ] Forms validate properly
- [ ] Data persists correctly
- [ ] Responsive on all devices
- [ ] Works in all browsers
- [ ] No security issues
- [ ] Accessible to all users
- [ ] Performance is acceptable

## Continuous Testing

As you develop:
1. Test after each feature addition
2. Regression test existing features
3. Test on multiple browsers regularly
4. Get user feedback
5. Fix bugs immediately
6. Document all issues
7. Retest after fixes

---

**Testing is crucial for quality! Don't skip it!** ✅

Remember: A well-tested application is a reliable application.
