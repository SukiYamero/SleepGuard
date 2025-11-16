/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ConfigScreen from './src/screens/ConfigScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <ConfigScreen />
    </SafeAreaProvider>
  );
}

export default App;
