# 🧪 Guía de Prueba - SleepGuard Foreground Service

## 📋 Checklist de Pruebas

### ✅ Prueba 1: Iniciar Servicio
**Objetivo:** Verificar que el servicio inicia correctamente y muestra la notificación

**Pasos:**
1. Abre la app SleepGuard en tu dispositivo
2. Observa el **slider** - ajústalo al tiempo deseado (ejemplo: 1 minuto para prueba rápida)
3. **Activa el toggle** (deslízalo hacia la derecha)
4. Verifica que el toggle se ponga verde ✅

**Resultado esperado:**
- 🛡️ Aparece notificación: "SleepGuard Active"
- 📝 El mensaje dice: "Monitoring inactivity (X min timeout)"
- 💚 El toggle se ve en color verde
- 📱 La app NO se cierra (el crash está resuelto)

**En los logs deberías ver:**
```
[SleepGuard] Starting service...
[SleepGuard] Service started successfully
```

---

### ✅ Prueba 2: Servicio en Background
**Objetivo:** Verificar que el servicio sigue funcionando cuando la app está en background

**Pasos:**
1. Con el servicio activo (toggle verde)
2. **Presiona el botón Home** de tu dispositivo
3. Abre otras apps
4. Baja la barra de notificaciones

**Resultado esperado:**
- ✅ La notificación "SleepGuard Active" sigue visible
- ⏱️ El tiempo restante se actualiza cada ~10 segundos
- 🔵 La notificación muestra un botón "⏸️ Stop"
- 🎯 El servicio NO se detiene

**En los logs deberías ver cada 10 segundos:**
```
[SleepGuard] Remaining: X.X min
```

---

### ✅ Prueba 3: Detección de Actividad
**Objetivo:** Verificar que el timer se resetea cuando usas el dispositivo

**Pasos:**
1. Con el servicio activo, configura 2 minutos
2. Espera 1 minuto sin tocar nada
3. **Abre la app SleepGuard** (o cualquier app)
4. Observa la notificación

**Resultado esperado:**
- 🔄 El contador debería volver a ~2.0 minutos
- ✅ El timer se ha reseteado al detectar actividad

**En los logs deberías ver:**
```
[SleepGuard] App state changed to: active
[SleepGuard] Timer reset
```

---

### ✅ Prueba 4: Timeout Alcanzado
**Objetivo:** Verificar qué pasa cuando se alcanza el tiempo de inactividad

**Pasos:**
1. Configura el slider a **1 minuto** (para prueba rápida)
2. Activa el toggle
3. **NO TOQUES el dispositivo** durante 1 minuto completo
4. Espera y observa

**Resultado esperado:**
- ⏰ Después de 1 minuto, debería aparecer un **Alert**
- 📝 Mensaje: "🏠 Inactivity Detected - Simulating home button press..."
- 🔄 El timer se resetea automáticamente
- ⏱️ La notificación vuelve a mostrar el tiempo completo

**En los logs deberías ver:**
```
[SleepGuard] Inactivity timeout reached!
[Hook] Inactivity detected! Should navigate to home...
[SleepGuard] Timer reset
```

**Nota:** Por ahora solo muestra un Alert. En futuros pasos implementaremos la presión real del botón Home.

---

### ✅ Prueba 5: Detener Servicio
**Objetivo:** Verificar que el servicio se puede detener correctamente

**Método A - Desde la app:**
1. Abre la app SleepGuard
2. **Desactiva el toggle** (deslízalo hacia la izquierda)

**Método B - Desde la notificación:**
1. Baja la barra de notificaciones
2. Presiona el botón **"⏸️ Stop"** en la notificación de SleepGuard

**Resultado esperado (ambos métodos):**
- ❌ La notificación desaparece
- 💔 El toggle se pone gris/desactivado
- 🛑 El servicio se detiene completamente

**En los logs deberías ver:**
```
[SleepGuard] Stopping service...
[SleepGuard] Service stopped successfully
```

---

### ✅ Prueba 6: Cambiar Timeout Mientras Corre
**Objetivo:** Verificar que se puede cambiar el tiempo mientras el servicio está activo

**Pasos:**
1. Inicia el servicio con 5 minutos
2. Con el servicio corriendo, **mueve el slider** a 10 minutos
3. Observa la notificación

**Resultado esperado:**
- 📝 La notificación se actualiza con el nuevo tiempo
- ✅ El timer se resetea con el nuevo valor
- 🔄 El servicio continúa sin interrupciones

**En los logs deberías ver:**
```
[SleepGuard] Timer reset
```

---

## 🐛 Qué Verificar en Caso de Problemas

### Si la app se cierra al activar el toggle:
```bash
# Ver logs de crash
adb logcat | grep -E "(AndroidRuntime|FATAL)"
```

### Si la notificación no aparece:
1. Verifica permisos de notificaciones en Settings → Apps → SleepGuard
2. Android 13+ requiere permiso explícito de notificaciones

### Si el servicio se detiene en background:
1. Ve a Settings → Apps → SleepGuard
2. Desactiva "Optimización de batería"
3. Permite ejecución en background

---

## 📊 Comandos Útiles para Debugging

```bash
# Ver todos los logs de SleepGuard
npx react-native log-android | grep SleepGuard

# Ver notificaciones activas
adb shell dumpsys notification | grep -A 10 "sleepguard"

# Ver estado de la app
adb shell dumpsys activity | grep -A 5 "sleepguard"

# Limpiar y reconstruir si hay problemas
cd android && ./gradlew clean && cd ..
pnpm android
```

---

## ✅ Checklist Final

Marca cada prueba completada:

- [ ] Prueba 1: Servicio inicia correctamente ✅
- [ ] Prueba 2: Funciona en background ✅
- [ ] Prueba 3: Detecta actividad y resetea timer ✅
- [ ] Prueba 4: Timeout alcanzado muestra alert ✅
- [ ] Prueba 5: Servicio se detiene correctamente ✅
- [ ] Prueba 6: Cambiar timeout mientras corre ✅

---

## 🎯 Próximos Pasos Después de Probar

Una vez que todas las pruebas pasen:

1. **Solicitar permisos en runtime** (notificaciones, batería)
2. **Implementar Accessibility Service** para presionar botón Home real
3. **Persistir configuración** en AsyncStorage
4. **Mejorar UI** con indicadores visuales del estado
5. **Agregar configuración avanzada** (vibración, sonido, etc.)

---

## 💡 Tips para Pruebas

- **Usa 1 minuto** para pruebas rápidas del timeout
- **Mantén los logs abiertos** para ver qué está pasando
- **Prueba con la pantalla apagada** para verificar wake lock
- **Reinicia la app** entre pruebas si algo se comporta raro

---

¿Todo funcionando? ¡Avísame qué resultado obtienes en cada prueba! 🚀
