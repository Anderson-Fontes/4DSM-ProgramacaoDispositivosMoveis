import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StatusBar, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api'; // Importando nosso arquivo central de API
import { colors, globalStyles } from '../styles/globalStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === '' || senha.trim() === '') {
      setErro('Ei! Esqueceu de preencher os campos.');
      return;
    }

    setErro('');
    setLoading(true);

    try {
      // Fazendo a requisição pela nossa API configurada
      const response = await api.post('/login', {
        email: email.toLowerCase().trim(),
        senha: senha
      });

      const { token, usuario } = response.data;

      await AsyncStorage.setItem('@appscholar_token', token);
      await AsyncStorage.setItem('@appscholar_user', JSON.stringify(usuario));

      navigation.replace('Dashboard');

    } catch (error) {
      console.log(error); // Mostra o erro real no terminal do Expo para ajudar a debugar
      if (error.response && error.response.data && error.response.data.erro) {
        setErro(error.response.data.erro);
      } else {
        setErro('Erro de conexão. Verifique se o servidor está rodando e o link está correto.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={globalStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <View style={globalStyles.centeredContent}>
        
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

        <TouchableOpacity 
          style={[globalStyles.buttonPrimary, loading && { opacity: 0.7 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={globalStyles.buttonText}>Decolar! 🚀</Text>
          )}
        </TouchableOpacity>
        
      </View>
    </KeyboardAvoidingView>
  );
}