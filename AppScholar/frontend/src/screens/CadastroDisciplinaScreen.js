import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function CadastroDisciplinaScreen() {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [carga, setCarga] = useState('');
  const [professorId, setProfessorId] = useState(''); // Backend exige ID do professor
  const [curso, setCurso] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if(!nomeDisciplina || !professorId){
        Alert.alert('Erro', 'Nome e ID do Professor são obrigatórios'); return;
    }
    setLoading(true);
    try {
      await api.post('/admin/disciplinas', { 
        nome: nomeDisciplina, 
        professor_id: parseInt(professorId), 
        curso 
      });
      Alert.alert('Sucesso!', 'Disciplina criada no banco.');
      setNomeDisciplina(''); setCarga(''); setProfessorId(''); setCurso('');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao criar a disciplina.');
    } finally {
      setLoading(false);
    }
  };

  const IconInput = ({ icon, label, ...props }) => (
    <View style={globalStyles.inputGroup}>
      <Text style={globalStyles.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name={icon} size={20} color={colors.primary} style={{ position: 'absolute', left: 15, zIndex: 1 }} />
        <TextInput style={[globalStyles.input, { flex: 1, paddingLeft: 45 }]} placeholderTextColor="#A0AEC0" {...props} />
      </View>
    </View>
  );

  return (
    <ScrollView style={globalStyles.mainContainer} contentContainerStyle={globalStyles.scrollContainer}>
        
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Ionicons name="book" size={30} color="#E17055" style={{marginRight: 10}}/>
            <Text style={globalStyles.screenTitle}>Nova Matéria</Text>
        </View>

        <IconInput icon="library-outline" label="Nome da Disciplina" placeholder="Programação Mobile I" value={nomeDisciplina} onChangeText={setNomeDisciplina} />
        
        <View style={globalStyles.row}>
            <View style={{width: '48%'}}><IconInput icon="timer-outline" label="Carga Horária" placeholder="80h" value={carga} onChangeText={setCarga} keyboardType="numeric" /></View>
            <View style={{width: '48%'}}><IconInput icon="git-branch-outline" label="Curso" placeholder="DSM" value={curso} onChangeText={setCurso} /></View>
        </View>

        <IconInput icon="keypad-outline" label="ID do Professor Responsável" placeholder="Digite o número de ID" value={professorId} onChangeText={setProfessorId} keyboardType="numeric" />

        <TouchableOpacity style={[globalStyles.buttonSecondary, {backgroundColor: "#E17055"}]} onPress={handleCadastro} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF"/> : <Text style={globalStyles.buttonText}>Criar Disciplina</Text>}
        </TouchableOpacity>
    </ScrollView>
  );
}