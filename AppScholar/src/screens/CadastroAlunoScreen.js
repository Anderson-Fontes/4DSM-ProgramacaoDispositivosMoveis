import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';

export default function CadastroAlunoScreen() {
  // 9 Estados para os 9 campos
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const handleCadastro = () => {
    // Validação básica
    if(!nome || !matricula || !email){
        Alert.alert("Ops!", "Nome, Matrícula e Email são obrigatórios.");
        return;
    }
    // Exibindo TODOS os dados no console
    console.log("--- Novo Aluno ---");
    console.log({ nome, matricula, curso, email, telefone, cep, endereco, cidade, estado });
    Alert.alert('Sucesso!', 'Dados do aluno enviados para o console.');
  };

  // Componente reutilizável de Input com ícone
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
            <Ionicons name="person-add" size={30} color={colors.info} style={{marginRight: 10}}/>
            <Text style={globalStyles.screenTitle}>Novo Aluno</Text>
        </View>

        <IconInput icon="person-outline" label="Nome Completo" placeholder="Ex: João Silva" value={nome} onChangeText={setNome} />
        
        <View style={globalStyles.row}>
            <View style={{width: '48%'}}>
                <IconInput icon="id-card-outline" label="Matrícula" placeholder="123456" value={matricula} onChangeText={setMatricula} keyboardType="numeric" />
            </View>
            <View style={{width: '48%'}}>
                <IconInput icon="school-outline" label="Curso" placeholder="Ex: DSM" value={curso} onChangeText={setCurso} />
            </View>
        </View>

        <IconInput icon="mail-outline" label="E-mail" placeholder="joao@fatec.sp.gov.br" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <IconInput icon="call-outline" label="Telefone" placeholder="(12) 99999-9999" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
        
        <View style={{borderBottomWidth: 1, borderBottomColor: colors.border, marginVertical: 15}} />
        <Text style={[globalStyles.label, {color: colors.textMuted, marginBottom: 15}]}>Endereço</Text>

        <View style={globalStyles.row}>
            <View style={{width: '38%'}}>
                <IconInput icon="map-outline" label="CEP" placeholder="12345-678" value={cep} onChangeText={setCep} keyboardType="numeric" />
            </View>
            <View style={{width: '58%'}}>
                <IconInput icon="home-outline" label="Logradouro" placeholder="Rua, Av..." value={endereco} onChangeText={setEndereco} />
            </View>
        </View>

        <View style={globalStyles.row}>
            <View style={{width: '68%'}}>
                <IconInput icon="business-outline" label="Cidade" placeholder="Jacareí" value={cidade} onChangeText={setCidade} />
            </View>
            <View style={{width: '28%'}}>
                <IconInput icon="flag-outline" label="UF" placeholder="SP" value={estado} onChangeText={setEstado} autoCapitalize="characters" maxLength={2} />
            </View>
        </View>

        <TouchableOpacity style={globalStyles.buttonSecondary} onPress={handleCadastro}>
          <Ionicons name="save-outline" size={20} color="white" style={{marginRight: 10}} />
          <Text style={globalStyles.buttonText}>Cadastrar Aluno</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}