# 🔐 Toggle Condicional Basado en Permiso de Accesibilidad

## 🎯 Problema Identificado

La app **requiere OBLIGATORIAMENTE** el permiso de Accessibility Service para funcionar correctamente:

### ❌ Sin Accessibility Service:
- No puede detectar actividad del usuario en otras apps
- El timer no se resetea cuando el usuario interactúa
- La funcionalidad principal está rota
- Usuario puede pensar que la app funciona cuando realmente no

### ✅ Con Accessibility Service:
- Detecta actividad en todas las apps
- Timer se resetea correctamente
- Funcionalidad completa garantizada

## 📋 Solución Implementada

### 1. Toggle Deshabilitado Sin Permiso

El Switch ahora solo se puede activar cuando el permiso de accesibilidad está habilitado:

```typescript
<Switch
    // ...
    disabled={!accessibilityEnabled && !isMonitoring}
    value={isMonitoring}
/>
```

**Comportamiento:**
- ✅ Si **tiene** permiso → Toggle habilitado (puede activar)
- ❌ Si **NO tiene** permiso → Toggle deshabilitado (no puede activar)
- ✅ Si **ya está activo** → Siempre puede desactivar

### 2. Mensaje Claro al Usuario

El mensaje debajo del toggle refleja el estado actual:

```typescript
{isMonitoring
    ? t('monitoringActive')              // Verde: "Monitoreo activo"
    : accessibilityEnabled
        ? t('monitoringInactive')        // Gris: "Monitoreo desactivado"
        : t('accessibilityRequired')}    // Rojo: "⚠️ Se requiere permiso"
```

### 3. Verificación Continua del Permiso

La app verifica el estado del permiso cada 2 segundos:

```typescript
useEffect(() => {
    const interval = setInterval(() => {
        checkAccessibilityStatus();
    }, 2000); // Check every 2 seconds

    return () => clearInterval(interval);
}, [checkAccessibilityStatus]);
```

**Beneficio:** Si el usuario habilita el permiso en Settings, el toggle se habilita automáticamente sin necesidad de reiniciar la app.

### 4. No Inicia Servicio Sin Permiso

```typescript
const isAccessibilityEnabled = await checkAccessibilityStatus();

if (!isAccessibilityEnabled) {
    // Mostrar modal explicativo
    setAlertConfig({ /* ... */ });
    // NO iniciar el servicio
    return;
}

// Solo aquí inicia el servicio si tiene permiso
await InactivityService.start({ /* ... */ });
```

## 🎨 UI/UX

### Estados Visuales:

| Estado | Toggle | Mensaje | Color |
|--------|--------|---------|-------|
| **Sin permiso** | 🔒 Deshabilitado | "⚠️ Se requiere permiso de Accesibilidad para activar" | 🔴 Rojo |
| **Con permiso, inactivo** | ✅ Habilitado | "El monitoreo está desactivado" | ⚪ Gris |
| **Con permiso, activo** | ✅ Habilitado | "El monitoreo se está ejecutando en segundo plano" | 🟢 Verde |

### Estilos Agregados:

```typescript
statusMessageDisabled: {
    color: '#ef4444',  // Rojo para indicar problema
    fontWeight: fontWeights.medium,
},
```

## 📊 Flujos de Usuario

### Flujo 1: Usuario sin permiso intenta activar

```
Usuario toca el toggle (deshabilitado)
         ↓
❌ No pasa nada (toggle deshabilitado)
         ↓
Usuario ve mensaje: "⚠️ Se requiere permiso de Accesibilidad"
         ↓
Usuario puede leer FAQ para entender por qué
```

### Flujo 2: Usuario sin permiso toca en la zona del toggle

```
Usuario toca cerca del toggle
         ↓
Toggle sigue deshabilitado visualmente
         ↓
Mensaje rojo indica claramente el problema
         ↓
Usuario entiende que necesita habilitar el permiso
```

### Flujo 3: Usuario habilita el permiso

```
Usuario ve que el toggle está deshabilitado
         ↓
Lee mensaje: "⚠️ Se requiere permiso"
         ↓
Abre FAQ o hace tap en el toggle
         ↓
Se muestra modal explicativo con pasos
         ↓
Usuario presiona "Habilitar Accesibilidad"
         ↓
Se abre Settings del sistema
         ↓
Usuario habilita "SleepGuard"
         ↓
Vuelve a la app
         ↓
Después de máximo 2 segundos...
         ↓
✅ Toggle se habilita automáticamente
         ↓
Mensaje cambia a: "El monitoreo está desactivado"
         ↓
Usuario puede activar el toggle
         ↓
✅ Servicio inicia correctamente
```

### Flujo 4: Servicio ya activo, usuario desactiva permiso

```
Servicio está activo (toggle ON)
         ↓
Usuario va a Settings y desactiva permiso
         ↓
Después de 2 segundos en la app...
         ↓
accessibilityEnabled se actualiza a false
         ↓
Toggle SIGUE habilitado (porque isMonitoring = true)
         ↓
Usuario puede desactivar el servicio normalmente
         ↓
Una vez desactivado, toggle queda deshabilitado hasta que reactive el permiso
```

