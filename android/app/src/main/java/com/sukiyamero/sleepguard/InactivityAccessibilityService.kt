package com.sukiyamero.sleepguard

import android.accessibilityservice.AccessibilityService
import android.accessibilityservice.AccessibilityServiceInfo
import android.content.Intent
import android.view.accessibility.AccessibilityEvent
import android.util.Log

class InactivityAccessibilityService : AccessibilityService() {

    companion object {
        private const val TAG = "InactivityA11yService"
        const val ACTION_USER_ACTIVITY = "com.sukiyamero.sleepguard.USER_ACTIVITY"
        
        @Volatile
        private var instance: InactivityAccessibilityService? = null
        
        fun isServiceEnabled(): Boolean {
            return instance != null
        }
    }

    override fun onServiceConnected() {
        super.onServiceConnected()
        instance = this
        
        val info = AccessibilityServiceInfo().apply {
            // Events we want to capture (user interactions)
            eventTypes = AccessibilityEvent.TYPE_VIEW_CLICKED or
                        AccessibilityEvent.TYPE_VIEW_FOCUSED or
                        AccessibilityEvent.TYPE_VIEW_SCROLLED or
                        AccessibilityEvent.TYPE_TOUCH_INTERACTION_START or
                        AccessibilityEvent.TYPE_TOUCH_INTERACTION_END or
                        AccessibilityEvent.TYPE_GESTURE_DETECTION_START or
                        AccessibilityEvent.TYPE_GESTURE_DETECTION_END or
                        AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED
            
            // We want events from all apps
            packageNames = null
            
            // Fast feedback
            feedbackType = AccessibilityServiceInfo.FEEDBACK_GENERIC
            
            // We don't need to interrupt anything
            flags = AccessibilityServiceInfo.FLAG_INCLUDE_NOT_IMPORTANT_VIEWS
            
            // Check frequently
            notificationTimeout = 100
        }
        
        serviceInfo = info
        Log.d(TAG, "✅ Accessibility Service connected and configured")
    }

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        event?.let {
            // Log activity detection for debugging
            when (it.eventType) {
                AccessibilityEvent.TYPE_VIEW_CLICKED -> {
                    Log.d(TAG, "🔵 User clicked something in ${it.packageName}")
                }
                AccessibilityEvent.TYPE_VIEW_SCROLLED -> {
                    Log.d(TAG, "🔵 User scrolled in ${it.packageName}")
                }
                AccessibilityEvent.TYPE_TOUCH_INTERACTION_START -> {
                    Log.d(TAG, "🔵 Touch interaction started")
                }
                AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED -> {
                    Log.d(TAG, "🔵 Window changed to ${it.packageName}")
                }
            }
            
            // Broadcast user activity to our app
            broadcastUserActivity()
        }
    }

    override fun onInterrupt() {
        Log.d(TAG, "⚠️ Accessibility Service interrupted")
    }

    override fun onDestroy() {
        instance = null
        Log.d(TAG, "❌ Accessibility Service destroyed")
        super.onDestroy()
    }

    private fun broadcastUserActivity() {
        try {
            val intent = Intent(ACTION_USER_ACTIVITY)
            sendBroadcast(intent)
        } catch (e: Exception) {
            Log.e(TAG, "Error broadcasting user activity", e)
        }
    }
}
