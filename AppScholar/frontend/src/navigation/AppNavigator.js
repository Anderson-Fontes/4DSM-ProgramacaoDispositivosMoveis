import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BoletimScreen from '../screens/BoletimScreen';
import CadastroAlunoScreen from '../screens/CadastroAlunoScreen';
import CadastroDisciplinaScreen from '../screens/CadastroDisciplinaScreen';
import CadastroProfessorScreen from '../screens/CadastroProfessorScreen';
import DashboardScreen from '../screens/DashboardScreen';
import LoginScreen from '../screens/LoginScreen';
import ListaUsuariosScreen from '../screens/ListaUsuariosScreen'; // NOVA IMPORTAÇÃO

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="CadastroAluno" component={CadastroAlunoScreen} options={{ title: 'Cadastro de Aluno' }} />
        <Stack.Screen name="CadastroProfessor" component={CadastroProfessorScreen} options={{ title: 'Cadastro de Professor' }} />
        <Stack.Screen name="CadastroDisciplina" component={CadastroDisciplinaScreen} options={{ title: 'Cadastro de Disciplina' }} />
        <Stack.Screen name="Boletim" component={BoletimScreen} options={{ title: 'Visualizar Boletim' }} />
        <Stack.Screen name="ListaUsuarios" component={ListaUsuariosScreen} options={{ title: 'Gestão de Acessos' }} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}