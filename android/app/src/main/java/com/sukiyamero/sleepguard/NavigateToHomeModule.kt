package com.sukiyamero.sleepguard

import android.content.Intent
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import android.util.Log

class NavigateToHomeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "NavigateToHomeModule"

    override fun getName(): String {
        return "NavigateToHomeModule"
    }

    @ReactMethod
    fun goToHome(promise: Promise) {
        try {
            val intent = Intent(Intent.ACTION_MAIN)
            intent.addCategory(Intent.CATEGORY_HOME)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            
            reactApplicationContext.startActivity(intent)
            Log.d(TAG, "✅ Successfully navigated to home screen")
            promise.resolve(true)
        } catch (e: Exception) {
            Log.e(TAG, "❌ Error navigating to home screen", e)
            promise.reject("NAVIGATION_ERROR", "Failed to navigate to home screen: ${e.message}", e)
        }
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for NativeEventEmitter compatibility
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for NativeEventEmitter compatibility
    }
}
