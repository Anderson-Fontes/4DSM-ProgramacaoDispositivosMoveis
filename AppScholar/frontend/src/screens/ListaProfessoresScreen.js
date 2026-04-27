import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function ListaProfessoresScreen({ navigation }) {
  const [professores, setProfessores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Recarrega a lista toda vez que a tela ganha foco (caso você cadastre alguém e volte)
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      buscarProfessores();
    });
    return unsubscribe;
  }, [navigation]);

  const buscarProfessores = async () => {
    try {
      const response = await api.get('/admin/professores');
      setProfessores(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os professores.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfessor = ({ item }) => (
    <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: colors.primary }]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.cardTitle}>{item.nome}</Text>
          <Text style={{ color: colors.textMuted }}>
            <Ionicons name="school" size={12} /> Titulação: {item.titulacao || 'Não informada'}
          </Text>
          <Text style={{ color: colors.primary, fontSize: 13, marginTop: 4, fontWeight: 'bold' }}>
            <Ionicons name="briefcase" size={12} /> Área: {item.area || 'Geral'}
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
          data={professores}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProfessor}
          contentContainerStyle={globalStyles.scrollContainer}
          ListHeaderComponent={() => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={globalStyles.screenTitle}>Corpo Docente</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('CadastroProfessor')}
                style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 12 }}
              >
                <Ionicons name="add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textMuted }}>Nenhum professor encontrado.</Text>}
        />
      )}
    </View>
  );
}