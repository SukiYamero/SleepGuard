import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { faqModalStyles as styles } from './FAQModal.styles';

interface FAQModalProps {
    visible: boolean;
    onClose: () => void;
    minutes: number;
}

const APP_VERSION = '1.0.0';

const FAQModal: React.FC<FAQModalProps> = ({ visible, onClose, minutes }) => {
    const { t } = useTranslation();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header del Modal */}
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{t('howItWorks')}</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>{t('close')}</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Contenido FAQ */}
                        <View style={styles.faqSection}>
                            <Text style={styles.faqQuestion}>{t('faq.whatDoesItDo.question')}</Text>
                            <Text style={styles.faqAnswer}>
                                {t('faq.whatDoesItDo.answer')}
                            </Text>
                        </View>

                        <View style={styles.faqSection}>
                            <Text style={styles.faqQuestion}>{t('faq.worksInBackground.question')}</Text>
                            <Text style={styles.faqAnswer}>
                                {t('faq.worksInBackground.answer')}
                            </Text>
                        </View>

                        <View style={styles.faqSection}>
                            <Text style={styles.faqQuestion}>{t('faq.batteryConsumption.question')}</Text>
                            <Text style={styles.faqAnswer}>
                                {t('faq.batteryConsumption.answer')}
                            </Text>
                        </View>

                        <View style={styles.faqSection}>
                            <Text style={styles.faqQuestion}>{t('faq.permissions.question')}</Text>
                            <Text style={styles.faqAnswer}>
                                {t('faq.permissions.answer')}
                            </Text>
                        </View>

                        {/* Caso de uso ejemplo */}
                        <View style={styles.exampleSection}>
                            <Text style={styles.exampleTitle}>{t('practicalExample')}</Text>
                            <View style={styles.exampleCard}>
                                <Text style={styles.exampleScenario}>
                                    {t('exampleScenario')}
                                </Text>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>1️⃣</Text>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step1')}
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>2️⃣</Text>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step2')}
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>3️⃣</Text>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step3', { minutes })}
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>4️⃣</Text>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step4')}
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>5️⃣</Text>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step5')}
                                    </Text>
                                </View>

                                <View style={styles.exampleResult}>
                                    <Text style={styles.resultIcon}>✅</Text>
                                    <Text style={styles.resultText}>
                                        {t('exampleResult')}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Información adicional */}
                        <View style={styles.infoFooter}>
                            <Text style={styles.appVersion}>{t('version', { version: APP_VERSION })}</Text>
                            <Text style={styles.appInfo}>{t('appName')}</Text>
                            <Text style={styles.appInfo}>{t('appDescription')}</Text>
                            <Text style={styles.appCopyright}>{t('copyright')}</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default FAQModal;
