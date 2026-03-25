import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';

export default function DashboardScreen({ navigation }) {
  
  // Função para renderizar os cards do menu com cores personalizadas
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
            <Text style={globalStyles.screenTitle}>Estudante Fatecano</Text>
          </View>
          <TouchableOpacity style={{ backgroundColor: colors.surface, padding: 10, borderRadius: 15 }}>
             <Ionicons name="person-circle" size={40} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <Text style={[globalStyles.label, { marginBottom: 15 }]}>O que você precisa gerenciar?</Text>

        <View style={styles.grid}>
          <MenuCard 
            title="Alunos" 
            icon="people" 
            color="#0984E3" // Azul
            onPress={() => navigation.navigate('CadastroAluno')} 
          />
          <MenuCard 
            title="Professores" 
            icon="school" 
            color="#6C5CE7" // Roxo
            onPress={() => navigation.navigate('CadastroProfessor')} 
          />
          <MenuCard 
            title="Disciplinas" 
            icon="book" 
            color="#E17055" // Laranja
            onPress={() => navigation.navigate('CadastroDisciplina')} 
          />
          <MenuCard 
            title="Boletim" 
            icon="document-text" 
            color="#00B894" // Verde
            onPress={() => navigation.navigate('Boletim')} 
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  gridItem: { 
    width: '48%', 
    alignItems: 'center', 
    paddingVertical: 25,
    justifyContent: 'center',
  },
  iconCircle: {
    padding: 15,
    borderRadius: 25,
    marginBottom: 15,
  }
});