import { StyleSheet, Text, View, FlatList } from 'react-native';

export default function HistoryScreen({ history }) {
  return (
    <View style={styles.container}>
      {history.length === 0 ? (
        <Text style={styles.emptyText}>Nenhum impacto registrado ainda.</Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 20, width: '100%' }}
          renderItem={({ item, index }) => (
            <View style={styles.historyCard}>
              <Text style={styles.historyIndex}>#{history.length - index}</Text>
              <View>
                <Text style={styles.historyValue}>{item.value.toFixed(2)} G</Text>
                <Text style={styles.historyDate}>Registrado às {item.time}</Text>
              </View>
            </View>
          )}
        />
      )}
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
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
  historyCard: {
    backgroundColor: '#1A1A1A',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: '#333',
    gap: 20,
  },
  historyIndex: {
    color: '#00F0FF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  historyValue: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  historyDate: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  }
});