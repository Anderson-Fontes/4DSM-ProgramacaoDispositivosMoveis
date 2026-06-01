import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Switch, Text, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function ProfessorTurmasScreen() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/professor/minhas-disciplinas')
      .then(res => setDisciplinas(res.data))
      .catch(() => Alert.alert('Erro', 'Falha ao carregar disciplinas.'))
      .finally(() => setLoading(false));
  }, []);

  const abrirTurma = async (disciplina) => {
    setDisciplinaSelecionada(disciplina);
    setLoading(true);
    try {
      const response = await api.get(`/professor/turma/${disciplina.id}`);
      // Inicia todos os alunos como PRESENTES (true) por padrão
      const alunosComPresenca = response.data.map(aluno => ({ ...aluno, presente: true }));
      setAlunos(alunosComPresenca);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao carregar alunos.');
    } finally {
      setLoading(false);
    }
  };

  const togglePresenca = (index) => {
    const novosAlunos = [...alunos];
    novosAlunos[index].presente = !novosAlunos[index].presente;
    setAlunos(novosAlunos);
  };

  const salvarChamada = async () => {
    setLoading(true);
    try {
      const presencas = alunos.map(a => ({ aluno_id: a.id, presente: a.presente }));
      const dataHoje = new Date().toISOString().split('T')[0]; // Pega a data no formato YYYY-MM-DD

      await api.post('/professor/chamada', {
        disciplina_id: disciplinaSelecionada.id,
        data_aula: dataHoje,
        presencas: presencas
      });

      Alert.alert('Sucesso', 'Chamada registrada no diário!');
      setDisciplinaSelecionada(null); // Volta para a lista de matérias
    } catch (e) {
      Alert.alert('Erro', 'Falha ao registrar chamada.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <View style={globalStyles.centeredContent}><ActivityIndicator size="large" color={colors.primary} /></View>;

  // Tela 1: Escolher a Disciplina
  if (!disciplinaSelecionada) {
    return (
      <View style={globalStyles.mainContainer}>
        <FlatList
          data={disciplinas}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={globalStyles.scrollContainer}
          ListHeaderComponent={() => <Text style={globalStyles.screenTitle}>Minhas Turmas</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: colors.info }]} onPress={() => abrirTurma(item)}>
              <Text style={globalStyles.cardTitle}>{item.nome}</Text>
              <Text style={{ color: colors.textMuted }}>{item.curso} - {item.sala}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  }

  // Tela 2: Fazer a Chamada
  return (
    <View style={globalStyles.mainContainer}>
      <View style={{ padding: 20, backgroundColor: colors.surface }}>
        <TouchableOpacity onPress={() => setDisciplinaSelecionada(null)}><Ionicons name="arrow-back" size={24} color={colors.textMain} /></TouchableOpacity>
        <Text style={[globalStyles.screenTitle, { marginTop: 10, marginBottom: 0 }]}>{disciplinaSelecionada.nome}</Text>
        <Text style={{ color: colors.textMuted }}>Lista de Chamada - Data: {new Date().toLocaleDateString('pt-BR')}</Text>
      </View>

      <FlatList
        data={alunos}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={globalStyles.scrollContainer}
        renderItem={({ item, index }) => (
          <View style={[globalStyles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View style={{ flex: 1 }}>
              <Text style={globalStyles.cardTitle}>{item.nome}</Text>
              <Text style={{ color: colors.textMuted }}>RA: {item.matricula}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 10, color: item.presente ? colors.success : colors.danger, fontWeight: 'bold', marginBottom: 5 }}>
                {item.presente ? 'PRESENTE' : 'FALTA'}
              </Text>
              <Switch 
                value={item.presente} 
                onValueChange={() => togglePresenca(index)} 
                trackColor={{ false: '#ffcccc', true: '#ccffcc' }}
                thumbColor={item.presente ? colors.success : colors.danger}
              />
            </View>
          </View>
        )}
      />
      <View style={{ padding: 20 }}>
        <TouchableOpacity style={globalStyles.buttonPrimary} onPress={salvarChamada}>
          <Text style={globalStyles.buttonText}>Finalizar e Salvar Diário</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}