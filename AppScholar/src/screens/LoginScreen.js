import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const handleLogin = () => {
    if (email.trim() === '' || senha.trim() === '') {
      setErro('Ei! Esqueceu de preencher os campos.');
      return;
    }
    setErro('');
    navigation.replace('Dashboard');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={globalStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={globalStyles.centeredContent}>
        
        {/* Ícone Criativo no Topo */}
        <View style={{ alignItems: 'center', marginBottom: 30 }}>
          <View style={{ backgroundColor: '#E0DDFF', padding: 20, borderRadius: 30 }}>
            <Ionicons name="rocket" size={60} color={colors.primary} />
          </View>
        </View>

        <Text style={globalStyles.hugeTitle}>Scholar</Text>
        <Text style={[globalStyles.label, { textAlign: 'center', marginBottom: 30 }]}>Seu portal acadêmico moderno</Text>
        
        {erro !== '' && (
          <View style={globalStyles.errorText}>
            <Text style={{color: colors.danger, fontWeight: '600'}}>{erro}</Text>
          </View>
        )}
        
        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>E-mail ou Login</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="mail-outline" size={20} color={colors.primary} style={{ position: 'absolute', left: 15, zIndex: 1 }} />
            <TextInput 
              style={[globalStyles.input, { flex: 1, paddingLeft: 45 }]} 
              placeholder="seu.email@fatec.sp.gov.br" 
              value={email} 
              onChangeText={setEmail} 
              autoCapitalize="none" 
              keyboardType="email-address"
            />
          </View>
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Senha</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="lock-closed-outline" size={20} color={colors.primary} style={{ position: 'absolute', left: 15, zIndex: 1 }} />
            <TextInput 
              style={[globalStyles.input, { flex: 1, paddingLeft: 45 }]} 
              placeholder="••••••••" 
              secureTextEntry 
              value={senha} 
              onChangeText={setSenha} 
            />
          </View>
        </View>

        <TouchableOpacity style={globalStyles.buttonPrimary} onPress={handleLogin}>
          <Text style={globalStyles.buttonText}>Decolar! 🚀</Text>
        </TouchableOpacity>
        
      </View>
    </KeyboardAvoidingView>
  );
}