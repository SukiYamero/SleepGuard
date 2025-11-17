import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fontSizes, fontWeights } from '../theme/typography';

export const configScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1d2e',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    headerSpacer: {
        width: 32,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: fontWeights.semibold,
        color: colors.text.primary,
    },
    helpButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#ffffff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    helpText: {
        fontSize: 18,
        fontWeight: fontWeights.bold,
        color: '#ffffff',
    },
    centerSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconContainer: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: '#2a3550',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    iconInner: {
        width: 130,
        height: 130,
        borderRadius: 65,
        backgroundColor: '#3b82f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconText: {
        fontSize: 48,
        color: '#ffffff',
    },
    mainTitle: {
        fontSize: 24,
        fontWeight: fontWeights.bold,
        color: colors.text.primary,
        marginBottom: 20,
        textAlign: 'center',
    },
    toggleContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    switchLarge: {
        transform: [{ scaleX: 2.0 }, { scaleY: 2.0 }],
    },
    statusMessage: {
        fontSize: fontSizes.sm,
        color: '#8b92a8',
        textAlign: 'center',
        marginTop: 12,
    },
    statusMessageActive: {
        color: '#10b981',
        fontWeight: fontWeights.medium,
    },
    statusMessageDisabled: {
        color: '#ef4444',
        fontWeight: fontWeights.medium,
    },
    adjustmentsSection: {
        marginTop: 30,
    },
    sectionTitle: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semibold,
        color: colors.text.primary,
        marginBottom: 20,
    },
    sliderContainer: {
        marginBottom: 12,
    },
    sliderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    sliderLabel: {
        fontSize: fontSizes.md,
        color: colors.text.primary,
    },
    sliderValue: {
        fontSize: fontSizes.md,
        fontWeight: fontWeights.semibold,
        color: '#3b82f6',
    },
    slider: {
        width: '100%',
        height: 60,
        transform: [{ scaleY: 1.5 }],
    },
    hintText: {
        fontSize: fontSizes.xs,
        color: '#8b92a8',
        marginTop: 8,
        lineHeight: 18,
    },
});
