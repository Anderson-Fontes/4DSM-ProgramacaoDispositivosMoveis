import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';

export default function CadastroProfessorScreen() {
  const [nome, setNome] = useState('');
  const [titulacao, setTitulacao] = useState('');
  const [area, setArea] = useState('');
  const [tempo, setTempo] = useState('');
  const [email, setEmail] = useState('');

  const handleCadastro = () => {
    console.log("--- Novo Professor ---");
    console.log({ nome, titulacao, area, tempo, email });
    Alert.alert('Sucesso!', 'Professor registrado no console.');
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
            <View style={{width: '48%'}}>
                <IconInput icon="ribbon-outline" label="Titulação" placeholder="Ex: Doutor" value={titulacao} onChangeText={setTitulacao} />
            </View>
            <View style={{width: '48%'}}>
                <IconInput icon="briefcase-outline" label="Área" placeholder="Ex: TI" value={area} onChangeText={setArea} />
            </View>
        </View>

        <IconInput icon="time-outline" label="Tempo Docência (anos)" placeholder="5" value={tempo} onChangeText={setTempo} keyboardType="numeric" />
        <IconInput icon="mail-outline" label="E-mail Corporativo" placeholder="carlos@fatec.sp.gov.br" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

        <TouchableOpacity style={[globalStyles.buttonSecondary, {backgroundColor: colors.primary}]} onPress={handleCadastro}>
          <Ionicons name="cloud-upload-outline" size={20} color="white" style={{marginRight: 10}} />
          <Text style={globalStyles.buttonText}>Salvar Professor</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}