import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { customAlertStyles as styles } from './CustomAlert.styles';

export interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

interface CustomAlertProps {
    visible: boolean;
    title?: string;
    message?: string;
    icon?: string;
    buttons?: AlertButton[];
    benefits?: string[];
    steps?: string[];
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    icon: _icon,
    buttons = [],
    benefits = [],
    steps = [],
}) => {
    if (!visible) return null;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={() => {
                const cancelButton = buttons.find(b => b.style === 'cancel');
                if (cancelButton?.onPress) {
                    cancelButton.onPress();
                }
            }}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    <ScrollView
                        style={styles.scrollView}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.scrollContent}
                    >
                        {/* Icon */}
                        <View style={styles.iconContainer}>
                            <View style={styles.iconWrapper}>
                                <MaterialIcons
                                    name="touch-app"
                                    size={40}
                                    color="#4284f2"
                                />
                            </View>
                        </View>

                        {title && <Text style={styles.title}>{title}</Text>}

                        {message && <Text style={styles.message}>{message}</Text>}

                        {benefits.length > 0 && (
                            <View style={styles.benefitsContainer}>
                                {benefits.map((benefit, index) => (
                                    <View key={index} style={styles.benefitItem}>
                                        <View style={styles.checkmarkContainer}>
                                            <MaterialIcons name="check-circle" size={20} color="#4ade80" />
                                        </View>
                                        <Text style={styles.benefitText}>{benefit}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        {steps.length > 0 && (
                            <View style={styles.stepsContainer}>
                                <Text style={styles.stepsTitle}>To enable it:</Text>
                                {steps.map((step, index) => (
                                    <View key={index} style={styles.stepItem}>
                                        <Text style={styles.stepNumber}>{index + 1}.</Text>
                                        <Text style={styles.stepText}>{step}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </ScrollView>

                    <View style={styles.buttonsContainer}>
                        {buttons.map((button, index) => {
                            const buttonStyle = button.style || 'default';
                            const isPrimary = buttonStyle === 'default';
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        isPrimary && styles.primaryButton,
                                        buttonStyle === 'cancel' && styles.cancelButton,
                                        buttonStyle === 'destructive' && styles.destructiveButton,
                                    ]}
                                    onPress={button.onPress}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            isPrimary && styles.primaryButtonText,
                                            buttonStyle === 'cancel' && styles.cancelButtonText,
                                        ]}
                                    >
                                        {button.text}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CustomAlert;
