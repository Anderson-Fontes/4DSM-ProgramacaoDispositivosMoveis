// src/screens/ListaAlunosScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, FlatList, Modal,
    ScrollView, StyleSheet, Text, TextInput,
    TouchableOpacity, View
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function ListaAlunosScreen({ navigation }) {
    const [alunos, setAlunos]               = useState([]);
    const [cursos, setCursos]               = useState([]);
    const [loading, setLoading]             = useState(true);
    const [perfilUsuario, setPerfilUsuario] = useState('');

    // Modal de edição
    const [modalVisible, setModalVisible]       = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [novoNome, setNovoNome]               = useState('');
    const [novaMatricula, setNovaMatricula]     = useState('');
    const [novoCursoId, setNovoCursoId]         = useState(null);
    const [novoSemestre, setNovoSemestre]       = useState('');

    useEffect(() => {
        carregarPerfilUsuario();
        const unsubscribe = navigation.addListener('focus', () => {
            buscarAlunos();
            buscarCursos();
        });
        return unsubscribe;
    }, [navigation]);

    const carregarPerfilUsuario = async () => {
        try {
            const userString = await AsyncStorage.getItem('@appscholar_user');
            if (userString) setPerfilUsuario(JSON.parse(userString).perfil);
        } catch (error) {
            console.log('Erro ao carregar perfil:', error);
        }
    };

    const buscarAlunos = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/alunos');
            setAlunos(data);
        } catch {
            Alert.alert('Erro', 'Não foi possível carregar a lista de alunos.');
        } finally {
            setLoading(false);
        }
    };

    const buscarCursos = async () => {
        try {
            const { data } = await api.get('/admin/cursos');
            setCursos(data);
        } catch {
            console.log('Aviso: não foi possível carregar cursos para o seletor.');
        }
    };

    // ── Modal de edição ─────────────────────────────────────
    const abrirModalEdicao = (aluno) => {
        setAlunoSelecionado(aluno);
        setNovoNome(aluno.nome);
        setNovaMatricula(aluno.matricula);
        setNovoCursoId(aluno.curso_id ? aluno.curso_id.toString() : '');
        setNovoSemestre(aluno.semestre ? aluno.semestre.toString() : '');
        setModalVisible(true);
    };

    const salvarEdicaoAluno = async () => {
        if (!novoNome || !novaMatricula) {
            Alert.alert('Atenção', 'Nome e Matrícula são obrigatórios!');
            return;
        }
        try {
            await api.put(`/admin/alunos/${alunoSelecionado.id}`, {
                nome:      novoNome,
                matricula: novaMatricula,
                semestre:  novoSemestre ? parseInt(novoSemestre) : null,
                curso_id:  novoCursoId  ? parseInt(novoCursoId)  : null,
            });
            Alert.alert('Sucesso', 'Informações do aluno atualizadas!');
            setModalVisible(false);
            buscarAlunos();
        } catch {
            Alert.alert('Erro', 'Não foi possível salvar as alterações.');
        }
    };

    // ── Card de aluno ────────────────────────────────────────
    const renderAluno = ({ item }) => {
        // Tenta mostrar o nome do curso vinculado, fallback para campo texto
        const cursoLabel = item.curso_nome || item.curso || 'Não vinculado';

        return (
            <View style={[globalStyles.card, styles.card]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={globalStyles.cardTitle}>{item.nome}</Text>

                        <View style={styles.infoRow}>
                            <Ionicons name="card" size={14} color={colors.textMuted} />
                            <Text style={styles.infoText}>
                                RA: <Text style={{ fontWeight: 'bold', color: '#333' }}>{item.matricula}</Text>
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Ionicons name="school" size={14} color={colors.textMuted} />
                            <Text style={styles.infoText}>
                                Curso: <Text style={{ fontWeight: '600', color: colors.primary }}>{cursoLabel}</Text>
                                {item.semestre ? `  •  ${item.semestre}º Sem.` : ''}
                            </Text>
                        </View>

                        {/* Disciplinas matriculadas */}
                        <Text style={styles.materiasTitulo}>Disciplinas Matriculadas:</Text>
                        {item.disciplinas_matriculadas && item.disciplinas_matriculadas.length > 0 ? (
                            item.disciplinas_matriculadas.map((mat, i) => (
                                <View key={i} style={styles.materiaBullet}>
                                    <Text style={styles.materiaTexto}>• {mat.nome}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.materiaVazia}>Aluno sem disciplinas matriculadas.</Text>
                        )}
                    </View>
                </View>

                {(perfilUsuario === 'diretor' || perfilUsuario === 'master') && (
                    <TouchableOpacity style={styles.editButton} onPress={() => abrirModalEdicao(item)}>
                        <Ionicons name="create-outline" size={16} color="#495057" style={{ marginRight: 6 }} />
                        <Text style={styles.editButtonText}>Editar Informações</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={globalStyles.mainContainer}>
            {loading ? (
                <View style={globalStyles.centeredContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={alunos}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderAluno}
                    contentContainerStyle={globalStyles.scrollContainer}
                    ListHeaderComponent={() => (
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={globalStyles.screenTitle}>Gestão de Alunos</Text>
                            {(perfilUsuario === 'diretor' || perfilUsuario === 'master') && (
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('CadastroAluno')}
                                    style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 12 }}
                                >
                                    <Ionicons name="add" size={24} color="white" />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', color: colors.textMuted }}>
                            Nenhum aluno cadastrado.
                        </Text>
                    }
                />
            )}

            {/* ══════════ MODAL DE EDIÇÃO ══════════ */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.overlay}>
                    <View style={styles.modalBox}>
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            <Text style={styles.modalTitle}>✏️ Editar Aluno</Text>

                            <Text style={styles.fieldLabel}>Nome Completo:</Text>
                            <TextInput style={styles.input} value={novoNome} onChangeText={setNovoNome} />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <View style={{ flex: 0.48 }}>
                                    <Text style={styles.fieldLabel}>Matrícula (RA):</Text>
                                    <TextInput style={styles.input} value={novaMatricula} onChangeText={setNovaMatricula} />
                                </View>
                                <View style={{ flex: 0.48 }}>
                                    <Text style={styles.fieldLabel}>Semestre:</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ex: 4"
                                        keyboardType="numeric"
                                        value={novoSemestre}
                                        onChangeText={setNovoSemestre}
                                    />
                                </View>
                            </View>

                            {/* ── Seletor de curso ── */}
                            <Text style={styles.fieldLabel}>Curso Vinculado:</Text>
                            <View style={[styles.input, { padding: 0, overflow: 'hidden', marginBottom: 8 }]}>
                                <Picker
                                    selectedValue={novoCursoId}
                                    onValueChange={(val) => setNovoCursoId(val)}
                                >
                                    <Picker.Item label="— Sem curso vinculado —" value="" color="#A0AEC0" />
                                    {cursos.map((c) => (
                                        <Picker.Item key={c.id} label={c.nome} value={c.id.toString()} />
                                    ))}
                                </Picker>
                            </View>

                            <TouchableOpacity
                                style={[globalStyles.buttonPrimary, { marginTop: 8, paddingVertical: 14 }]}
                                onPress={salvarEdicaoAluno}
                            >
                                <Text style={globalStyles.buttonText}>Salvar Alterações</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[globalStyles.buttonPrimary, { backgroundColor: '#B2BEC3', marginTop: 10, paddingVertical: 14 }]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={globalStyles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    card: { borderLeftWidth: 5, borderLeftColor: '#17a2b8', marginBottom: 15 },

    infoRow:  { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    infoText: { color: colors.textMuted, marginLeft: 6, fontSize: 13 },

    materiasTitulo: { fontSize: 14, fontWeight: 'bold', color: '#444', marginTop: 12, marginBottom: 4 },
    materiaBullet:  { marginLeft: 6, marginBottom: 2, paddingLeft: 6, borderLeftWidth: 2, borderLeftColor: '#ddd' },
    materiaTexto:   { fontSize: 13, fontWeight: '600', color: '#007bff' },
    materiaVazia:   { fontSize: 13, color: '#999', fontStyle: 'italic', marginLeft: 4 },

    editButton:     { flexDirection: 'row', backgroundColor: '#e9ecef', padding: 10, borderRadius: 6, alignItems: 'center', justifyContent: 'center', marginTop: 15, borderWidth: 1, borderColor: '#dee2e6' },
    editButtonText: { color: '#495057', fontWeight: 'bold', fontSize: 14 },

    // Modal
    overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
    modalBox:   { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: '90%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: colors.textMain },
    fieldLabel: { fontSize: 13, fontWeight: '600', color: colors.primary, marginTop: 10, marginBottom: 4 },
    input:      { borderWidth: 1, borderColor: colors.border, padding: 12, borderRadius: 10, backgroundColor: '#F7F9FC', fontSize: 15, color: colors.textMain, marginBottom: 4 },
});
