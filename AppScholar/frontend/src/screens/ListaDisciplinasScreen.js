import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function ListaDisciplinasScreen({ navigation }) {
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      buscarDisciplinas();
    });
    return unsubscribe;
  }, [navigation]);

  const buscarDisciplinas = async () => {
    try {
      const response = await api.get('/admin/disciplinas');
      setDisciplinas(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar as disciplinas.');
    } finally {
      setLoading(false);
    }
  };

  const renderDisciplina = ({ item }) => (
    <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: colors.warning }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.cardTitle}>{item.nome}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Text style={{ color: colors.textMuted, marginRight: 10 }}>
              <Ionicons name="business" size={12} /> {item.curso}
            </Text>
            <Text style={{ color: colors.textMuted }}>
              <Ionicons name="time" size={12} /> {item.carga_horaria}h
            </Text>
          </View>
          <Text style={{ color: colors.warning, fontSize: 13, marginTop: 6, fontWeight: 'bold' }}>
            <Ionicons name="person" size={12} /> Prof: {item.professor_nome || 'A Definir'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => {/* Futura tela de edição */}}>
          <Ionicons name="chevron-forward" size={24} color={colors.border} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={globalStyles.mainContainer}>
      {loading ? (
        <View style={globalStyles.centeredContent}><ActivityIndicator size="large" color={colors.primary} /></View>
      ) : (
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDisciplina}
          contentContainerStyle={globalStyles.scrollContainer}
          ListHeaderComponent={() => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={globalStyles.screenTitle}>Grade de Matérias</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('CadastroDisciplina')}
                style={{ backgroundColor: colors.warning, padding: 10, borderRadius: 12 }}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textMuted }}>Nenhuma disciplina encontrada.</Text>}
        />
      )}
    </View>
  );
}