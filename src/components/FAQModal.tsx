import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { faqModalStyles as styles } from './FAQModal.styles';
import AccordionItem from './AccordionItem';

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

                        {/* Contenido FAQ con Accordion */}
                        <View style={styles.faqContainer}>
                            <AccordionItem
                                question={t('faq.whatDoesItDo.question')}
                                answer={t('faq.whatDoesItDo.answer')}
                                isExpanded={true}
                            />

                            <AccordionItem
                                question={t('faq.worksInBackground.question')}
                                answer={t('faq.worksInBackground.answer')}
                            />

                            <AccordionItem
                                question={t('faq.batteryConsumption.question')}
                                answer={t('faq.batteryConsumption.answer')}
                            />

                            <AccordionItem
                                question={t('faq.permissions.question')}
                                answer={t('faq.permissions.answer')}
                            />

                            <AccordionItem
                                question={t('faq.accessibilityPermission.question')}
                                answer={t('faq.accessibilityPermission.answer')}
                            />
                        </View>

                        {/* Caso de uso ejemplo */}
                        <View style={styles.exampleSection}>
                            <Text style={styles.exampleTitle}>{t('practicalExample')}</Text>
                            <View style={styles.exampleCard}>
                                <Text style={styles.exampleScenario}>
                                    {t('exampleScenario')}
                                </Text>

                                <View style={styles.exampleStep}>
                                    <View style={styles.stepIconContainer}>
                                        <MaterialIcons name="looks-one" size={24} color="#5b8ef4" />
                                    </View>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step1')}
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <View style={styles.stepIconContainer}>
                                        <MaterialIcons name="looks-two" size={24} color="#5b8ef4" />
                                    </View>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step2')}
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <View style={styles.stepIconContainer}>
                                        <MaterialIcons name="looks-3" size={24} color="#5b8ef4" />
                                    </View>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step3', { minutes })}
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <View style={styles.stepIconContainer}>
                                        <MaterialIcons name="looks-4" size={24} color="#5b8ef4" />
                                    </View>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step4')}
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <View style={styles.stepIconContainer}>
                                        <MaterialIcons name="looks-5" size={24} color="#5b8ef4" />
                                    </View>
                                    <Text style={styles.stepText}>
                                        {t('exampleSteps.step5')}
                                    </Text>
                                </View>

                                <View style={styles.exampleResult}>
                                    <View style={styles.resultIconContainer}>
                                        <MaterialIcons name="check-circle" size={24} color="#4ade80" />
                                    </View>
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
