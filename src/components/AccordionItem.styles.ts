import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fontSizes, fontWeights } from '../theme/typography';

export const accordionStyles = StyleSheet.create({
    container: {
        marginBottom: 12,
        backgroundColor: '#0f172a',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2a3550',
        overflow: 'hidden',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#1a1d2e',
    },
    headerExpanded: {
        borderBottomWidth: 1,
        borderBottomColor: '#2a3550',
    },
    question: {
        flex: 1,
        fontSize: fontSizes.base,
        fontWeight: fontWeights.semibold,
        color: colors.text.primary,
        marginRight: 12,
    },
    icon: {
        fontSize: 24,
        fontWeight: fontWeights.bold,
        color: '#3b82f6',
        width: 24,
        textAlign: 'center',
    },
    iconExpanded: {
        color: '#10b981',
    },
    content: {
        padding: 16,
        paddingTop: 12,
    },
    answer: {
        fontSize: fontSizes.md,
        color: '#8b92a8',
        lineHeight: 22,
    },
});
