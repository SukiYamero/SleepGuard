import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fontSizes, fontWeights } from '../theme/typography';

export const faqModalStyles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#1a1d2e',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingTop: 20,
        paddingHorizontal: 24,
        paddingBottom: 40,
        maxHeight: '85%',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: fontWeights.bold,
        color: colors.text.primary,
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#2a3550',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButtonText: {
        fontSize: 20,
        color: colors.text.primary,
        fontWeight: fontWeights.bold,
    },
    faqContainer: {
        marginBottom: 24,
    },
    faqSection: {
        marginBottom: 24,
    },
    faqQuestion: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semibold,
        color: colors.text.primary,
        marginBottom: 8,
    },
    faqAnswer: {
        fontSize: fontSizes.md,
        color: '#8b92a8',
        lineHeight: 22,
    },
    exampleSection: {
        marginTop: 8,
        marginBottom: 24,
    },
    exampleTitle: {
        fontSize: 18,
        fontWeight: fontWeights.bold,
        color: colors.text.primary,
        marginBottom: 12,
    },
    exampleCard: {
        backgroundColor: '#0f172a',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    exampleScenario: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semibold,
        color: '#3b82f6',
        marginBottom: 16,
    },
    exampleStep: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    stepNumber: {
        fontSize: 18,
        marginRight: 8,
        marginTop: 2,
    },
    stepText: {
        flex: 1,
        fontSize: fontSizes.sm,
        color: '#9ca3af',
        lineHeight: 20,
    },
    exampleResult: {
        flexDirection: 'row',
        backgroundColor: '#064e3b',
        borderRadius: 8,
        padding: 12,
        marginTop: 8,
        alignItems: 'flex-start',
    },
    resultIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    resultText: {
        flex: 1,
        fontSize: fontSizes.sm,
        color: '#6ee7b7',
        lineHeight: 20,
        fontWeight: fontWeights.medium,
    },
    infoFooter: {
        marginTop: 32,
        paddingTop: 24,
        borderTopWidth: 1,
        borderTopColor: '#2a3550',
        alignItems: 'center',
    },
    appVersion: {
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.semibold,
        color: '#3b82f6',
        marginBottom: 8,
    },
    appInfo: {
        fontSize: fontSizes.xs,
        color: '#6b7280',
        marginBottom: 4,
    },
    appCopyright: {
        fontSize: 10,
        color: '#4b5563',
        marginTop: 8,
    },
});
