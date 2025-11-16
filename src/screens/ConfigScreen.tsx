import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { configScreenStyles as styles } from './ConfigScreen.styles';
import FAQModal from '../components/FAQModal';

const ConfigScreen = () => {
  const { t } = useTranslation();
  const [minutes, setMinutes] = useState(25);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>{t('appName')}</Text>
          <TouchableOpacity style={styles.helpButton} onPress={() => setShowFAQ(true)}>
            <Text style={styles.helpText}>{t('help')}</Text>
          </TouchableOpacity>
        </View>

        {/* Centro con icono y toggle */}
        <View style={styles.centerSection}>
          {/* Icono central */}
          <View style={styles.iconContainer}>
            <View style={styles.iconInner}>
              <Text style={styles.iconText}>📡</Text>
            </View>
          </View>

          {/* Título */}
          <Text style={styles.mainTitle}>{t('inactivityDetection')}</Text>

          {/* Toggle grande */}
          <View style={styles.toggleContainer}>
            <Switch
              trackColor={{ false: '#4a5568', true: '#10b981' }}
              thumbColor={isEnabled ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#4a5568"
              onValueChange={toggleSwitch}
              value={isEnabled}
              style={styles.switchLarge}
            />
          </View>

          {/* Mensaje de estado */}
          <Text style={[
            styles.statusMessage,
            isEnabled && styles.statusMessageActive
          ]}>
            {isEnabled
              ? t('monitoringActive')
              : t('monitoringInactive')}
          </Text>
        </View>

        {/* Sección de ajustes */}
        <View style={styles.adjustmentsSection}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>{t('returnToHomeLabel')}</Text>
              <Text style={styles.sliderValue}>{minutes} {t('minutes')}</Text>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={120}
              step={1}
              value={minutes}
              onValueChange={setMinutes}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#4a5568"
              thumbTintColor="#3b82f6"
            />

            <Text style={styles.hintText}>
              {t('hintText', { minutes })}
            </Text>
          </View>
        </View>
      </View>

      {/* Modal FAQ */}
      <FAQModal
        visible={showFAQ}
        onClose={() => setShowFAQ(false)}
        minutes={minutes}
      />
    </SafeAreaView>
  );
};

export default ConfigScreen;