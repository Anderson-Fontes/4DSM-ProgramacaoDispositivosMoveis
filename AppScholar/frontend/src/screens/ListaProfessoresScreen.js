import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

const formatarDiaSemana = (dia) => {
    const dias = { 2: 'Segunda-feira', 3: 'Terça-feira', 4: 'Quarta-feira', 5: 'Quinta-feira', 6: 'Sexta-feira', 7: 'Sábado' };
    return dias[dia] || 'Não definido';
};

export default function ListaProfessoresScreen({ navigation }) {
  const [professores, setProfessores] = useState([]);
  const [disciplinas, setDisciplinas] = useState([]); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      buscarDados();
    });
    return unsubscribe;
  }, [navigation]);

  const buscarDados = async () => {
    try {
      const [resProf, resDis] = await Promise.all([
        api.get('/admin/professores'),
        api.get('/admin/disciplinas')
      ]);
      setProfessores(resProf.data);
      setDisciplinas(resDis.data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados docentes.');
    } finally {
      setLoading(false);
    }
  };

  const renderProfessor = ({ item }) => {
    const materiasDoProfessor = disciplinas.filter(d => d.professor_id === item.id);

    return (
      <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: colors.primary, marginBottom: 15 }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.cardTitle}>{item.nome}</Text>
            
            <Text style={{ color: colors.textMuted, marginBottom: 2 }}>
              <Ionicons name="school" size={12} /> Titulação: {item.titulacao || 'Não informada'}
            </Text>
            
            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: 'bold', marginBottom: 10 }}>
              <Ionicons name="briefcase" size={12} /> Área: {item.area || 'Geral'}
            </Text>

            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 4 }}>Grade Horária de Aulas:</Text>
            {materiasDoProfessor.length > 0 ? (
              materiasDoProfessor.map((mat, index) => (
                <View key={index} style={{ marginLeft: 6, marginBottom: 8, paddingLeft: 6, borderLeftWidth: 2, borderLeftColor: '#ddd' }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#007bff' }}>
                    • {mat.nome} ({mat.curso})
                  </Text>
                  <Text style={{ fontSize: 12, color: '#666', marginTop: 1 }}>
                    {mat.semestre ? `${mat.semestre}º Semestre` : 'Sem Semestre Mapeado'}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#555', fontWeight: '500' }}>
                    🗓️ {formatarDiaSemana(mat.dia_semana)} | ⏰ {mat.horario_inicio ? mat.horario_inicio.substring(0, 5) : '--:--'} às {mat.horario_fim ? mat.horario_fim.substring(0, 5) : '--:--'}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={{ fontSize: 13, color: '#999', fontStyle: 'italic', marginLeft: 4 }}>
                Nenhuma disciplina vinculada atualmente.
              </Text>
            )}
          </View>

          <TouchableOpacity onPress={() => {/* Futura tela de edição */}}>
            <Ionicons name="chevron-forward" size={24} color={colors.border} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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