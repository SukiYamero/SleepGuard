# 📊 Telemetría y Analytics - Roadmap Futuro

## 🎯 Objetivo

Implementar un sistema de telemetría para rastrear errores y comportamiento de la app sin comprometer la privacidad del usuario.

## 📋 Estado Actual (v1.0)

### ✅ Logging Local Implementado

**Logs actuales:**
```typescript
// Éxito
[NavigateToHome] ✅ Successfully navigated to home

// Fallos
[NavigateToHome] ❌ CRITICAL: Native module not available
[NavigateToHome] ❌ CRITICAL: Error navigating to home
[SleepGuard] ❌ CRITICAL: Failed to navigate to home screen!
```

**Características:**
- ✅ Logs prominentes con emojis
- ✅ Diferenciación entre errores críticos y warnings
- ✅ Información de contexto útil
- ✅ Notificación al usuario cuando falla navegación
- ✅ Sin envío de datos a backend (privacy-first)

### 🔍 Puntos de Fallo Identificados

1. **Módulo nativo no disponible**
   - Causa: App no rebuildeada después de cambios nativos
   - Detección: `if (!NavigateToHomeModule)`
   - Acción: Log + return false

2. **Error en navegación**
   - Causa: Sistema bloqueó el Intent, error de permisos, etc.
   - Detección: `catch` en goToHome()
   - Acción: Log + return false

3. **Fallo silencioso**
   - Causa: Promise resuelve pero navegación no ocurre
   - Detección: return value false
   - Acción: Log + notificación al usuario

## 🚀 Roadmap v2.0 - Sistema de Telemetría

### Opción 1: Analytics Local (Sin Backend)

**Ventajas:**
- ✅ No requiere backend
- ✅ No envía datos del usuario
- ✅ Privacidad 100%
- ✅ Implementación simple

**Implementación:**

```typescript
// src/services/AnalyticsService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ErrorStats {
    navigationFailures: number;
    moduleNotAvailable: number;
    systemErrors: number;
    lastError: string;
    timestamp: number;
}

class LocalAnalytics {
    private async logError(type: 'navigation' | 'module' | 'system', details: string) {
        const stats = await this.getStats();
        
        stats[`${type}Failures`]++;
        stats.lastError = details;
        stats.timestamp = Date.now();
        
        await AsyncStorage.setItem('error_stats', JSON.stringify(stats));
        
        // Si hay muchos errores, mostrar al usuario
        if (stats.navigationFailures > 5) {
            Alert.alert(
                'Navigation Issues Detected',
                'SleepGuard has failed to navigate to home multiple times. Please check app settings.',
                [{ text: 'View Stats', onPress: () => this.showStats() }]
            );
        }
    }
    
    async getStats(): Promise<ErrorStats> {
        const data = await AsyncStorage.getItem('error_stats');
        return data ? JSON.parse(data) : {
            navigationFailures: 0,
            moduleNotAvailable: 0,
            systemErrors: 0,
            lastError: '',
            timestamp: 0
        };
    }
}
```

**UI en Settings:**
```typescript
// ConfigScreen.tsx
const [errorStats, setErrorStats] = useState<ErrorStats | null>(null);

useEffect(() => {
    LocalAnalytics.getStats().then(setErrorStats);
}, []);

// Mostrar en UI
{errorStats && errorStats.navigationFailures > 0 && (
    <View style={styles.errorStatsCard}>
        <Text>⚠️ Navigation Errors: {errorStats.navigationFailures}</Text>
        <Text>Last Error: {errorStats.lastError}</Text>
        <Button title="Clear Stats" onPress={clearStats} />
    </View>
)}
```

### Opción 2: Analytics con Backend (Firebase, Sentry, etc.)

**Ventajas:**
- ✅ Tasa de error global
- ✅ Detección de patrones
- ✅ Alertas automáticas
- ✅ Análisis por versión/dispositivo

**Desventajas:**
- ❌ Requiere backend/servicio
- ❌ Posibles preocupaciones de privacidad
- ❌ Costos adicionales

**Implementación con Firebase Crashlytics:**

```typescript
// src/services/CrashlyticsService.ts
import crashlytics from '@react-native-firebase/crashlytics';

class CrashlyticsService {
    async logNavigationFailure(reason: string, details: any) {
        // Log no-fatal error
        await crashlytics().recordError(
            new Error(`Navigation Failure: ${reason}`),
            {
                details: JSON.stringify(details),
                timestamp: Date.now(),
            }
        );
        
        // Set custom attributes for grouping
        await crashlytics().setAttribute('navigation_module', 'enabled');
        await crashlytics().setAttribute('failure_reason', reason);
    }
    
    async logSuccess() {
        // Incrementar contador de éxito
        await crashlytics().log('Navigation to home successful');
    }
}
```

**Dashboard de Firebase mostraría:**
- Tasa de éxito/fallo de navegación
- Dispositivos/versiones más afectados
- Correlación con otras variables

### Opción 3: Híbrida (Local + Opt-in Backend)

**Mejor de ambos mundos:**

