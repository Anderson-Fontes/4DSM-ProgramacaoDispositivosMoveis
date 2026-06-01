import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function CadastroProfessorScreen() {
  const [nome, setNome] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [area, setArea] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCadastro = async () => {
    if(!nome || !email || !senha){
        Alert.alert("Atenção", "Nome, Email e Senha são obrigatórios."); return;
    }
    setLoading(true);
    try {
      await api.post('/admin/professores', { email, senha, nome });
      Alert.alert('Sucesso!', 'Professor cadastrado no sistema.');
      setNome(''); setTitulacao(''); setArea(''); setEmail(''); setSenha('');
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.erro || 'Erro ao salvar professor.');
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
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={globalStyles.mainContainer}>
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Ionicons name="school" size={30} color={colors.primary} style={{marginRight: 10}}/>
            <Text style={globalStyles.screenTitle}>Mestre / Doutor</Text>
        </View>

        <IconInput icon="person-outline" label="Nome Completo" placeholder="Ex: Prof. Dr. Carlos" value={nome} onChangeText={setNome} />
        
        <View style={globalStyles.row}>
            <View style={{width: '48%'}}><IconInput icon="ribbon-outline" label="Titulação" placeholder="Ex: Doutor" value={titulacao} onChangeText={setTitulacao} /></View>
            <View style={{width: '48%'}}><IconInput icon="briefcase-outline" label="Área" placeholder="Ex: TI" value={area} onChangeText={setArea} /></View>
        </View>

        <IconInput icon="mail-outline" label="E-mail Corporativo" placeholder="carlos@fatec.sp.gov.br" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <IconInput icon="lock-closed-outline" label="Senha Provisória" placeholder="Senha do Professor" value={senha} onChangeText={setSenha} secureTextEntry />

        <TouchableOpacity style={[globalStyles.buttonSecondary, {backgroundColor: colors.primary}]} onPress={handleCadastro} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="cloud-upload-outline" size={20} color="white" style={{marginRight: 10}} />
              <Text style={globalStyles.buttonText}>Salvar Professor</Text>
            </View>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}