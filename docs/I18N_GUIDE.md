# 🌍 Guía de Internacionalización (i18n)

## ✅ Configuración Actual

La app ya está configurada con **detección automática de idioma**. El sistema detecta el idioma del dispositivo y cambia automáticamente.

### Idiomas soportados:
- 🇪🇸 **Español** (es)
- 🇺🇸 **Inglés** (en) - idioma por defecto

## 📁 Estructura de archivos

```
src/i18n/
├── i18n.config.ts        # Configuración principal
└── locales/
    ├── es.ts             # Español
    └── en.ts             # Inglés
```

## 🎯 Cómo funciona

### 1. Detección automática
```typescript
// El dispositivo está en español → La app se muestra en español
// El dispositivo está en inglés → La app se muestra en inglés
// El dispositivo está en francés → La app se muestra en inglés (fallback)
```

### 2. Uso en componentes

Para usar las traducciones en tus componentes:

```typescript
import { useTranslation } from 'react-i18next';

const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <Text>{t('appName')}</Text>
    // Resultado: "Inactivity Shield"
  );
};
```

### 3. Con variables

```typescript
<Text>{t('hintText', { minutes: 25 })}</Text>
// ES: "La app volverá al home después de 25 minuto(s) sin actividad."
// EN: "The app will return to home after 25 minute(s) of inactivity."
```

## ➕ Agregar un nuevo idioma

### Paso 1: Crear archivo de traducción

Crea `src/i18n/locales/pt.ts` (ejemplo portugués):

```typescript
export default {
  translation: {
    appName: 'Inactivity Shield',
    inactivityDetection: 'Detecção de\nInatividade',
    monitoringActive: 'O monitoramento está em execução em segundo plano.',
    // ... resto de traducciones
  },
};
```

### Paso 2: Registrar en configuración

Edita `src/i18n/i18n.config.ts`:

```typescript
import pt from './locales/pt';

i18n.use(initReactI18next).init({
  resources: {
    en,
    es,
    pt,  // ← Agregar aquí
  },
  // ...
});
```

¡Listo! El portugués ahora está disponible.

## 📱 Para Google Play Store

### Metadatos de la tienda (Google Play Console)

Cuando subas la app, Google Play te pedirá traducciones de:

1. **Nombre de la app**: "Inactivity Shield"
2. **Descripción corta** (80 caracteres):
   - 🇪🇸: "Protege la batería detectando inactividad y apagando automáticamente"
   - 🇺🇸: "Protects battery by detecting inactivity and auto-shutting down"

3. **Descripción completa** (4000 caracteres):
   ```
   🇪🇸 Español:
   Inactivity Shield protege la batería de tu dispositivo al detectar 
   periodos de inactividad y retornar automáticamente al home...
   
   🇺🇸 English:
   Inactivity Shield protects your device's battery by detecting
   periods of inactivity and automatically returning to home...
   ```

4. **Capturas de pantalla**: 
   - Necesitas capturas en cada idioma (opcional pero recomendado)
   - Mínimo 2, máximo 8 por idioma

### Países soportados por idioma

Con esta configuración, tu app funcionará correctamente en:

#### Español (es):
- 🇪🇸 España
- 🇲🇽 México
- 🇦🇷 Argentina
- 🇨🇴 Colombia
- 🇨🇱 Chile
- 🇵🇪 Perú
- Y todos los países de habla hispana

#### Inglés (en):
- 🇺🇸 Estados Unidos
- 🇬🇧 Reino Unido
- 🇨🇦 Canadá
- 🇦🇺 Australia
- 🇮🇳 India
- Y el resto del mundo (fallback)

## 🔄 Cambio manual de idioma (Opcional)

Si quieres permitir que el usuario cambie el idioma manualmente:

```typescript
import i18n from './src/i18n/i18n.config';

// Cambiar a español
i18n.changeLanguage('es');

// Cambiar a inglés
i18n.changeLanguage('en');
```

## ✅ Ventajas de este enfoque

1. ✅ **Automático**: Detecta el idioma del dispositivo
2. ✅ **Sin configuración extra**: Funciona inmediatamente
3. ✅ **Fallback inteligente**: Si un idioma no existe, usa inglés
4. ✅ **Fácil de extender**: Agregar idiomas es simple
5. ✅ **Google Play listo**: Cumple con los requisitos de la tienda

## 🚀 Idiomas recomendados para mayor alcance

Si quieres maximizar descargas, considera agregar:

1. 🇵🇹 **Portugués** (Brasil - gran mercado)
2. 🇫🇷 **Francés** (Francia, África)
3. 🇩🇪 **Alemán** (Alemania, Austria, Suiza)
4. 🇮🇹 **Italiano** (Italia)
5. 🇯🇵 **Japonés** (Japón)
6. 🇰🇷 **Coreano** (Corea del Sur)
7. 🇨🇳 **Chino** (China - requiere Google Play alternativa)

## 📝 Checklist para Google Play

- [x] Traducciones de la app implementadas (✅ ya está)
- [ ] Descripción de la tienda en múltiples idiomas
- [ ] Capturas de pantalla (mínimo 2 por idioma)
- [ ] Icono de la app (512x512px)
- [ ] Gráfico destacado (1024x500px)
- [ ] Política de privacidad (URL)
- [ ] Categoría de la app seleccionada

## 🔗 Recursos útiles

- [Google Play Console](https://play.google.com/console)
- [Guía de localización de Google](https://developer.android.com/guide/topics/resources/localization)
- [react-i18next docs](https://react.i18next.com/)
