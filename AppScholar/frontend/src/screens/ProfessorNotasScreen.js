import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function ProfessorNotasScreen() {
  const [disciplinas, setDisciplinas] = useState([]);
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);
  const [alunos, setAlunos] = useState([]);
  const [atividadeNome, setAtividadeNome] = useState('');
  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [atividadesCadastradas, setAtividadesCadastradas] = useState([]);

  useEffect(() => {
    api.get('/professor/minhas-disciplinas')
      .then(res => setDisciplinas(res.data))
      .catch(() => Alert.alert('Erro', 'Falha ao carregar disciplinas.'))
      .finally(() => setLoading(false));
  }, []);

  const abrirTurma = async (disciplina) => {
    setDisciplinaSelecionada(disciplina);
    setLoading(true);
    setAtividadeNome(''); 
    try {
      const responseAlunos = await api.get(`/professor/turma/${disciplina.id}`);
      setAlunos(responseAlunos.data.map(aluno => ({ ...aluno, nota: '' })));

      const responseAtividades = await api.get(`/professor/atividades/${disciplina.id}`);
      setAtividadesCadastradas(responseAtividades.data);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao carregar os dados da turma.');
    } finally {
      setLoading(false);
    }
  };

  const carregarNotasDaAtividade = async (atividade) => {
    setLoading(true);
    setAtividadeNome(atividade.nome);
    try {
      const response = await api.get(`/professor/notas/${disciplinaSelecionada.id}/${atividade.id}`);
      const alunosComNotas = response.data.map(aluno => ({
        ...aluno,
        nota: aluno.nota !== null && aluno.nota !== undefined ? String(aluno.nota) : ''
      }));
      setAlunos(alunosComNotas);
    } catch (e) {
      Alert.alert('Erro', 'Falha ao carregar notas desta atividade.');
    } finally {
      setLoading(false);
    }
  };

  const handleNotaChange = (index, text) => {
    const textoFormatado = text.replace(',', '.');
    const novosAlunos = [...alunos];
    novosAlunos[index].nota = textoFormatado;
    setAlunos(novosAlunos);
  };

  const salvarNotas = async () => {
    if (!atividadeNome.trim()) {
      return Alert.alert('Atenção', 'Digite o nome da atividade (Ex: Prova P2, Trabalho Final).');
    }

    setSalvando(true);
    try {
      const notasPreenchidas = alunos.map(a => ({
        aluno_id: a.id,
        nota: a.nota
      }));

      await api.post('/professor/notas', {
        disciplina_id: disciplinaSelecionada.id,
        nome_atividade: atividadeNome,
        notas: notasPreenchidas
      });

      Alert.alert('Sucesso', 'Notas guardadas/atualizadas no sistema com sucesso!');
      setDisciplinaSelecionada(null); 
    } catch (e) {
      Alert.alert('Erro', 'Falha ao guardar as notas.');
      console.log(e);
    } finally {
      setSalvando(false);
    }
  };

  if (loading) return <View style={globalStyles.centeredContent}><ActivityIndicator size="large" color={colors.primary} /></View>;

  if (!disciplinaSelecionada) {
    return (
      <View style={globalStyles.mainContainer}>
        <FlatList
          data={disciplinas}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={globalStyles.scrollContainer}
          ListHeaderComponent={() => <Text style={globalStyles.screenTitle}>Lançamento e Edição de Notas</Text>}
          renderItem={({ item }) => (
            <TouchableOpacity style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: colors.primary }]} onPress={() => abrirTurma(item)}>
              <Text style={globalStyles.cardTitle}>{item.nome}</Text>
              <Text style={{ color: colors.textMuted }}>{item.curso} - {item.sala}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={() => <Text style={{textAlign:'center', color: colors.textMuted}}>Nenhuma turma encontrada.</Text>}
        />
      </View>
    );
  }

  return (
    <View style={globalStyles.mainContainer}>
      <View style={{ padding: 20, backgroundColor: colors.surface }}>
        <TouchableOpacity onPress={() => setDisciplinaSelecionada(null)}>
            <Ionicons name="arrow-back" size={24} color={colors.textMain} />
        </TouchableOpacity>
        <Text style={[globalStyles.screenTitle, { marginTop: 10, marginBottom: 15 }]}>{disciplinaSelecionada.nome}</Text>
        
        {atividadesCadastradas.length > 0 && (
            <View style={{marginBottom: 15}}>
                <Text style={[globalStyles.label, {marginBottom: 5}]}>Editar Atividade Existente:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {atividadesCadastradas.map(ativ => (
                        <TouchableOpacity 
                            key={ativ.id} 
                            style={{backgroundColor: '#e0e0e0', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, marginRight: 10}}
                            onPress={() => carregarNotasDaAtividade(ativ)}
                        >
                            <Text style={{color: colors.textMain, fontWeight: 'bold'}}>{ativ.nome}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>
        )}

        <Text style={globalStyles.label}>Nome da Avaliação / Atividade (Nova ou Edição)</Text>
        <TextInput
            style={globalStyles.input}
            placeholder="Ex: Prova P2, Projeto Semestral..."
            value={atividadeNome}
            onChangeText={setAtividadeNome}
        />
      </View>

      <FlatList
        data={alunos}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={globalStyles.scrollContainer}
        renderItem={({ item, index }) => (
          <View style={[globalStyles.card, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={globalStyles.cardTitle}>{item.nome}</Text>
              <Text style={{ color: colors.textMuted, fontSize: 12 }}>RA: {item.matricula}</Text>
            </View>
            <View style={{ width: 80 }}>
              <TextInput
                style={styles.notaInput}
                placeholder="0.0"
                keyboardType="numeric"
                maxLength={4}
                value={item.nota}
                onChangeText={(text) => handleNotaChange(index, text)}
              />
            </View>
          </View>
        )}
      />

      <View style={{ padding: 20 }}>
        <TouchableOpacity 
            style={[globalStyles.buttonPrimary, salvando && {opacity: 0.7}]} 
            onPress={salvarNotas} 
            disabled={salvando}
        >
          {salvando ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={globalStyles.buttonText}>Guardar / Atualizar Notas</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  notaInput: {
    backgroundColor: '#F0F2F5',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: colors.primary
  }
});