// NOTA: No especificamos fontFamily para respetar la fuente del usuario
// Si el usuario cambió la fuente del sistema (mediante apps de personalización),
// nuestra app respetará automáticamente esa elección.
// Solo usamos fontWeight para los pesos de fuente.

// Tamaños de fuente consistentes
export const fontSizes = {
    xs: 12,
    sm: 13,
    md: 14,
    base: 16,
    lg: 18,
    xl: 28,
};

// Pesos de fuente - Estos SÍ se respetan independientemente de la fuente del usuario
export const fontWeights = {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
};
