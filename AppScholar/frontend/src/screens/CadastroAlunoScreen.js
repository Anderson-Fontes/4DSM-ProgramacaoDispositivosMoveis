import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function CadastroAlunoScreen() {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [endereco, setEndereco] = useState('');
  
  // Estados para o IBGE
  const [estado, setEstado] = useState('');
  const [cidade, setCidade] = useState('');
  const [listaEstados, setListaEstados] = useState([]);
  const [listaCidades, setListaCidades] = useState([]);
  
  const [loading, setLoading] = useState(false);

  // 1. IBGE: Carrega os Estados ao abrir a tela
  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => setListaEstados(res.data))
      .catch(err => console.error("Erro IBGE Estados:", err));
  }, []);

  // 2. IBGE: Carrega as Cidades sempre que um Estado for selecionado
  useEffect(() => {
    if (estado) {
      axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
        .then(res => setListaCidades(res.data))
        .catch(err => console.error("Erro IBGE Cidades:", err));
    } else {
      setListaCidades([]);
    }
  }, [estado]);

  // 3. ViaCEP: Preenche endereço e seleciona Estado/Cidade automaticamente
  const buscarCep = async (textoCep) => {
    setCep(textoCep);
    if (textoCep.replace(/\D/g, '').length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${textoCep}/json/`);
        if (!response.data.erro) {
          setEndereco(response.data.logradouro);
          setEstado(response.data.uf); // Isso ativa o useEffect das cidades
          // Um pequeno delay para dar tempo do IBGE carregar as cidades antes de setar
          setTimeout(() => setCidade(response.data.localidade), 800); 
        }
      } catch (error) {
        console.log("Erro ViaCEP", error);
      }
    }
  };

  const handleCadastro = async () => {
    if(!nome || !matricula || !email || !senha){
        Alert.alert("Ops!", "Nome, Matrícula, Email e Senha são obrigatórios.");
        return;
    }
    setLoading(true);
    try {
      await api.post('/admin/alunos', { email, senha, nome, matricula });
      Alert.alert('Sucesso!', 'Aluno matriculado com sucesso.');
      setNome(''); setMatricula(''); setCurso(''); setEmail(''); setSenha('');
      setTelefone(''); setCep(''); setEndereco(''); setEstado(''); setCidade('');
    } catch (error) {
      Alert.alert('Erro', error.response?.data?.erro || 'Erro ao cadastrar aluno.');
    } finally {
      setLoading(false);
    }
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
            <Ionicons name="person-add" size={30} color={colors.info} style={{marginRight: 10}}/>
            <Text style={globalStyles.screenTitle}>Novo Aluno</Text>
        </View>

        <IconInput icon="person-outline" label="Nome Completo" placeholder="Ex: João Silva" value={nome} onChangeText={setNome} />
        
        <View style={globalStyles.row}>
            <View style={{width: '48%'}}><IconInput icon="id-card-outline" label="Matrícula" placeholder="123456" value={matricula} onChangeText={setMatricula} keyboardType="numeric" /></View>
            <View style={{width: '48%'}}><IconInput icon="school-outline" label="Curso" placeholder="Ex: DSM" value={curso} onChangeText={setCurso} /></View>
        </View>

        <IconInput icon="mail-outline" label="E-mail" placeholder="joao@fatec.sp.gov.br" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <IconInput icon="lock-closed-outline" label="Senha Provisória" placeholder="Senha para o aluno" value={senha} onChangeText={setSenha} secureTextEntry />
        
        <View style={{borderBottomWidth: 1, borderBottomColor: colors.border, marginVertical: 15}} />
        <Text style={[globalStyles.label, {color: colors.textMuted, marginBottom: 15}]}>Endereço (ViaCEP + IBGE)</Text>

        <View style={globalStyles.row}>
            <View style={{width: '38%'}}>
                <IconInput icon="map-outline" label="CEP" placeholder="12345-678" value={cep} onChangeText={buscarCep} keyboardType="numeric" />
            </View>
            <View style={{width: '58%'}}><IconInput icon="home-outline" label="Logradouro" placeholder="Rua, Av..." value={endereco} onChangeText={setEndereco} /></View>
        </View>

        {/* Dropdowns do IBGE */}
        <View style={globalStyles.row}>
            <View style={{width: '38%'}}>
              <Text style={globalStyles.label}>Estado (UF)</Text>
              <View style={[globalStyles.input, { padding: 0, overflow: 'hidden' }]}>
                <Picker selectedValue={estado} onValueChange={(itemValue) => setEstado(itemValue)}>
                  <Picker.Item label="UF" value="" color="#A0AEC0" />
                  {listaEstados.map((uf) => (
                    <Picker.Item key={uf.id} label={uf.sigla} value={uf.sigla} />
                  ))}
                </Picker>
              </View>
            </View>
            <View style={{width: '58%'}}>
              <Text style={globalStyles.label}>Cidade</Text>
              <View style={[globalStyles.input, { padding: 0, overflow: 'hidden' }]}>
                <Picker selectedValue={cidade} onValueChange={(itemValue) => setCidade(itemValue)} enabled={estado !== ''}>
                  <Picker.Item label={estado ? "Selecione..." : "Aguardando UF"} value="" color="#A0AEC0" />
                  {listaCidades.map((cid) => (
                    <Picker.Item key={cid.id} label={cid.nome} value={cid.nome} />
                  ))}
                </Picker>
              </View>
            </View>
        </View>

        <TouchableOpacity style={[globalStyles.buttonSecondary, {marginTop: 25}]} onPress={handleCadastro} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFF" /> : (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons name="save-outline" size={20} color="white" style={{marginRight: 10}} />
              <Text style={globalStyles.buttonText}>Cadastrar Aluno</Text>
            </View>
          )}
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}