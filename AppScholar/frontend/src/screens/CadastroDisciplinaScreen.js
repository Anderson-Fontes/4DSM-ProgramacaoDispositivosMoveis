import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

// COMPONENTE MOVIDO PARA FORA DA FUNÇÃO PRINCIPAL
const IconInput = ({ icon, label, ...props }) => (
  <View style={globalStyles.inputGroup}>
    <Text style={globalStyles.label}>{label}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Ionicons name={icon} size={20} color={colors.primary} style={{ position: 'absolute', left: 15, zIndex: 1 }} />
      <TextInput style={[globalStyles.input, { flex: 1, paddingLeft: 45 }]} placeholderTextColor="#A0AEC0" {...props} />
    </View>
  </View>
);

export default function CadastroDisciplinaScreen() {
  const [nome, setNome] = useState('');
  const [codigo, setCodigo] = useState('');
  const [cargaHoraria, setCargaHoraria] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if(!nome || !codigo || !cargaHoraria){
        Alert.alert("Atenção", "Nome, Código e Carga Horária são obrigatórios."); 
        return;
    }
    setLoading(true);
    try {
      // Ajuste a rota da API caso a sua seja diferente
      await api.post('/admin/disciplinas', { nome, codigo, carga_horaria: cargaHoraria });
      Alert.alert('Sucesso!', 'Disciplina cadastrada no sistema.');
      setNome(''); setCodigo(''); setCargaHoraria('');
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.erro || 'Erro ao salvar disciplina.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={globalStyles.mainContainer}>
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Ionicons name="book" size={30} color={colors.primary} style={{marginRight: 10}}/>
            <Text style={globalStyles.screenTitle}>Nova Disciplina</Text>
        </View>

        <IconInput 
          icon="book-outline" 
          label="Nome da Disciplina" 
          placeholder="Ex: Desenvolvimento Mobile" 
          value={nome} 
          onChangeText={setNome} 
        />
        
        <View style={globalStyles.row}>
            <View style={{width: '48%'}}>
              <IconInput 
                icon="barcode-outline" 
                label="Código" 
                placeholder="Ex: DSM101" 
                value={codigo} 
                onChangeText={setCodigo} 
              />
            </View>
            <View style={{width: '48%'}}>
              <IconInput 
                icon="time-outline" 
                label="Carga Horária" 
                placeholder="Ex: 80h" 
                value={cargaHoraria} 
                onChangeText={setCargaHoraria} 
                keyboardType="numeric" 
              />
            </View>
        </View>

        <TouchableOpacity style={[globalStyles.buttonSecondary, {backgroundColor: colors.primary, marginTop: 20}]} onPress={handleCadastro} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="save-outline" size={20} color="white" style={{marginRight: 10}} />
              <Text style={globalStyles.buttonText}>Salvar Disciplina</Text>
            </View>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}