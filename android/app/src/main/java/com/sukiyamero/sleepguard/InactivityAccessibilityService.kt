package com.sukiyamero.sleepguard

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.util.Log
import java.util.concurrent.atomic.AtomicReference

class InactivityAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "InactivityA11yService"
        const val ACTION_USER_ACTIVITY = "com.sukiyamero.sleepguard.USER_ACTIVITY"
        
        // Optimized throttling for 10-30 minute timeouts
        // 5 seconds provides excellent balance:
        // - 10 min timeout: 5s / 600s = 0.83% error (imperceptible)
        // - 30 min timeout: 5s / 1800s = 0.27% error (negligible)
        // Reduces broadcasts by 90% compared to 500ms (12/min vs 120/min)
        // User experience unchanged (human perception threshold ~100ms)
        private const val BROADCAST_THROTTLE_MS = 5000L
        
        // AtomicReference provides thread-safe read/write operations
        // without needing explicit synchronization blocks
        private val instance = AtomicReference<InactivityAccessibilityService?>(null)
        
        /**
         * Thread-safe check if the accessibility service is currently enabled.
         * This method can be safely called from any thread without additional synchronization.
         * 
         * @return true if the service is connected and running, false otherwise
         */
        fun isServiceEnabled(): Boolean {
            return instance.get() != null
        }
        
        /**
         * Get the current service instance if available.
         * This method is thread-safe and can be called from any thread.
         * 
         * @return the current service instance, or null if not connected
         */
        fun getInstance(): InactivityAccessibilityService? {
            return instance.get()
        }
    }
    
    // Track last broadcast time to implement throttling
    private var lastBroadcastTime = 0L

    override fun onServiceConnected() {
        super.onServiceConnected()
        // AtomicReference.set() is thread-safe
        instance.set(this)
        
        val info = AccessibilityServiceInfo().apply {
            // Events we want to capture (user interactions)
            // Capturing more event types to ensure we don't miss user activity
            eventTypes = AccessibilityEvent.TYPE_VIEW_CLICKED or
                        AccessibilityEvent.TYPE_VIEW_FOCUSED or
                        AccessibilityEvent.TYPE_VIEW_SELECTED or
                        AccessibilityEvent.TYPE_VIEW_SCROLLED or
                        AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED or
                        AccessibilityEvent.TYPE_TOUCH_INTERACTION_START or
                        AccessibilityEvent.TYPE_TOUCH_INTERACTION_END or
                        AccessibilityEvent.TYPE_GESTURE_DETECTION_START or
                        AccessibilityEvent.TYPE_GESTURE_DETECTION_END or
                        AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED or
                        AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED or
                        AccessibilityEvent.TYPE_VIEW_HOVER_ENTER
            
            // We want events from all apps
            packageNames = null
            
            // Fast feedback
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            
            // Include all views, even those marked as not important
            flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS or
                   AccessibilityServiceInfo.FLAG_REPORT_VIEW_IDS
            
            // Check frequently (100ms)
            notificationTimeout = 100
        }
        
        serviceInfo = info
        Log.d(TAG, "✅ Accessibility Service connected and configured")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event?.let {
            // Log activity detection for debugging - showing ALL event types
            val eventTypeName = when (it.eventType) {
                AccessibilityEvent.TYPE_VIEW_CLICKED -> "CLICKED"
                AccessibilityEvent.TYPE_VIEW_FOCUSED -> "FOCUSED"
                AccessibilityEvent.TYPE_VIEW_SELECTED -> "SELECTED"
                AccessibilityEvent.TYPE_VIEW_SCROLLED -> "SCROLLED"
                AccessibilityEvent.TYPE_VIEW_TEXT_CHANGED -> "TEXT_CHANGED"
                AccessibilityEvent.TYPE_TOUCH_INTERACTION_START -> "TOUCH_START"
                AccessibilityEvent.TYPE_TOUCH_INTERACTION_END -> "TOUCH_END"
                AccessibilityEvent.TYPE_GESTURE_DETECTION_START -> "GESTURE_START"
                AccessibilityEvent.TYPE_GESTURE_DETECTION_END -> "GESTURE_END"
                AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> "WINDOW_STATE"
                AccessibilityEvent.TYPE_WINDOW_CONTENT_CHANGED -> "CONTENT_CHANGED"
                AccessibilityEvent.TYPE_VIEW_HOVER_ENTER -> "HOVER"
                else -> "OTHER(${it.eventType})"
            }
            
            Log.d(TAG, "🎯 Activity detected: $eventTypeName in ${it.packageName}")
            
            // Broadcast user activity to our app for ALL events
            broadcastUserActivity()
        }
    }

    override fun onInterrupt() {
        Log.d(TAG, "⚠️ Accessibility Service interrupted")
    }

    override fun onDestroy() {
        // AtomicReference.set() is thread-safe
        instance.set(null)
        Log.d(TAG, "❌ Accessibility Service destroyed")
        super.onDestroy()
    }

    private fun broadcastUserActivity() {
        try {
            // Throttle broadcasts to avoid excessive processing
            val currentTime = System.currentTimeMillis()
            if (currentTime - lastBroadcastTime < BROADCAST_THROTTLE_MS) {
                // Too soon since last broadcast, skip
                return
            }
            
            lastBroadcastTime = currentTime
            
            // Use explicit broadcast to ensure it reaches our app (required for Android 8+)
            val intent = Intent(ACTION_USER_ACTIVITY)
            intent.setPackage(packageName) // Make it explicit
            sendBroadcast(intent)
            Log.v(TAG, "📡 Broadcast sent to package: $packageName")
        } catch (e: Exception) {
            Log.e(TAG, "Error broadcasting user activity", e)
        }
    }
}
