import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';
import { Picker } from '@react-native-picker/picker';

export default function AlunoSolicitacoesScreen() {
  const [disciplinaId, setDisciplinaId] = useState('');
  const [tipoSolicitacao, setTipoSolicitacao] = useState('entrada');
  const [loading, setLoading] = useState(false);

  const enviarSolicitacao = async () => {
    if (!disciplinaId) { Alert.alert('Erro', 'Digite o ID da disciplina.'); return; }
    
    setLoading(true);
    try {
      await api.post('/academico/solicitacoes', {
        disciplina_id: parseInt(disciplinaId),
        tipo: tipoSolicitacao
      });
      Alert.alert('Sucesso', 'Solicitação enviada para a secretaria!');
      setDisciplinaId('');
    } catch (e) {
      Alert.alert('Erro', 'Falha ao enviar solicitação.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[globalStyles.mainContainer, { padding: 20 }]}>
      <Text style={globalStyles.screenTitle}>Requerimentos</Text>
      <Text style={[globalStyles.label, { marginBottom: 20, color: colors.textMuted }]}>
        Precisa trancar ou adicionar uma matéria? Faça sua solicitação abaixo.
      </Text>

      <Text style={globalStyles.label}>ID da Disciplina</Text>
      <TextInput 
        style={globalStyles.input} 
        placeholder="Ex: 5" 
        keyboardType="numeric" 
        value={disciplinaId} 
        onChangeText={setDisciplinaId} 
      />

      <Text style={[globalStyles.label, { marginTop: 15 }]}>Tipo de Solicitação</Text>
      <View style={[globalStyles.input, { padding: 0, overflow: 'hidden', marginBottom: 25 }]}>
        <Picker selectedValue={tipoSolicitacao} onValueChange={setTipoSolicitacao}>
          <Picker.Item label="Quero me matricular (Entrada)" value="entrada" />
          <Picker.Item label="Quero trancar a matéria (Saída)" value="saida" />
        </Picker>
      </View>

      <TouchableOpacity style={globalStyles.buttonPrimary} onPress={enviarSolicitacao} disabled={loading}>
        <Text style={globalStyles.buttonText}>{loading ? 'Enviando...' : 'Enviar Requerimento'}</Text>
      </TouchableOpacity>
    </View>
  );
}