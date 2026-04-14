import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';

export default function DashboardScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  // Carrega os dados do usuário assim que a tela abre
  useEffect(() => {
    const carregarUsuario = async () => {
      const userJSON = await AsyncStorage.getItem('@appscholar_user');
      if (userJSON) {
        setUsuario(JSON.parse(userJSON));
      }
    };
    carregarUsuario();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('@appscholar_token');
    await AsyncStorage.removeItem('@appscholar_user');
    navigation.replace('Login');
  };

  const MenuCard = ({ title, icon, color, onPress }) => (
    <TouchableOpacity style={[globalStyles.card, styles.gridItem]} onPress={onPress}>
      <View style={[styles.iconCircle, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={32} color={color} />
      </View>
      <Text style={[globalStyles.cardTitle, { color: color, textAlign: 'center' }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={globalStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={globalStyles.scrollContainer}>
        
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={[globalStyles.label, { marginBottom: 0 }]}>Bem-vindo,</Text>
            {/* Exibe o perfil ou email do usuário logado */}
            <Text style={globalStyles.screenTitle}>
              {usuario ? (usuario.perfil === 'master' ? 'Desenvolvedor' : usuario.email) : 'Carregando...'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: '#FFE3E3', padding: 10, borderRadius: 15 }}>
             <Ionicons name="log-out-outline" size={30} color={colors.danger} />
          </TouchableOpacity>
        </View>

        <Text style={[globalStyles.label, { marginBottom: 15 }]}>O que você precisa gerenciar?</Text>

        <View style={styles.grid}>
          {/* APENAS MASTER E DIRETOR VÊEM ESTES BOTÕES */}
          {usuario && (usuario.perfil === 'master' || usuario.perfil === 'diretor') && (
            <>
              <MenuCard title="Alunos" icon="people" color="#0984E3" onPress={() => navigation.navigate('CadastroAluno')} />
              <MenuCard title="Professores" icon="school" color="#6C5CE7" onPress={() => navigation.navigate('CadastroProfessor')} />
              <MenuCard title="Disciplinas" icon="book" color="#E17055" onPress={() => navigation.navigate('CadastroDisciplina')} />
            </>
          )}

          {/* TODOS VÊEM O BOLETIM */}
          <MenuCard title="Boletim" icon="document-text" color="#00B894" onPress={() => navigation.navigate('Boletim')} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: '48%', alignItems: 'center', paddingVertical: 25, justifyContent: 'center' },
  iconCircle: { padding: 15, borderRadius: 25, marginBottom: 15 }
});