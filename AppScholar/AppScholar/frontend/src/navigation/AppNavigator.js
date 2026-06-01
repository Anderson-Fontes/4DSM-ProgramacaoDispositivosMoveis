import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BoletimScreen from '../screens/BoletimScreen';
import CadastroAlunoScreen from '../screens/CadastroAlunoScreen';
import CadastroDisciplinaScreen from '../screens/CadastroDisciplinaScreen';
import CadastroProfessorScreen from '../screens/CadastroProfessorScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import ListaUsuariosScreen from '../screens/ListaUsuariosScreen'; 
import ProfessorTurmasScreen from '../screens/ProfessorTurmasScreen';
import AlunoGradeScreen from '../screens/AlunoGradeScreen';
import AlunoSolicitacoesScreen from '../screens/AlunoSolicitacoesScreen';
import ProfessorNotasScreen from '../screens/ProfessorNotasScreen';
// NOVAS LISTAS
import ListaAlunosScreen from '../screens/ListaAlunosScreen';
import ListaProfessoresScreen from '../screens/ListaProfessoresScreen';
import ListaDisciplinasScreen from '../screens/ListaDisciplinasScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        
        {/* Telas de Cadastro Direto */}
        <Stack.Screen name="CadastroAluno" component={CadastroAlunoScreen} options={{ title: 'Cadastro de Aluno' }} />
        <Stack.Screen name="CadastroProfessor" component={CadastroProfessorScreen} options={{ title: 'Cadastro de Professor' }} />
        <Stack.Screen name="CadastroDisciplina" component={CadastroDisciplinaScreen} options={{ title: 'Cadastro de Disciplina' }} />
        
        {/* Telas de Listagem (Gerenciamento) */}
        <Stack.Screen name="ListaUsuarios" component={ListaUsuariosScreen} options={{ title: 'Gestão de Acessos' }} /> 
        <Stack.Screen name="ListaAlunos" component={ListaAlunosScreen} options={{ title: 'Gerenciar Alunos' }} />
        <Stack.Screen name="ListaProfessores" component={ListaProfessoresScreen} options={{ title: 'Gerenciar Professores' }} />
        <Stack.Screen name="ListaDisciplinas" component={ListaDisciplinasScreen} options={{ title: 'Gerenciar Disciplinas' }} />

        {/* Telas Funcionais */}
        <Stack.Screen name="Boletim" component={BoletimScreen} options={{ title: 'Visualizar Boletim' }} />
        <Stack.Screen name="ProfessorTurmas" component={ProfessorTurmasScreen} options={{ title: 'Chamada' }} /> 
        <Stack.Screen name="AlunoGrade" component={AlunoGradeScreen} options={{ title: 'Grade Semanal' }} /> 
        <Stack.Screen name="AlunoSolicitacoes" component={AlunoSolicitacoesScreen} options={{ title: 'Solicitações' }} /> 
        <Stack.Screen name="ProfessorNotas" component={ProfessorNotasScreen} options={{ title: 'Lançar Notas' }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}