## 🔧 Cambios Técnicos

### Archivos Modificados:

1. **ConfigScreen.tsx**
   - Agregado estado `accessibilityEnabled` del hook
   - Toggle tiene `disabled` condicional
   - Mensaje con 3 estados en vez de 2
   - Verificación continua cada 2s

2. **ConfigScreen.styles.ts**
   - Nuevo estilo `statusMessageDisabled` (rojo)

3. **useInactivityMonitoring.ts**
   - `checkAccessibilityStatus` envuelto en `useCallback`
   - `startMonitoring` solo inicia servicio si tiene permiso
   - Retorna inmediatamente si no hay permiso

4. **es.ts / en.ts**
   - Nueva traducción: `accessibilityRequired`

## ✅ Garantías de Funcionalidad

Con estos cambios garantizamos:

1. **No hay falsos positivos**
   - ✅ Servicio SOLO se inicia si hay permiso
   - ✅ Usuario no puede pensar que funciona cuando no

2. **Feedback claro**
   - ✅ Usuario sabe POR QUÉ no puede activar
   - ✅ Mensaje descriptivo en español e inglés
   - ✅ Color rojo indica problema

3. **Detección automática**
   - ✅ Check cada 2 segundos
   - ✅ Toggle se habilita automáticamente al obtener permiso
   - ✅ No necesita reiniciar app

4. **Experiencia fluida**
   - ✅ Toggle deshabilitado visualmente cuando no se puede usar
   - ✅ Siempre puede desactivar si ya está activo
   - ✅ Modal explicativo guía al usuario

## 🧪 Testing

### Test Case 1: Sin permiso al abrir app

```bash
# 1. Desinstalar app
adb uninstall com.sukiyamero.sleepguard

# 2. Reinstalar
pnpm run android

# 3. Verificar:
# ✅ Toggle está deshabilitado (gris)
# ✅ Mensaje: "⚠️ Se requiere permiso de Accesibilidad"
# ✅ Mensaje en color rojo
# ✅ No se puede tocar el toggle
```

### Test Case 2: Habilitar permiso desde app

```bash
# 1. Tocar el toggle (deshabilitado)
# 2. Ver modal explicativo
# 3. Presionar "Habilitar Accesibilidad"
# 4. En Settings, habilitar "SleepGuard"
# 5. Volver a la app
# 6. Esperar 2 segundos

# ✅ Toggle se habilita automáticamente
# ✅ Mensaje cambia a "El monitoreo está desactivado"
# ✅ Color cambia a gris
```

### Test Case 3: Activar servicio con permiso

```bash
# 1. Con permiso habilitado
# 2. Tocar toggle para activar

# ✅ Toggle se activa
# ✅ Servicio inicia correctamente
# ✅ Mensaje: "El monitoreo se está ejecutando"
# ✅ Color verde
```

### Test Case 4: Desactivar permiso con servicio activo

```bash
# 1. Servicio activo (toggle ON)
# 2. Ir a Settings → Accesibilidad
# 3. Desactivar "SleepGuard"
# 4. Volver a app

# ✅ Toggle sigue habilitado (porque está activo)
# ✅ Se puede desactivar normalmente
# ✅ Después de desactivar, toggle queda deshabilitado
# ✅ Mensaje: "⚠️ Se requiere permiso"
```

## 📊 Comparación Antes vs Después

### Antes:
```
Usuario sin permiso
    ↓
Puede activar toggle ❌
    ↓
Servicio inicia pero NO funciona ❌
    ↓
Usuario piensa que funciona ❌
    ↓
Timer no se resetea ❌
    ↓
Mala experiencia ❌
```

### Después:
```
Usuario sin permiso
    ↓
NO puede activar toggle ✅
    ↓
Mensaje claro del problema ✅
    ↓
Habilita permiso correctamente ✅
    ↓
Toggle se habilita automáticamente ✅
    ↓
Servicio funciona correctamente ✅
    ↓
Buena experiencia ✅
```

## 🎯 Conclusión

**Antes:** App podía iniciarse sin Accessibility Service, dando la ilusión de que funcionaba cuando realmente no.

**Ahora:** App **requiere explícitamente** el permiso antes de permitir activar el servicio, garantizando que solo funcione cuando realmente pueda hacerlo.

**Resultado:**
- ✅ Funcionalidad garantizada
- ✅ Mejor experiencia de usuario
- ✅ Feedback claro y honesto
- ✅ Sin falsos positivos

## 🚀 Siguiente Paso

```bash
# Rebuild y probar
pnpm run android
```

Verifica que:
1. ✅ Sin permiso, toggle está deshabilitado
2. ✅ Mensaje rojo explica el problema
3. ✅ Al habilitar permiso, toggle se activa solo
4. ✅ Con permiso, todo funciona correctamente
