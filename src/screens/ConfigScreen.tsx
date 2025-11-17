import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { useTranslation } from 'react-i18next';
import { configScreenStyles as styles } from './ConfigScreen.styles';
import FAQModal from '../components/FAQModal';
import CustomAlert from '../components/CustomAlert';
import { useInactivityMonitoring } from '../hooks/useInactivityMonitoring';

const ConfigScreen = () => {
  const { t } = useTranslation();
  const [showFAQ, setShowFAQ] = useState(false);

  const {
    isMonitoring,
    timeoutMinutes,
    alertConfig,
    startMonitoring,
    stopMonitoring,
    updateTimeout,
    resetActivity,
  } = useInactivityMonitoring();

  const [localMinutes, setLocalMinutes] = useState(timeoutMinutes);

  useEffect(() => {
    setLocalMinutes(timeoutMinutes);
  }, [timeoutMinutes]);

  const toggleSwitch = async () =>
    isMonitoring ? await stopMonitoring() : await startMonitoring();

  const handleSliderChange = (value: number) => {
    setLocalMinutes(value);
  };

  const handleSliderComplete = async (value: number) => {
    await updateTimeout(value);
    resetActivity();
  };

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

        <View style={styles.centerSection}>

          <View style={styles.iconContainer}>
            <View style={styles.iconInner}>
              <Text style={styles.iconText}>📡</Text>
            </View>
          </View>

          <Text style={styles.mainTitle}>{t('inactivityDetection')}</Text>

          <View style={styles.toggleContainer}>
            <Switch
              trackColor={{ false: '#4a5568', true: '#10b981' }}
              thumbColor={isMonitoring ? '#ffffff' : '#f4f3f4'}
              ios_backgroundColor="#4a5568"
              onValueChange={toggleSwitch}
              value={isMonitoring}
              style={styles.switchLarge}
            />
          </View>

          <Text style={[
            styles.statusMessage,
            isMonitoring && styles.statusMessageActive
          ]}>
            {isMonitoring
              ? t('monitoringActive')
              : t('monitoringInactive')}
          </Text>
        </View>

        <View style={styles.adjustmentsSection}>
          <Text style={styles.sectionTitle}>{t('settings')}</Text>

          <View style={styles.sliderContainer}>
            <View style={styles.sliderRow}>
              <Text style={styles.sliderLabel}>{t('returnToHomeLabel')}</Text>
              <Text style={styles.sliderValue}>{localMinutes} {t('minutes')}</Text>
            </View>

            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={120}
              step={1}
              value={localMinutes}
              onValueChange={handleSliderChange}
              onSlidingComplete={handleSliderComplete}
              minimumTrackTintColor="#3b82f6"
              maximumTrackTintColor="#4a5568"
              thumbTintColor="#3b82f6"
            />

            <Text style={styles.hintText}>
              {t('hintText', { minutes: localMinutes })}
            </Text>
          </View>
        </View>
      </View>

      <FAQModal
        visible={showFAQ}
        onClose={() => setShowFAQ(false)}
        minutes={localMinutes}
      />

      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        icon={alertConfig.icon}
        benefits={alertConfig.benefits}
        steps={alertConfig.steps}
        buttons={alertConfig.buttons}
      />
    </SafeAreaView>
  );
};

export default ConfigScreen;