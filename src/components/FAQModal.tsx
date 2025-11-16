import React from 'react';
import { View, Text, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { faqModalStyles as styles } from './FAQModal.styles';

interface FAQModalProps {
    visible: boolean;
    onClose: () => void;
    minutes: number;
}

const APP_VERSION = '1.0.0';

const FAQModal: React.FC<FAQModalProps> = ({ visible, onClose, minutes }) => {
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
                            <Text style={styles.modalTitle}>ℹ️ Cómo funciona?</Text>
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Contenido FAQ */}
                        <View style={styles.faqSection}>
                            <Text style={styles.faqQuestion}>¿Qué hace esta app?</Text>
                            <Text style={styles.faqAnswer}>
                                • La app detecta cuando no tocas la pantalla{'\n'}
                                • Después del tiempo configurado, presiona el botón Home{'\n'}
                                • Tu dispositivo se apagará según su configuración normal
                            </Text>
                        </View>

                        <View style={styles.faqSection}>
                            <Text style={styles.faqQuestion}>¿Funciona en segundo plano?</Text>
                            <Text style={styles.faqAnswer}>
                                Sí, el servicio se ejecuta en segundo plano mientras la app esté activa.
                                Monitorea continuamente la actividad táctil de tu dispositivo.
                            </Text>
                        </View>

                        <View style={styles.faqSection}>
                            <Text style={styles.faqQuestion}>¿Consume mucha batería?</Text>
                            <Text style={styles.faqAnswer}>
                                No, la app está optimizada para consumir mínimos recursos.
                                De hecho, ayuda a ahorrar batería al apagar tu dispositivo automáticamente.
                            </Text>
                        </View>

                        <View style={styles.faqSection}>
                            <Text style={styles.faqQuestion}>¿Qué permisos necesita?</Text>
                            <Text style={styles.faqAnswer}>
                                La app requiere permisos de accesibilidad para detectar la inactividad
                                y simular la pulsación del botón Home.
                            </Text>
                        </View>

                        {/* Caso de uso ejemplo */}
                        <View style={styles.exampleSection}>
                            <Text style={styles.exampleTitle}>💡 Ejemplo práctico</Text>
                            <View style={styles.exampleCard}>
                                <Text style={styles.exampleScenario}>
                                    🎮 Escenario: Jugando antes de dormir
                                </Text>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>1️⃣</Text>
                                    <Text style={styles.stepText}>
                                        Estás jugando en tu tablet a las 11 PM
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>2️⃣</Text>
                                    <Text style={styles.stepText}>
                                        Te quedas dormido sin cerrar el juego
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>3️⃣</Text>
                                    <Text style={styles.stepText}>
                                        Después de {minutes} minutos sin tocar la pantalla,
                                        Inactivity Shield detecta la inactividad
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>4️⃣</Text>
                                    <Text style={styles.stepText}>
                                        La app presiona automáticamente el botón Home
                                    </Text>
                                </View>

                                <View style={styles.exampleStep}>
                                    <Text style={styles.stepNumber}>5️⃣</Text>
                                    <Text style={styles.stepText}>
                                        Tu tablet se apaga según su configuración
                                        (ej: después de 2 minutos en home)
                                    </Text>
                                </View>

                                <View style={styles.exampleResult}>
                                    <Text style={styles.resultIcon}>✅</Text>
                                    <Text style={styles.resultText}>
                                        ¡Tu batería está protegida! Sin esta app,
                                        el juego habría seguido funcionando toda la noche.
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Información adicional */}
                        <View style={styles.infoFooter}>
                            <Text style={styles.appVersion}>Versión {APP_VERSION}</Text>
                            <Text style={styles.appInfo}>Inactivity Shield</Text>
                            <Text style={styles.appInfo}>Protege la batería de tu dispositivo</Text>
                            <Text style={styles.appCopyright}>© 2025</Text>
                        </View>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

export default FAQModal;
