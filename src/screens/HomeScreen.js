import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default function HomeScreen({ navigation, reading, subscription, peakForce, dominant, subscribe, unsubscribe }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {subscription ? "Sensor Ativo" : "Sensor Parado"}
      </Text>

      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorLabel}>Maior Inclinação:</Text>
        <Text style={[styles.indicatorValue, { color: dominant.color }]}>
          Eixo {dominant.name}
        </Text>
      </View>

      <View style={styles.peakContainer}>
        <Text style={styles.peakLabel}>Impacto Máximo Atual</Text>
        <Text style={styles.peakValue}>{peakForce.toFixed(2)} G</Text>
      </View>

      <Text style={styles.xAxis}>Eixo X: {reading.x.toFixed(2)}</Text>
      <Text style={styles.yAxis}>Eixo Y: {reading.y.toFixed(2)}</Text>
      <Text style={styles.zAxis}>Eixo Z: {reading.z.toFixed(2)}</Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.customButton}
          onPress={subscription ? unsubscribe : subscribe}
        >
          <Text style={styles.buttonText}>
            {subscription ? "Parar e Salvar" : "Iniciar Novo"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.customButton, styles.secondaryButton]}
          onPress={() => navigation.navigate('Histórico')}
        >
          <Text style={[styles.buttonText, { color: '#FFF000' }]}>
            Ver Histórico
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
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white'
  },
  indicatorContainer: {
    backgroundColor: '#1A1A1A',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: '#333'
  },
  indicatorLabel: {
    color: 'white',
    fontSize: 16,
    marginBottom: 5,
  },
  indicatorValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  peakContainer: {
    backgroundColor: '#151515',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
    width: '80%',
    borderWidth: 1,
    borderColor: '#222'
  },
  peakLabel: {
    color: '#888',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 5,
  },
  peakValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  xAxis: { fontSize: 20, color: '#00F0FF', marginBottom: 5 },
  yAxis: { fontSize: 20, color: '#FF003C', marginBottom: 5 },
  zAxis: { fontSize: 20, color: '#FFF000', marginBottom: 5 },
  buttonGroup: {
    marginTop: 30,
    width: '80%',
    gap: 12,
  },
  customButton: {
    backgroundColor: '#1A1A1A',
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  secondaryButton: {
    borderColor: '#FFF000',
  },
  buttonText: {
    color: '#00F0FF',
    fontSize: 18,
    fontWeight: 'bold',
  }
});