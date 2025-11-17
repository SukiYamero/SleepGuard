import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fontSizes, fontWeights } from '../theme/typography';

export const customAlertStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    alertContainer: {
        backgroundColor: '#1a1d2e',
        borderRadius: 20,
        width: '100%',
        maxWidth: 400,
        maxHeight: '80%',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#2a3550',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
    },
    header: {
        alignItems: 'center',
        paddingTop: 24,
        paddingHorizontal: 24,
        paddingBottom: 16,
    },
    icon: {
        fontSize: 48,
        marginBottom: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: fontWeights.bold,
        color: colors.text.primary,
        textAlign: 'center',
    },
    messageContainer: {
        maxHeight: 400,
        paddingHorizontal: 24,
        paddingBottom: 20,
    },
    message: {
        fontSize: fontSizes.md,
        color: '#8b92a8',
        lineHeight: 22,
        textAlign: 'left',
    },
    buttonsContainer: {
        flexDirection: 'row',
        borderTopWidth: 1,
        borderTopColor: '#2a3550',
        padding: 16,
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2a3550',
    },
    buttonLeft: {
        // Styles for left button in two-button layout
    },
    buttonRight: {
        // Styles for right button in two-button layout
    },
    buttonCancel: {
        backgroundColor: '#2a3550',
    },
    buttonPrimary: {
        backgroundColor: '#3b82f6',
    },
    buttonText: {
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semibold,
        color: '#9ca3af',
    },
    buttonTextCancel: {
        color: '#9ca3af',
    },
    buttonTextPrimary: {
        color: '#ffffff',
    },
});
