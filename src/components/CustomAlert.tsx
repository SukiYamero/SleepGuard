import React from 'react';
import { View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { customAlertStyles as styles } from './CustomAlert.styles';

interface CustomAlertButton {
    text: string;
    onPress: () => void;
    style?: 'default' | 'cancel' | 'primary';
}

interface CustomAlertProps {
    visible: boolean;
    title: string;
    message: string;
    buttons: CustomAlertButton[];
    onClose?: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
    visible,
    title,
    message,
    buttons,
    onClose,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.alertContainer}>
                    {/* Icon and Title */}
                    <View style={styles.header}>
                        <Text style={styles.icon}>🔍</Text>
                        <Text style={styles.title}>{title}</Text>
                    </View>

                    {/* Message with ScrollView for long content */}
                    <ScrollView
                        style={styles.messageContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={styles.message}>{message}</Text>
                    </ScrollView>

                    {/* Buttons */}
                    <View style={styles.buttonsContainer}>
                        {buttons.map((button, index) => {
                            const buttonStyle = button.style || 'default';
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.button,
                                        buttonStyle === 'cancel' && styles.buttonCancel,
                                        buttonStyle === 'primary' && styles.buttonPrimary,
                                        index === 0 && buttons.length === 2 && styles.buttonLeft,
                                        index === 1 && buttons.length === 2 && styles.buttonRight,
                                    ]}
                                    onPress={button.onPress}
                                    activeOpacity={0.8}
                                >
                                    <Text
                                        style={[
                                            styles.buttonText,
                                            buttonStyle === 'cancel' && styles.buttonTextCancel,
                                            buttonStyle === 'primary' && styles.buttonTextPrimary,
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
