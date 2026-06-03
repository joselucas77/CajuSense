import { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Accelerometer } from 'expo-sensors';
import * as Haptics from 'expo-haptics';

import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [reading, setReading] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState(null);
  const [peakForce, setPeakForce] = useState(0);
  const [history, setHistory] = useState([]);

  const lastDominantAxis = useRef(null);

  const subscribe = () => {
    setPeakForce(0);

    Accelerometer.setUpdateInterval(100);
    const sub = Accelerometer.addListener((data) => {
      setReading(data);

      const totalForce = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)
      );
      setPeakForce((prevPeak) => (totalForce > prevPeak ? totalForce : prevPeak));

      const absX = Math.abs(data.x);
      const absY = Math.abs(data.y);
      const absZ = Math.abs(data.z);
      const max = Math.max(absX, absY, absZ);

      let currentAxisName = 'Z';
      if (max === absX) currentAxisName = 'X';
      else if (max === absY) currentAxisName = 'Y';

      if (lastDominantAxis.current && lastDominantAxis.current !== currentAxisName) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      }

      lastDominantAxis.current = currentAxisName;
    });
    setSubscription(sub);
  };

  const unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);

      if (peakForce > 0) {
        const newRecord = {
          id: Date.now().toString(),
          value: peakForce,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        };
        setHistory((prevHistory) => [newRecord, ...prevHistory]);
      }
    }
  };

  useEffect(() => {
    subscribe();
    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

  const getDominantAxis = () => {
    const absX = Math.abs(reading.x);
    const absY = Math.abs(reading.y);
    const max = Math.max(absX, absY, Math.abs(reading.z));

    if (max === absX) return { name: 'X', color: '#00F0FF' };
    if (max === absY) return { name: 'Y', color: '#FF003C' };
    return { name: 'Z', color: '#FFF000' };
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: '#0F0F0F' },
          headerTintColor: '#00F0FF',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      >
        <Stack.Screen name="Dashboard">
          {(props) => (
            <HomeScreen
              {...props}
              reading={reading}
              subscription={subscription}
              peakForce={peakForce}
              dominant={getDominantAxis()}
              subscribe={subscribe}
              unsubscribe={unsubscribe}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Histórico">
          {(props) => <HistoryScreen {...props} history={history} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}