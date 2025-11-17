package com.sukiyamero.sleepguard

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class ScreenStateModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var screenStateReceiver: BroadcastReceiver? = null
    private var isListening = false

    override fun getName(): String {
        return "ScreenStateModule"
    }

    private fun sendEvent(eventName: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, null)
    }

    @ReactMethod
    fun startListening() {
        if (isListening) {
            return
        }

        screenStateReceiver = object : BroadcastReceiver() {
            override fun onReceive(context: Context?, intent: Intent?) {
                when (intent?.action) {
                    Intent.ACTION_SCREEN_ON -> {
                        sendEvent("onScreenOn")
                    }
                    Intent.ACTION_USER_PRESENT -> {
                        // User unlocked the device
                        sendEvent("onUserPresent")
                    }
                    InactivityAccessibilityService.ACTION_USER_ACTIVITY -> {
                        // Accessibility service detected user activity
                        sendEvent("onAccessibilityActivity")
                    }
                }
            }
        }

        val filter = IntentFilter().apply {
            addAction(Intent.ACTION_SCREEN_ON)
            addAction(Intent.ACTION_USER_PRESENT)
            addAction(InactivityAccessibilityService.ACTION_USER_ACTIVITY)
        }

        // Android 13+ requires explicit export flag
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            reactApplicationContext.registerReceiver(
                screenStateReceiver,
                filter,
                Context.RECEIVER_NOT_EXPORTED
            )
        } else {
            reactApplicationContext.registerReceiver(screenStateReceiver, filter)
        }
        
        isListening = true
    }

    @ReactMethod
    fun stopListening() {
        if (!isListening || screenStateReceiver == null) {
            return
        }

        try {
            reactApplicationContext.unregisterReceiver(screenStateReceiver)
        } catch (e: Exception) {
            // Receiver might not be registered
        }

        screenStateReceiver = null
        isListening = false
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Required for NativeEventEmitter - no-op
        // Events are handled by the event emitter itself
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for NativeEventEmitter - no-op
        // Events are handled by the event emitter itself
    }

    override fun onCatalystInstanceDestroy() {
        stopListening()
        super.onCatalystInstanceDestroy()
    }
}
