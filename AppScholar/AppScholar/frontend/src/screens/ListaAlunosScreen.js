import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function ListaAlunosScreen({ navigation }) {
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      buscarAlunos();
    });
    return unsubscribe;
  }, [navigation]);

  const buscarAlunos = async () => {
    try {
      const response = await api.get('/admin/alunos');
      setAlunos(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os alunos.');
    } finally {
      setLoading(false);
    }
  };

  const renderAluno = ({ item }) => (
    <View style={globalStyles.card}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.cardTitle}>{item.nome}</Text>
          <Text style={{ color: colors.textMuted }}>RA: {item.matricula} | {item.curso}</Text>
          <Text style={{ color: colors.primary, fontSize: 12, marginTop: 4 }}>
            <Ionicons name="mail" size={12} /> {item.email || 'Sem e-mail'}
          </Text>
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>
            <Ionicons name="location" size={12} /> {item.cidade || 'Cidade não informada'} - {item.estado || 'UF'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => {/* Edição futura */}}>
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
          data={alunos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAluno}
          contentContainerStyle={globalStyles.scrollContainer}
          ListHeaderComponent={() => (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={globalStyles.screenTitle}>Alunos Cadastrados</Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('CadastroAluno')}
                style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 12 }}
              >
                <Ionicons name="person-add" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textMuted }}>Nenhum aluno encontrado.</Text>}
        />
      )}
    </View>
  );
}