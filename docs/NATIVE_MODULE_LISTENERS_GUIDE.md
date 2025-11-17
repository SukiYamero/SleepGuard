# 📚 Guía: addListener y removeListeners en Módulos Nativos

## 🎯 ¿Cuándo son necesarios estos métodos?

Los métodos `addListener` y `removeListeners` son **SOLO necesarios** cuando tu módulo nativo:

1. ✅ Usa `NativeEventEmitter` en JavaScript
2. ✅ Emite eventos desde el módulo nativo hacia JavaScript
3. ✅ JavaScript escucha esos eventos con `.addListener()`

## 📊 Comparación de Módulos en SleepGuard

### ✅ ScreenStateModule - **SÍ los necesita**

#### Kotlin (Nativo):
```kotlin
class ScreenStateModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    private fun sendEvent(eventName: String) {
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, null)  // ← EMITE EVENTOS
    }
    
    // ✅ NECESARIOS porque el módulo emite eventos
    @ReactMethod
    fun addListener(eventName: String) {
        // Required for NativeEventEmitter
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Required for NativeEventEmitter
    }
}
```

#### TypeScript (JavaScript):
```typescript
import { NativeModules, NativeEventEmitter } from 'react-native';

// ✅ USA NativeEventEmitter
this.eventEmitter = new NativeEventEmitter(ScreenStateModule);

// ✅ ESCUCHA eventos
const screenOnListener = this.eventEmitter.addListener(
    'onScreenOn',
    callbacks.onScreenOn
);
```

**Razón:** El módulo **emite eventos** (`onScreenOn`, `onScreenOff`, etc.) que JavaScript escucha.

---

### ❌ NavigateToHomeModule - **NO los necesita**

#### Kotlin (Nativo):
```kotlin
class NavigateToHomeModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    @ReactMethod
    fun goToHome(promise: Promise) {
        // Ejecuta acción y devuelve resultado
        promise.resolve(true)  // ← DEVUELVE PROMISE, no emite eventos
    }
    
    // ❌ NO NECESARIOS - eliminados
}
```

#### TypeScript (JavaScript):
```typescript
import { NativeModules } from 'react-native';

const { NavigateToHomeModule } = NativeModules;

// ❌ NO usa NativeEventEmitter
// ✅ Solo llama al método directamente
const result = await NavigateToHomeModule.goToHome();
```

**Razón:** El módulo **NO emite eventos**, solo tiene un método que devuelve una Promise.

---

### ❌ AccessibilityModule - **NO los necesita**

#### Kotlin (Nativo):
```kotlin
class AccessibilityModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    @ReactMethod
    fun isAccessibilityServiceEnabled(promise: Promise) {
        promise.resolve(enabled)  // ← DEVUELVE PROMISE
    }

    @ReactMethod
    fun openAccessibilitySettings(promise: Promise) {
        promise.resolve(true)  // ← DEVUELVE PROMISE
    }
    
    // ❌ NO NECESARIOS - nunca los tuvo
}
```

#### TypeScript (JavaScript):
```typescript
import { NativeModules } from 'react-native';

const { AccessibilityModule } = NativeModules;

// ❌ NO usa NativeEventEmitter
// ✅ Solo llama a métodos directamente
const enabled = await AccessibilityModule.isAccessibilityServiceEnabled();
await AccessibilityModule.openAccessibilitySettings();
```

**Razón:** El módulo **NO emite eventos**, solo tiene métodos que devuelven Promises.

---

## 🔍 Regla Simple

### ✅ Necesitas addListener/removeListeners SI:

```typescript
// JavaScript
import { NativeEventEmitter } from 'react-native';

const emitter = new NativeEventEmitter(MiModulo);
emitter.addListener('miEvento', callback);
```

```kotlin
// Kotlin
reactApplicationContext
    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
    .emit("miEvento", data)
```

### ❌ NO necesitas addListener/removeListeners SI:

```typescript
// JavaScript - Solo llamadas a métodos
await MiModulo.miMetodo();
```

```kotlin
// Kotlin - Solo Promises
@ReactMethod
fun miMetodo(promise: Promise) {
    promise.resolve(resultado)
}
```

## 📝 Warning de React Native

Si tu módulo NO emite eventos pero tiene `addListener/removeListeners` vacíos, verás este warning:

```
new NativeEventEmitter() was called with a non-null argument without the required 
addListener method.
```

Esto confirma que esos métodos **no son necesarios** si no usas `NativeEventEmitter`.

## 🎯 Resumen de Cambios en SleepGuard

### Antes:
```kotlin
// NavigateToHomeModule.kt
@ReactMethod
fun addListener(eventName: String) {
    // Required for NativeEventEmitter compatibility ← INCORRECTO
}

@ReactMethod
fun removeListeners(count: Int) {
    // Required for NativeEventEmitter compatibility ← INCORRECTO
}
```

### Después:
```kotlin
// NavigateToHomeModule.kt
// ✅ Métodos eliminados porque no se usan
```

**Resultado:**
- ✅ Código más limpio
- ✅ Sin métodos innecesarios
- ✅ Sin warnings
- ✅ Más fácil de mantener

## 📚 Recursos

- [React Native Docs - Native Modules](https://reactnative.dev/docs/native-modules-android)
- [React Native Docs - Native Event Emitter](https://reactnative.dev/docs/native-modules-android#sending-events-to-javascript)

## ✅ Checklist para tus módulos

Cuando crees un nuevo módulo nativo, pregunta:

- [ ] ¿El módulo **emite eventos** hacia JavaScript?
  - ✅ SÍ → Agrega `addListener` y `removeListeners`
  - ❌ NO → No los agregues

- [ ] ¿JavaScript usa `NativeEventEmitter` con este módulo?
  - ✅ SÍ → Necesitas los métodos
  - ❌ NO → No los necesitas

- [ ] ¿Solo tiene métodos que devuelven Promises?
  - ✅ SÍ → No necesitas los métodos
  - ❌ NO (emite eventos) → Necesitas los métodos

## 🎉 Conclusión

**NavigateToHomeModule** ahora está más limpio sin métodos innecesarios. Solo incluye lo que realmente usa: un método `goToHome()` que devuelve una Promise.
