// src/screens/CadastroAlunoScreen.js
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
    Alert, KeyboardAvoidingView, Platform, ScrollView,
    Text, TextInput, TouchableOpacity, View, ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

const IconInput = ({ icon, label, ...props }) => (
    <View style={globalStyles.inputGroup}>
        <Text style={globalStyles.label}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name={icon} size={20} color={colors.primary} style={{ position: 'absolute', left: 15, zIndex: 1 }} />
            <TextInput style={[globalStyles.input, { flex: 1, paddingLeft: 45 }]} placeholderTextColor="#A0AEC0" {...props} />
        </View>
    </View>
);

export default function CadastroAlunoScreen() {
    const [nome, setNome]         = useState('');
    const [matricula, setMatricula] = useState('');
    const [cursoId, setCursoId]   = useState('');     // ID do curso selecionado
    const [email, setEmail]       = useState('');
    const [senha, setSenha]       = useState('');
    const [semestre, setSemestre] = useState('');
    const [cep, setCep]           = useState('');
    const [endereco, setEndereco] = useState('');

    // Cursos disponíveis
    const [cursos, setCursos]     = useState([]);

    // IBGE
    const [estado, setEstado]           = useState('');
    const [cidade, setCidade]           = useState('');
    const [listaEstados, setListaEstados] = useState([]);
    const [listaCidades, setListaCidades] = useState([]);

    const [loading, setLoading]   = useState(false);

    // ── Carrega cursos e estados ────────────────────────────
    useEffect(() => {
        api.get('/admin/cursos')
            .then(res => setCursos(res.data))
            .catch(err => console.error('Erro ao carregar cursos:', err));

        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
            .then(res => setListaEstados(res.data))
            .catch(err => console.error('Erro IBGE Estados:', err));
    }, []);

    // ── Cidades ao mudar estado ─────────────────────────────
    useEffect(() => {
        if (estado) {
            axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado}/municipios`)
                .then(res => setListaCidades(res.data))
                .catch(err => console.error('Erro IBGE Cidades:', err));
        } else {
            setListaCidades([]);
        }
    }, [estado]);

    // ── ViaCEP ──────────────────────────────────────────────
    const buscarCep = async (textoCep) => {
        setCep(textoCep);
        if (textoCep.replace(/\D/g, '').length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${textoCep}/json/`);
                if (!response.data.erro) {
                    setEndereco(response.data.logradouro);
                    setEstado(response.data.uf);
                    setTimeout(() => setCidade(response.data.localidade), 800);
                }
            } catch (error) {
                console.log('Erro ViaCEP', error);
            }
        }
    };

    // ── Cadastrar ───────────────────────────────────────────
    const handleCadastro = async () => {
        if (!nome || !matricula || !email || !senha) {
            Alert.alert('Ops!', 'Nome, Matrícula, E-mail e Senha são obrigatórios.');
            return;
        }
        setLoading(true);
        try {
            await api.post('/admin/alunos', {
                email,
                senha,
                nome,
                matricula,
                semestre: semestre ? parseInt(semestre) : null,
                curso_id: cursoId  ? parseInt(cursoId)  : null,
            });
            Alert.alert('Sucesso!', 'Aluno cadastrado com sucesso.');
            // Limpa os campos
            setNome(''); setMatricula(''); setCursoId('');
            setEmail(''); setSenha(''); setSemestre('');
            setCep(''); setEndereco(''); setEstado(''); setCidade('');
        } catch (error) {
            Alert.alert('Erro', error.response?.data?.erro || 'Erro ao cadastrar aluno.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={globalStyles.mainContainer}
        >
            <ScrollView contentContainerStyle={globalStyles.scrollContainer} keyboardShouldPersistTaps="handled">

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
                    <Ionicons name="person-add" size={30} color={colors.info} style={{ marginRight: 10 }} />
                    <Text style={globalStyles.screenTitle}>Novo Aluno</Text>
                </View>

                <IconInput icon="person-outline"     label="Nome Completo"   placeholder="Ex: João Silva"                value={nome}      onChangeText={setNome} />
                <IconInput icon="mail-outline"       label="E-mail"          placeholder="joao@fatec.sp.gov.br"          value={email}     onChangeText={setEmail}     keyboardType="email-address" autoCapitalize="none" />
                <IconInput icon="lock-closed-outline" label="Senha Provisória" placeholder="Senha para o aluno"          value={senha}     onChangeText={setSenha}     secureTextEntry />

                <View style={globalStyles.row}>
                    <View style={{ width: '55%' }}>
                        <IconInput icon="id-card-outline" label="Matrícula (RA)" placeholder="DSM202601" value={matricula} onChangeText={setMatricula} />
                    </View>
                    <View style={{ width: '40%' }}>
                        <IconInput icon="layers-outline" label="Semestre" placeholder="Ex: 4" value={semestre} onChangeText={setSemestre} keyboardType="numeric" />
                    </View>
                </View>

                {/* ── Seletor de Curso ── */}
                <View style={globalStyles.inputGroup}>
                    <Text style={globalStyles.label}>Curso</Text>
                    <View style={[globalStyles.input, { padding: 0, overflow: 'hidden' }]}>
                        <Picker
                            selectedValue={cursoId}
                            onValueChange={(val) => setCursoId(val)}
                        >
                            <Picker.Item label="— Selecione o curso —" value="" color="#A0AEC0" />
                            {cursos.map((c) => (
                                <Picker.Item key={c.id} label={c.nome} value={c.id.toString()} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* ── Endereço ── */}
                <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border, marginVertical: 15 }} />
                <Text style={[globalStyles.label, { color: colors.textMuted, marginBottom: 15 }]}>
                    Endereço (ViaCEP + IBGE)
                </Text>

                <View style={globalStyles.row}>
                    <View style={{ width: '38%' }}>
                        <IconInput icon="map-outline"  label="CEP"        placeholder="12345-678" value={cep}      onChangeText={buscarCep} keyboardType="numeric" />
                    </View>
                    <View style={{ width: '58%' }}>
                        <IconInput icon="home-outline" label="Logradouro" placeholder="Rua, Av..." value={endereco} onChangeText={setEndereco} />
                    </View>
                </View>

                <View style={globalStyles.row}>
                    <View style={{ width: '38%' }}>
                        <Text style={globalStyles.label}>Estado (UF)</Text>
                        <View style={[globalStyles.input, { padding: 0, overflow: 'hidden' }]}>
                            <Picker selectedValue={estado} onValueChange={(v) => setEstado(v)}>
                                <Picker.Item label="UF" value="" color="#A0AEC0" />
                                {listaEstados.map((uf) => (
                                    <Picker.Item key={uf.id} label={uf.sigla} value={uf.sigla} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                    <View style={{ width: '58%' }}>
                        <Text style={globalStyles.label}>Cidade</Text>
                        <View style={[globalStyles.input, { padding: 0, overflow: 'hidden' }]}>
                            <Picker selectedValue={cidade} onValueChange={(v) => setCidade(v)} enabled={estado !== ''}>
                                <Picker.Item label={estado ? 'Selecione...' : 'Aguardando UF'} value="" color="#A0AEC0" />
                                {listaCidades.map((cid) => (
                                    <Picker.Item key={cid.id} label={cid.nome} value={cid.nome} />
                                ))}
                            </Picker>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    style={[globalStyles.buttonSecondary, { marginTop: 25 }]}
                    onPress={handleCadastro}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Ionicons name="save-outline" size={20} color="white" style={{ marginRight: 10 }} />
                            <Text style={globalStyles.buttonText}>Cadastrar Aluno</Text>
                        </View>
                    )}
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}
