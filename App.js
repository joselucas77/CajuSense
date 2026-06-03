import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Accelerometer } from 'expo-sensors'
import * as Haptics from 'expo-haptics';

export default function App() {
  const [peakForce, setPeakForce] = useState(0);
  const [reading, setReading] = useState({ x: 0, y: 0, z: 0 })
  const [subscription, setSubscription] = useState(null);

  const lastDominantAxis = useRef(null);

  const subscribe = () => {
    Accelerometer.setUpdateInterval(100);

    const sub = Accelerometer.addListener((data) => {
      setReading(data);

      const totalForce = Math.sqrt(
        Math.pow(data.x, 2) + Math.pow(data.y, 2) + Math.pow(data.z, 2)
      );

      setPeakForce((prevPeak) => {
        if (totalForce > prevPeak) {
          return totalForce;
        }
        return prevPeak;
      });

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
    }
  }

  useEffect(() => {
    subscribe();
  }, []);

  useEffect(() => {
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, [subscription])

  const getDominantAxis = () => {
    const absX = Math.abs(reading.x);
    const absY = Math.abs(reading.y);
    const absZ = Math.abs(reading.z);

    const max = Math.max(absX, absY, absZ);

    if (max === absX) return { name: 'X', color: '#00F0FF' };
    if (max === absY) return { name: 'Y', color: '#FF003C' };
    return { name: 'Z', color: '#FFF000' };
  };

  const dominant = getDominantAxis();

  return (
    <View style={styles.container}>
      <View style={styles.peakContainer}>
        <Text style={styles.peakLabel}>Impacto Máximo (Força G)</Text>
        <Text style={styles.peakValue}>{peakForce.toFixed(2)}</Text>
      </View>
      <Text style={styles.title}>
        {subscription ? "Sensor Ativo" : "Sensor Parado"}
      </Text>

      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorLabel}>Maior Inclinação:</Text>
        <Text style={[styles.indicatorValue, { color: dominant.color }]}>
          Eixo {dominant.name}
        </Text>
      </View>

      <Text style={styles.xAxis}>Eixo X: {reading.x.toFixed(2)}</Text>
      <Text style={styles.yAxis}>Eixo Y: {reading.y.toFixed(2)}</Text>
      <Text style={styles.zAxis}>Eixo Z: {reading.z.toFixed(2)}</Text>
      <View style={{ marginTop: 20 }}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={subscription ? unsubscribe : subscribe}
        >
          <Text style={styles.buttonText}>
            {subscription ? "Parar" : "Iniciar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
  },
  peakContainer: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
    width: '80%',
  },
  peakLabel: {
    color: '#AAA',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  peakValue: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white'
  },
  indicatorContainer: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333'
  },
  indicatorLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  indicatorValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  xAxis: {
    fontSize: 20,
    color: '#00F0FF'
  },
  yAxis: {
    fontSize: 20,
    color: '#FF003C'
  },
  zAxis: {
    fontSize: 20,
    color: '#FFF000',
  },
  customButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  }
});
