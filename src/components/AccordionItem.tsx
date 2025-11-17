import React, { useState } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { accordionStyles as styles } from './AccordionItem.styles';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AccordionItemProps {
    question: string;
    answer: string;
    isExpanded?: boolean;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, isExpanded = false }) => {
    const [expanded, setExpanded] = useState(isExpanded);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpanded(!expanded);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.header, expanded && styles.headerExpanded]}
                onPress={toggleExpand}
                activeOpacity={0.7}
            >
                <Text style={styles.question}>{question}</Text>
                <Text style={[styles.icon, expanded && styles.iconExpanded]}>
                    {expanded ? '−' : '+'}
                </Text>
            </TouchableOpacity>

            {expanded && (
                <View style={styles.content}>
                    <Text style={styles.answer}>{answer}</Text>
                </View>
            )}
        </View>
    );
};

export default AccordionItem;
