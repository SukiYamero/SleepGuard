# App State Permission Detection

## Overview
This document describes the intelligent permission detection system that monitors user behavior when they interact with the accessibility permission flow.

## Problem Statement
Users can interact with the permission modal in three ways:
1. ✅ **Enable Accessibility**: Opens Settings, user enables permission, returns to app
2. ❌ **Remind Later**: User explicitly declines, closes modal
3. ⚠️ **Settings Without Enable**: Opens Settings, user returns without enabling permission

Previously, scenarios #2 and #3 left the toggle in an inconsistent state (ON but non-functional).

## Solution Architecture

### Components

#### 1. AppState Listener
```typescript
AppState.addEventListener('change', async (nextAppState: AppStateStatus) => {
    // Detect when app comes to foreground
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // Check accessibility status when app returns to foreground
    }
});
```

**Purpose**: Detects when app transitions from background/inactive to active (foreground).

**When it triggers**:
- User returns from Settings app
- User switches back from any other app
- User unlocks phone with app in foreground

#### 2. Permission Verification on Foreground
```typescript
if (isMonitoring) {
    const isAccessibilityStillEnabled = await checkAccessibilityStatus();
    
    if (!isAccessibilityStillEnabled) {
        await InactivityService.stop();
        setIsMonitoring(false);
    }
}
```

**Logic**:
1. Only check if monitoring is currently enabled (toggle is ON)
2. Call native module to verify accessibility permission status
3. If permission NOT granted → stop service and turn toggle OFF
4. If permission granted → keep monitoring active

#### 3. "Remind Later" Button Handler
```typescript
onPress: () => {
    console.log('[Hook] User chose to remind later - stopping monitoring');
    setAlertConfig(prev => ({ ...prev, visible: false }));
    setIsMonitoring(false); // ← Explicitly turn toggle OFF
}
```

**Purpose**: Immediately set toggle to OFF when user explicitly declines.

## User Scenarios

### Scenario 1: Enable Accessibility Successfully
```
User taps toggle ON
    ↓
Modal shown (no permission detected)
    ↓
User taps "Enable Accessibility"
    ↓
Settings app opens
    ↓
User enables InactivityWatcher Accessibility Service
    ↓
User returns to app (AppState: background → active)
    ↓
AppState listener triggers
    ↓
checkAccessibilityStatus() → true
    ↓
✅ Toggle stays ON, monitoring continues
```

### Scenario 2: Remind Later (Explicit Decline)
```
User taps toggle ON
    ↓
Modal shown (no permission detected)
    ↓
User taps "Remind Later"
    ↓
setIsMonitoring(false) called immediately
    ↓
❌ Toggle turns OFF, modal closes
    ↓
User feedback: clear indication permission is required
```

### Scenario 3: Go to Settings Without Enabling
```
User taps toggle ON
    ↓
Modal shown (no permission detected)
    ↓
User taps "Enable Accessibility"
    ↓
Settings app opens
    ↓
User looks around but doesn't enable service
    ↓
User returns to app (AppState: background → active)
    ↓
AppState listener triggers
    ↓
Monitoring is ON, so check permission status
    ↓
checkAccessibilityStatus() → false
    ↓
await InactivityService.stop()
    ↓
setIsMonitoring(false)
    ↓
❌ Toggle turns OFF automatically
    ↓
Console log: "User returned without enabling accessibility"
```

### Scenario 4: App Switching (Non-Settings)
```
User has monitoring active with permission granted
    ↓
User switches to another app (WhatsApp, Browser, etc.)
    ↓
User returns to InactivityWatcher
    ↓
AppState listener triggers
    ↓
Monitoring is ON, check permission
    ↓
checkAccessibilityStatus() → true (still granted)
    ↓
✅ No action taken, monitoring continues
    ↓
Console log: "Accessibility is enabled - monitoring continues"
```

## Technical Details

### AppState States
- **active**: App is in foreground and focused
- **background**: App is running in background (not visible)
- **inactive**: Transitional state (e.g., during incoming call)

### Transition Detection
```typescript
appState.current.match(/inactive|background/) && nextAppState === 'active'
```

This catches:
- `background → active` (most common)
- `inactive → active` (after interruption)

### Why useRef for appState?
```typescript
const appState = useRef<AppStateStatus>(AppState.currentState);
```

- `useRef` preserves value across renders without causing re-renders
- Needed to compare previous state with next state
- Updated in listener: `appState.current = nextAppState`

### useEffect Dependencies
```typescript
useEffect(() => {
    // AppState listener
}, [isMonitoring, checkAccessibilityStatus]);
```

- **isMonitoring**: Need current toggle state to decide whether to check
- **checkAccessibilityStatus**: Wrapped in useCallback, stable reference

## Performance Considerations

### 1. Selective Checking
Only check accessibility when `isMonitoring === true`. If toggle is OFF, no need to verify permission.

