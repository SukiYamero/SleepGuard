import { StyleSheet } from 'react-native';

export const customAlertStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertContainer: {
        backgroundColor: '#1c1f2f',
        borderRadius: 24,
        width: '100%',
        maxWidth: 400,
        maxHeight: '85%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.6,
        shadowRadius: 25,
        elevation: 15,
    },
    scrollView: {
        maxHeight: '75%',
    },
    scrollContent: {
        paddingHorizontal: 32,
        paddingVertical: 28,
        paddingBottom: 8,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#293b5c',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 20,
    },
    iconWrapper: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        fontSize: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 16,
        letterSpacing: 0.3,
    },
    message: {
        fontSize: 15,
        color: '#b0b5c0',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 24,
    },
    benefitsContainer: {
        marginBottom: 24,
        gap: 12,
    },
    benefitItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    checkmarkContainer: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        fontSize: 20,
        color: '#4ade80',
        fontWeight: '700',
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(74, 222, 128, 0.15)',
        textAlign: 'center',
        lineHeight: 24,
    },
    benefitText: {
        fontSize: 15,
        color: '#e5e7eb',
        flex: 1,
        lineHeight: 22,
    },
    stepsContainer: {
        marginTop: 8,
        marginBottom: 8,
    },
    stepsTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: 16,
    },
    stepItem: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    stepNumber: {
        fontSize: 15,
        color: '#9ca3af',
        fontWeight: '600',
        minWidth: 4,
    },
    stepText: {
        fontSize: 15,
        color: '#9ca3af',
        flex: 1,
        lineHeight: 22,
    },
    buttonsContainer: {
        paddingHorizontal: 24,
        paddingVertical: 20,
        paddingTop: 20,
        gap: 12,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: '#5b8ef4',
    },
    cancelButton: {
        backgroundColor: '#3a3e52',
    },
    destructiveButton: {
        backgroundColor: '#ef4444',
    },
    buttonText: {
        fontSize: 17,
        fontWeight: '600',
        color: '#ffffff',
    },
    primaryButtonText: {
        color: '#ffffff',
        fontWeight: '700',
    },
    cancelButtonText: {
        color: '#b0b5c0',
    },
});
