import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';

export default function CadastroDisciplinaScreen() {
  const [nomeDisciplina, setNomeDisciplina] = useState('');
  const [carga, setCarga] = useState('');
  const [professor, setProfessor] = useState('');
  const [curso, setCurso] = useState('');
  const [semestre, setSemestre] = useState('');

  const handleCadastro = () => {
    console.log("--- Nova Disciplina ---");
    console.log({ nomeDisciplina, carga, professor, curso, semestre });
    Alert.alert('Sucesso!', 'Disciplina registrada no console.');
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
    <ScrollView style={globalStyles.mainContainer} contentContainerStyle={globalStyles.scrollContainer}>
        
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
            <Ionicons name="book" size={30} color="#E17055" style={{marginRight: 10}}/>
            <Text style={globalStyles.screenTitle}>Nova Matéria</Text>
        </View>

        <IconInput icon="library-outline" label="Nome da Disciplina" placeholder="Programação Mobile I" value={nomeDisciplina} onChangeText={setNomeDisciplina} />
        
        <View style={globalStyles.row}>
            <View style={{width: '48%'}}>
                <IconInput icon="timer-outline" label="Carga Horária" placeholder="80h" value={carga} onChangeText={setCarga} keyboardType="numeric" />
            </View>
            <View style={{width: '48%'}}>
                <IconInput icon="calendar-outline" label="Semestre" placeholder="1º Sem/2024" value={semestre} onChangeText={setSemestre} />
            </View>
        </View>

        <IconInput icon="person-circle-outline" label="Professor Responsável" placeholder="Prof. André" value={professor} onChangeText={setProfessor} />
        <IconInput icon="git-branch-outline" label="Curso Destino" placeholder="DSM ou GE" value={curso} onChangeText={setCurso} />

        <TouchableOpacity style={[globalStyles.buttonSecondary, {backgroundColor: "#E17055"}]} onPress={handleCadastro}>
          <Text style={globalStyles.buttonText}>Criar Disciplina</Text>
        </TouchableOpacity>
    </ScrollView>
  );
}