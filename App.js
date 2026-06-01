import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Accelerometer } from 'expo-sensors'

export default function App() {
  const [reading, setReading] = useState({ x: 0, y: 0, z: 0 })
  const [click, setClick] = useState(false)

  const startReading = (data) => {
    data.addListener(setReading)
  }

  const stopReading = (data) => {
    return () => data.remove()
  }

  useEffect(() => {
    const inscription = Accelerometer
    inscription.setUpdateInterval(100);
    if (click) {
      stopReading(inscription)
      setClick(true)
    } else {
      startReading(inscription)
      setClick(false)
    }
  }, [])
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sensor Ativo</Text>
      <Text style={styles.xAxis}>Eixo X: {reading.x.toFixed(2)}</Text>
      <Text style={styles.yAxis}>Eixo Y: {reading.y.toFixed(2)}</Text>
      <Text style={styles.zAxis}>Eixo Z: {reading.z.toFixed(2)}</Text>
      <Button
        style={styles.button}
        title={click ? "Iniciar" : "Parar"}
      // onPress={() => showAlert('Simple Button pressed')}
      />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
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
    // marginBottom: 20
  },
  button: {
    marginTop: 12,
    fontSize: 20,
    color: 'blue',
    borderRadius: 20
  }
});
