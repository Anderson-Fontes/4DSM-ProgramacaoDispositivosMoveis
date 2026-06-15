import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function ListaAlunosScreen({ navigation }) {
    const [alunos, setAlunos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [perfilUsuario, setPerfilUsuario] = useState('');

    // Estados do Modal de Edição
    const [modalVisible, setModalVisible] = useState(false);
    const [alunoSelecionado, setAlunoSelecionado] = useState(null);
    const [novoNome, setNovoNome] = useState('');
    const [novaMatricula, setNovaMatricula] = useState('');
    const [novoCurso, setNovoCurso] = useState('');
    const [novoSemestre, setNovoSemestre] = useState('');

    useEffect(() => {
        carregarPerfilUsuario();
        const unsubscribe = navigation.addListener('focus', () => {
            buscarAlunos();
        });
        return unsubscribe;
    }, [navigation]);

    const carregarPerfilUsuario = async () => {
        try {
            const userString = await AsyncStorage.getItem('@appscholar_user');
            if (userString) {
                const user = JSON.parse(userString);
                setPerfilUsuario(user.perfil);
            }
        } catch (error) {
            console.log("Erro ao carregar perfil:", error);
        }
    };

    const buscarAlunos = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/alunos');
            setAlunos(response.data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar a lista de alunos.');
        } finally {
            setLoading(false);
        }
    };

    const abrirModalEdicao = (aluno) => {
        setAlunoSelecionado(aluno);
        setNovoNome(aluno.nome);
        setNovaMatricula(aluno.matricula);
        setNovoCurso(aluno.curso || '');
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
                nome: novoNome,
                matricula: novaMatricula,
                curso: novoCurso,
                semestre: novoSemestre ? parseInt(novoSemestre) : null
            });
            Alert.alert('Sucesso', 'Informações do aluno atualizadas!');
            setModalVisible(false);
            buscarAlunos(); // Recarrega a lista
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar as alterações.');
        }
    };

    const renderAluno = ({ item }) => {
        return (
            <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: '#17a2b8', marginBottom: 15 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={globalStyles.cardTitle}>{item.nome}</Text>
                        
                        <View style={styles.infoRow}>
                            <Ionicons name="card" size={14} color={colors.textMuted} />
                            <Text style={styles.infoText}>Matrícula (RA): <Text style={{fontWeight: 'bold', color: '#333'}}>{item.matricula}</Text></Text>
                        </View>
                        
                        <View style={styles.infoRow}>
                            <Ionicons name="school" size={14} color={colors.textMuted} />
                            <Text style={styles.infoText}>Curso: {item.curso || 'Não definido'} | {item.semestre ? `${item.semestre}º Sem.` : 'Semestre N/A'}</Text>
                        </View>

                        {/* Secção de Matérias Matriculadas */}
                        <Text style={styles.materiasTitulo}>Matérias Matriculadas:</Text>
                        {item.disciplinas_matriculadas && item.disciplinas_matriculadas.length > 0 ? (
                            item.disciplinas_matriculadas.map((mat, index) => (
                                <View key={index} style={styles.materiaBullet}>
                                    <Text style={styles.materiaTexto}>• {mat.nome} ({mat.curso})</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={styles.materiaVazia}>Aluno não matriculado em disciplinas.</Text>
                        )}
                    </View>
                </View>

                {/* Botão de Edição exclusivo para a Gestão */}
                {(perfilUsuario === 'diretor' || perfilUsuario === 'master') && (
                    <TouchableOpacity 
                        style={styles.editButton}
                        onPress={() => abrirModalEdicao(item)}
                    >
                        <Text style={styles.editButtonText}>✏️ Editar Informações</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    return (
        <View style={globalStyles.mainContainer}>
            {loading ? (
                <View style={globalStyles.centeredContent}><ActivityIndicator size="large" color={colors.primary} /></View>
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
                    ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textMuted }}>Nenhum aluno cadastrado.</Text>}
                />
            )}

            {/* ================= MODAL DE EDIÇÃO ================= */}
            <Modal visible={modalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Aluno</Text>
                        
                        <Text style={styles.sectionSubtitle}>Nome Completo:</Text>
                        <TextInput style={styles.input} value={novoNome} onChangeText={setNovoNome} />

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 0.48}}>
                                <Text style={styles.sectionSubtitle}>Matrícula (RA):</Text>
                                <TextInput style={styles.input} value={novaMatricula} onChangeText={setNovaMatricula} />
                            </View>
                            <View style={{flex: 0.48}}>
                                <Text style={styles.sectionSubtitle}>Semestre:</Text>
                                <TextInput style={styles.input} placeholder="Ex: 4" keyboardType="numeric" value={novoSemestre} onChangeText={setNovoSemestre} />
                            </View>
                        </View>

                        <Text style={styles.sectionSubtitle}>Curso:</Text>
                        <TextInput style={styles.input} placeholder="Ex: DSM" value={novoCurso} onChangeText={setNovoCurso} />

                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: '#17a2b8' }]} onPress={salvarEdicaoAluno}>
                            <Text style={styles.closeButtonText}>Salvar Alterações</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    infoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    infoText: { color: colors.textMuted, marginLeft: 6, fontSize: 13 },
    
    materiasTitulo: { fontSize: 14, fontWeight: 'bold', color: '#444', marginTop: 12, marginBottom: 4 },
    materiaBullet: { marginLeft: 6, marginBottom: 2, paddingLeft: 6, borderLeftWidth: 2, borderLeftColor: '#ddd' },
    materiaTexto: { fontSize: 13, fontWeight: '600', color: '#007bff' },
    materiaVazia: { fontSize: 13, color: '#999', fontStyle: 'italic', marginLeft: 4 },
    
    editButton: { backgroundColor: '#e9ecef', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 15, borderWidth: 1, borderColor: '#dee2e6' },
    editButtonText: { color: '#495057', fontWeight: 'bold', fontSize: 14 },

    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10, maxHeight: '85%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    sectionSubtitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginTop: 10, marginBottom: 4 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, backgroundColor: '#f9f9f9', marginTop: 2, marginBottom: 5 },
    
    closeButton: { backgroundColor: '#6c757d', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 10 },
    closeButtonText: { color: '#fff', fontWeight: 'bold' }
});