```typescript
// src/services/AnalyticsService.ts
class HybridAnalytics {
    private localAnalytics = new LocalAnalytics();
    private remoteAnalytics = new RemoteAnalytics();
    
    async logError(type: string, details: string) {
        // Siempre log local
        await this.localAnalytics.logError(type, details);
        
        // Solo enviar a backend si usuario aceptó
        const analyticsEnabled = await AsyncStorage.getItem('analytics_enabled');
        if (analyticsEnabled === 'true') {
            await this.remoteAnalytics.logError(type, details);
        }
    }
}
```

**Consent UI:**
```typescript
// FirstLaunch.tsx
<View>
    <Text>Help improve SleepGuard</Text>
    <Text>
        Send anonymous error reports to help fix issues.
        No personal data is collected.
    </Text>
    <Switch
        value={analyticsEnabled}
        onValueChange={setAnalyticsEnabled}
    />
</View>
```

## 🎯 Recomendación para v2.0

### Fase 1: Analytics Local (Implementar ya)

**Prioridad: ALTA**
**Esfuerzo: BAJO**
**Privacidad: PERFECTA**

```typescript
// Cambios mínimos necesarios:

// 1. Agregar contador local
private navigationFailureCount = 0;

// 2. Incrementar en cada fallo
if (!navigationSuccess) {
    this.navigationFailureCount++;
    await this.persistFailureCount();
}

// 3. Mostrar en logs
console.log(`[SleepGuard] Total navigation failures: ${this.navigationFailureCount}`);

// 4. Limpiar en éxito
if (navigationSuccess) {
    this.navigationFailureCount = 0;
}
```

**Beneficios inmediatos:**
- ✅ Usuario puede ver si hay problemas recurrentes
- ✅ Logs más informativos para debugging
- ✅ Base para futura telemetría
- ✅ Cero impacto en privacidad

### Fase 2: Opt-in Backend (v2.1+)

**Prioridad: MEDIA**
**Esfuerzo: MEDIO**
**Privacidad: BUENA (con consent)**

Implementar cuando:
- ✅ Tengas suficientes usuarios
- ✅ Necesites patrones globales
- ✅ Quieras alertas automáticas

## 📊 Métricas a Rastrear

### Críticas (v2.0):
- ✅ Tasa de fallo de navegación
- ✅ Tipo de error más común
- ✅ Frecuencia de errores

### Útiles (v2.1+):
- Tiempo promedio hasta inactividad
- Configuración de timeout más usada
- Veces que el servicio se detiene manualmente
- Activaciones de accessibility service

### Contexto (v2.2+):
- Versión de Android
- Modelo de dispositivo (solo para debugging)
- Versión de la app

## 🔐 Privacidad

### Principios:
1. **Local First**: Priorizar analytics local
2. **Opt-in**: Backend solo con consentimiento explícito
3. **Anónimo**: Nunca IDs persistentes
4. **Mínimo**: Solo errores críticos
5. **Transparente**: Usuario puede ver qué se envía

### No Rastrear:
- ❌ Identificadores de usuario
- ❌ Contenido de apps usadas
- ❌ Patrones de uso detallados
- ❌ Información personal

### Sí Rastrear (con consent):
- ✅ "Navigation failed" (sin detalles)
- ✅ Tipo de error (enum)
- ✅ Versión de app/OS (solo para debugging)

## 🛠️ Implementación Rápida (Ahora)

Mientras tanto, mejoramos los logs actuales:

```typescript
// ✅ YA IMPLEMENTADO
if (!navigationSuccess) {
    console.error('[SleepGuard] ❌ CRITICAL: Failed to navigate to home screen!');
    console.error('[SleepGuard] ❌ User may not see device lock as expected');
    
    await this.updateNotification(
        '⚠️ Navigation failed - Please check app permissions'
    );
}
```

**Esto nos da:**
- ✅ Visibilidad inmediata del problema
- ✅ Usuario es notificado del fallo
- ✅ Logs para debugging manual
- ✅ Base para futuro analytics

## 📝 Próximos Pasos

### Ahora (v1.0):
- [x] Logs prominentes con CRITICAL
- [x] Return value checking
- [x] Notificación al usuario en fallo
- [x] Documentación de telemetría futura

### v1.1 (Siguiente iteración):
- [ ] Contador local de errores en AsyncStorage
- [ ] Mostrar stats en Settings
- [ ] Botón "Report Issue" con logs

### v2.0 (Con backend):
- [ ] Implementar opt-in analytics
- [ ] Dashboard de errores
- [ ] Alertas automáticas
- [ ] A/B testing de fixes

## 🎉 Conclusión

**Estado actual:**
- ✅ Manejo de errores mejorado
- ✅ Logs prominentes
- ✅ Usuario notificado
- ✅ Listo para analytics futuro

**Siguiente paso:**
Esperar feedback de usuarios reales para decidir si necesitamos telemetría más compleja o los logs actuales son suficientes.

**Filosofía:**
> "Mide lo necesario, respeta la privacidad, mejora continuamente" 🎯