### 2. No Polling
Unlike the 2-second polling in ConfigScreen (for UI updates), this uses event-driven detection via AppState listener. More efficient.

### 3. Early Return Pattern
```typescript
if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
    // Only execute when coming to foreground
}
```

Avoids unnecessary checks when app goes to background or stays in foreground.

### 4. Async/Await Handling
```typescript
const isAccessibilityStillEnabled = await checkAccessibilityStatus();
```

Native bridge call is async. Listener properly awaits result before making decisions.

## Logging Strategy

### Success Path
```
[Hook] App came to foreground - checking accessibility status
[Hook] Accessibility is enabled - monitoring continues
```

### Failure Path (Settings Without Enable)
```
[Hook] App came to foreground - checking accessibility status
[Hook] User returned without enabling accessibility - stopping monitoring
```

### Explicit Decline
```
[Hook] User chose to remind later - stopping monitoring
```

## Edge Cases Handled

### 1. Multiple Rapid App Switches
If user rapidly switches apps multiple times:
- Listener fires for each transition
- But only checks if `isMonitoring === true`
- If toggle already OFF, early exit (no wasted calls)

### 2. Permission Granted Mid-Flight
User enables permission while AppState listener is processing:
- checkAccessibilityStatus() will return latest state
- Race condition unlikely due to Android's permission UI blocking

### 3. Service Already Stopped
If service stopped by other means (notification tap, system kill):
- `isMonitoring` already false
- AppState listener won't trigger stop again
- Idempotent behavior

### 4. App Process Killed
If Android kills app process while in background:
- On restart, `isMonitoring` initializes from service state
- If service was running, toggle shows ON
- AppState listener will verify permission on next foreground

## Integration Points

### With useInactivityMonitoring Hook
- Hook owns `isMonitoring` state
- AppState listener in same hook scope
- Direct access to setIsMonitoring

### With InactivityService
- `InactivityService.stop()` is idempotent
- Safe to call even if already stopped
- Returns Promise (properly awaited)

### With ConfigScreen
- ConfigScreen doesn't need changes
- Toggle state managed by hook
- ConfigScreen just calls startMonitoring/stopMonitoring

### With AccessibilityService
- `checkAccessibilityStatus()` wrapped in useCallback
- Calls `AccessibilityService.isEnabled()`
- Returns boolean (permission granted or not)

## Testing Scenarios

### Manual Testing
1. **Remind Later Flow**:
   - Tap toggle ON → Modal appears → Tap "Remind Later" → Verify toggle goes OFF

2. **Settings Without Enable**:
   - Tap toggle ON → Modal appears → Tap "Enable Accessibility" → Don't enable → Return → Verify toggle goes OFF

3. **Successful Enable**:
   - Tap toggle ON → Modal appears → Tap "Enable Accessibility" → Enable service → Return → Verify toggle stays ON

4. **App Switching**:
   - With monitoring ON and permission granted → Switch to other app → Return → Verify toggle stays ON

### Expected Console Logs
```
// Scenario 1: Successful enable
[Hook] App came to foreground - checking accessibility status
[Hook] Accessibility is enabled - monitoring continues

// Scenario 2: Settings without enable
[Hook] App came to foreground - checking accessibility status
[Hook] User returned without enabling accessibility - stopping monitoring

// Scenario 3: Remind later
[Hook] User chose to remind later - stopping monitoring
```

## Benefits

### User Experience
✅ Toggle accurately reflects actual functionality state  
✅ No confusion about "why isn't it working?"  
✅ Clear feedback on permission requirements  
✅ Automatic correction of inconsistent state  

### Code Quality
✅ Event-driven (not polling-based)  
✅ Declarative state management  
✅ Proper async/await handling  
✅ Comprehensive logging for debugging  

### Maintenance
✅ Single source of truth (useInactivityMonitoring)  
✅ No scattered permission checks  
✅ Easy to understand flow  
✅ Well-documented behavior  

## Future Enhancements

### 1. Toast Notification
When auto-disabling toggle, show a subtle toast:
```typescript
Toast.show({
    type: 'info',
    text1: t('accessibility.permissionRequired'),
    text2: t('accessibility.enableToUseFeature'),
});
```

### 2. Telemetry
Track user behavior:
- How many users tap "Remind Later"
- How many go to Settings but don't enable
- Successful enable rate

### 3. Retry Prompt
After auto-disable, optionally show smaller prompt:
```typescript
if (!isAccessibilityStillEnabled) {
    // Show compact "Enable now?" button
}
```

### 4. Guided Setup
For Settings Without Enable scenario, detect specific page user is on (if possible) and provide contextual help.

## Conclusion

This implementation provides a robust, user-friendly solution to the permission detection challenge. It combines:
- **AppState monitoring** for lifecycle awareness
- **Native bridge calls** for accurate permission status
- **Declarative state management** for predictable behavior
- **Clear user feedback** for better UX

The result: users always know exactly what's happening, and the toggle accurately represents the app's actual state.
