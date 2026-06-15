// src/screens/DashboardScreen.js
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';

export default function DashboardScreen({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const carregarUsuario = async () => {
      const userJSON = await AsyncStorage.getItem('@appscholar_user');
      if (userJSON) setUsuario(JSON.parse(userJSON));
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

        {/* ── Cabeçalho ── */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <View>
            <Text style={[globalStyles.label, { marginBottom: 0 }]}>Bem-vindo,</Text>
            <Text style={globalStyles.screenTitle}>
              {usuario
                ? (usuario.perfil === 'master' ? 'Desenvolvedor' : usuario.nome || usuario.email)
                : 'Carregando...'}
            </Text>
          </View>
          <TouchableOpacity onPress={handleLogout} style={{ backgroundColor: '#FFE3E3', padding: 10, borderRadius: 15 }}>
            <Ionicons name="log-out-outline" size={30} color={colors.danger} />
          </TouchableOpacity>
        </View>

        <Text style={[globalStyles.label, { marginBottom: 15 }]}>Menu Principal</Text>

        <View style={styles.grid}>

          {/* ACESSOS: master e diretor */}
          {usuario && (usuario.perfil === 'master' || usuario.perfil === 'diretor') && (
            <MenuCard title="Acessos" icon="shield-checkmark" color="#D63031" onPress={() => navigation.navigate('ListaUsuarios')} />
          )}

          {/* PEDIDOS: master e diretor */}
          {usuario && (usuario.perfil === 'master' || usuario.perfil === 'diretor') && (
            <MenuCard title="Pedidos" icon="mail-unread" color="#00cec9" onPress={() => navigation.navigate('AdminSolicitacoes')} />
          )}

          {/* ✅ CURSOS: master e diretor */}
          {usuario && (usuario.perfil === 'master' || usuario.perfil === 'diretor') && (
            <MenuCard title="Cursos" icon="school" color="#6C5CE7" onPress={() => navigation.navigate('ListaCursos')} />
          )}

          {/* ALUNOS: master, diretor, professor */}
          {usuario && (usuario.perfil === 'master' || usuario.perfil === 'diretor' || usuario.perfil === 'professor') && (
            <MenuCard title="Alunos" icon="people" color="#0984E3" onPress={() => navigation.navigate('ListaAlunos')} />
          )}

          {/* DISCIPLINAS: todos */}
          {usuario && (
            <MenuCard title="Disciplinas" icon="book" color="#E17055" onPress={() => navigation.navigate('ListaDisciplinas')} />
          )}

          {/* PROFESSORES: master e diretor */}
          {usuario && (usuario.perfil === 'master' || usuario.perfil === 'diretor') && (
            <MenuCard title="Professores" icon="ribbon" color="#6C5CE7" onPress={() => navigation.navigate('ListaProfessores')} />
          )}

          {/* CHAMADA: master, diretor, professor */}
          {usuario && (usuario.perfil === 'master' || usuario.perfil === 'diretor' || usuario.perfil === 'professor') && (
            <MenuCard title="Chamada" icon="calendar" color="#FDCB6E" onPress={() => navigation.navigate('ProfessorTurmas')} />
          )}

          {/* LANÇAR NOTAS: master e professor */}
          {usuario && (usuario.perfil === 'master' || usuario.perfil === 'professor') && (
            <MenuCard title="Lançar Notas" icon="create" color="#E17055" onPress={() => navigation.navigate('ProfessorNotas')} />
          )}

          {/* MEU BOLETIM: master e aluno */}
          {usuario && (usuario.perfil === 'master' || usuario.perfil === 'aluno') && (
            <MenuCard title="Meu Boletim" icon="document-text" color="#00B894" onPress={() => navigation.navigate('Boletim')} />
          )}

          {/* GRADE SEMANAL: todos */}
          {usuario && (
            <MenuCard title="Grade Semanal" icon="time" color="#0984E3" onPress={() => navigation.navigate('AlunoGrade')} />
          )}

          {/* SOLICITAÇÕES: aluno */}
          {usuario && usuario.perfil === 'aluno' && (
            <MenuCard title="Solicitações" icon="git-pull-request" color="#6C5CE7" onPress={() => navigation.navigate('AlunoSolicitacoes')} />
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  grid:       { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem:   { width: '48%', alignItems: 'center', paddingVertical: 25, justifyContent: 'center', marginBottom: 15 },
  iconCircle: { padding: 15, borderRadius: 25, marginBottom: 15 },
});
