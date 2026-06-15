import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Modal, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

const formatarDiaSemana = (dia) => {
    const dias = { 2: 'Segunda-feira', 3: 'Terça-feira', 4: 'Quarta-feira', 5: 'Quinta-feira', 6: 'Sexta-feira', 7: 'Sábado' };
    return dias[dia] || 'Não definido';
};

export default function ListaDisciplinasScreen({ navigation }) {
    const [disciplinas, setDisciplinas] = useState([]);
    const [professores, setProfessores] = useState([]);
    const [todosAlunos, setTodosAlunos] = useState([]);
    const [alunosMatriculados, setAlunosMatriculados] = useState([]);
    
    const [perfilUsuario, setPerfilUsuario] = useState('');
    const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null);
    
    const [modalProfessorVisible, setModalProfessorVisible] = useState(false);
    const [modalAlunosVisible, setModalAlunosVisible] = useState(false);
    const [modalEditarVisible, setModalEditarVisible] = useState(false);

    // Campos de Edição expandidos
    const [novoSemestre, setNovoSemestre] = useState('');
    const [novoDiaSemana, setNovoDiaSemana] = useState('');
    const [novoHorarioInicio, setNovoHorarioInicio] = useState('');
    const [novoHorarioFim, setNovoHorarioFim] = useState('');

    useEffect(() => {
        carregarPerfilUsuario();
        carregarDadosIniciais();
    }, []);

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

    const carregarDadosIniciais = async () => {
        try {
            const resDis = await api.get('/admin/disciplinas');
            setDisciplinas(resDis.data);
            
            try {
                const resProf = await api.get('/admin/professores');
                setProfessores(resProf.data);
                const resAlu = await api.get('/admin/alunos');
                setTodosAlunos(resAlu.data);
            } catch (e) {
                console.log("Restrição de listagem de apoio.");
            }
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as disciplinas.');
        }
    };

    const carregarAlunosMatriculados = async (disciplinaId) => {
        try {
            const response = await api.get(`/admin/disciplinas/${disciplinaId}/alunos`);
            setAlunosMatriculados(response.data);
        } catch (error) {
            Alert.alert('Erro', 'Erro ao obter alunos matriculados.');
        }
    };

    const salvarEdicaoDisciplina = async () => {
        try {
            await api.put(`/admin/disciplinas/${disciplinaSelecionada.id}`, {
                semestre: parseInt(novoSemestre) || null,
                dia_semana: parseInt(novoDiaSemana) || null,
                horario_inicio: novoHorarioInicio || null,
                horario_fim: novoHorarioFim || null
            });
            Alert.alert('Sucesso', 'Informações da disciplina atualizadas!');
            setModalEditarVisible(false);
            carregarDadosIniciais();
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível salvar as alterações.');
        }
    };

    const vincularProfessor = async (professorId) => {
        try {
            await api.put('/admin/disciplinas/vincular-professor', {
                disciplina_id: disciplinaSelecionada.id,
                professor_id: professorId
            });
            Alert.alert('Sucesso', 'Professor associado!');
            setModalProfessorVisible(false);
            carregarDadosIniciais();
        } catch (error) {
            Alert.alert('Erro', 'Erro ao associar professor.');
        }
    };

    const desvincularProfessor = async (disciplinaId) => {
        try {
            await api.put(`/admin/disciplinas/${disciplinaId}/desvincular-professor`);
            Alert.alert('Sucesso', 'Professor desvinculado!');
            setModalProfessorVisible(false);
            carregarDadosIniciais();
        } catch (error) {
            Alert.alert('Erro', 'Erro ao desvincular.');
        }
    };

    const matricularAluno = async (alunoId) => {
        try {
            await api.post('/admin/disciplinas/matricular-aluno', {
                aluno_id: alunoId,
                disciplina_id: disciplinaSelecionada.id
            });
            Alert.alert('Sucesso', 'Aluno adicionado!');
            carregarAlunosMatriculados(disciplinaSelecionada.id);
        } catch (error) {
            Alert.alert('Atenção', error.response?.data?.erro || 'Erro ao matricular.');
        }
    };

    const desmatricularAluno = async (alunoId) => {
        try {
            await api.delete(`/admin/disciplinas/${disciplinaSelecionada.id}/aluno/${alunoId}`);
            Alert.alert('Sucesso', 'Aluno removido.');
            carregarAlunosMatriculados(disciplinaSelecionada.id);
        } catch (error) {
            Alert.alert('Erro', 'Erro ao desmatricular.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Disciplinas</Text>

            {(perfilUsuario === 'diretor' || perfilUsuario === 'master') && (
                <TouchableOpacity style={styles.btnAddDisciplina} onPress={() => navigation.navigate('CadastroDisciplina')}>
                    <Text style={styles.btnAddDisciplinaText}>➕ Nova Disciplina</Text>
                </TouchableOpacity>
            )}

            <FlatList
                data={disciplinas}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>{item.nome}</Text>
                        <Text style={styles.cardText}>Curso: {item.curso} | {item.semestre ? `${item.semestre}º Semestre` : 'Sem Semestre'}</Text>
                        <Text style={styles.cardText}>🗓️ {formatarDiaSemana(item.dia_semana)}</Text>
                        <Text style={styles.cardText}>⏰ Horário: {item.horario_inicio ? item.horario_inicio.substring(0, 5) : '--:--'} às {item.horario_fim ? item.horario_fim.substring(0, 5) : '--:--'}</Text>
                        <Text style={styles.cardProfessor}>Prof: {item.professor_nome || '⚠️ Sem professor'}</Text>

                        {(perfilUsuario === 'diretor' || perfilUsuario === 'master') && (
                            <View style={styles.managementSection}>
                                <View style={styles.rowButtons}>
                                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#007bff' }]} onPress={() => { setDisciplinaSelecionada(item); setModalProfessorVisible(true); }}>
                                        <Text style={styles.actionButtonText}>👤 Gerir Prof.</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#28a745' }]} onPress={() => { setDisciplinaSelecionada(item); carregarAlunosMatriculados(item.id); setModalAlunosVisible(true); }}>
                                        <Text style={styles.actionButtonText}>🎓 Gerir Alunos</Text>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity style={styles.fullWidthButton} onPress={() => {
                                    setDisciplinaSelecionada(item);
                                    setNovoSemestre(item.semestre ? item.semestre.toString() : '');
                                    setNovoDiaSemana(item.dia_semana ? item.dia_semana.toString() : '');
                                    setNovoHorarioInicio(item.horario_inicio ? item.horario_inicio.substring(0, 5) : '');
                                    setNovoHorarioFim(item.horario_fim ? item.horario_fim.substring(0, 5) : '');
                                    setModalEditarVisible(true);
                                }}>
                                    <Text style={styles.fullWidthButtonText}>⚙️ Editar Horário & Semestre</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                )}
                ListEmptyComponent={<Text style={{textAlign: 'center', marginTop: 20}}>Nenhuma disciplina encontrada.</Text>}
            />

            {/* ================= MODAL EDITAR INFORMAÇÕES E DIAS ================= */}
            <Modal visible={modalEditarVisible} animationType="fade" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Configurar Horários e Semestre</Text>
                        
                        <Text style={styles.sectionSubtitle}>Semestre Acadêmico:</Text>
                        <TextInput style={styles.input} placeholder="Ex: 4" keyboardType="numeric" value={novoSemestre} onChangeText={setNovoSemestre} />

                        <Text style={styles.sectionSubtitle}>Dia da Semana (2=Seg, 3=Ter, 4=Qua, 5=Qui, 6=Sex, 7=Sáb):</Text>
                        <TextInput style={styles.input} placeholder="Ex: 3" keyboardType="numeric" value={novoDiaSemana} onChangeText={setNovoDiaSemana} />

                        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <View style={{flex: 0.48}}>
                                <Text style={styles.sectionSubtitle}>Início:</Text>
                                <TextInput style={styles.input} placeholder="19:00" value={novoHorarioInicio} onChangeText={setNovoHorarioInicio} />
                            </View>
                            <View style={{flex: 0.48}}>
                                <Text style={styles.sectionSubtitle}>Término:</Text>
                                <TextInput style={styles.input} placeholder="22:40" value={novoHorarioFim} onChangeText={setNovoHorarioFim} />
                            </View>
                        </View>

                        <TouchableOpacity style={[styles.closeButton, { backgroundColor: '#28a745' }]} onPress={salvarEdicaoDisciplina}>
                            <Text style={styles.closeButtonText}>Salvar Alterações</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalEditarVisible(false)}>
                            <Text style={styles.closeButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ================= MODAL GERENCIAR PROFESSOR ================= */}
            <Modal visible={modalProfessorVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Professor - {disciplinaSelecionada?.nome}</Text>
                        {disciplinaSelecionada?.professor_id && (
                            <TouchableOpacity style={styles.removeButton} onPress={() => desvincularProfessor(disciplinaSelecionada.id)}>
                                <Text style={styles.removeButtonText}>❌ Remover Professor</Text>
                            </TouchableOpacity>
                        )}
                        <FlatList data={professores} keyExtractor={(p) => p.id.toString()} renderItem={({ item }) => (
                            <TouchableOpacity style={styles.selectItem} onPress={() => vincularProfessor(item.id)}>
                                <Text style={styles.selectItemText}>{item.nome} ({item.area})</Text>
                            </TouchableOpacity>
                        )} />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalProfessorVisible(false)}><Text style={styles.closeButtonText}>Fechar</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* ================= MODAL GERENCIAR ALUNOS ================= */}
            <Modal visible={modalAlunosVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Alunos Matriculados</Text>
                        <View style={{ height: 150, marginBottom: 10 }}>
                            <FlatList data={alunosMatriculados} keyExtractor={(a) => a.id.toString()} renderItem={({ item }) => (
                                <View style={styles.enrolledItem}>
                                    <Text style={styles.enrolledItemText}>{item.nome}</Text>
                                    <TouchableOpacity onPress={() => desmatricularAluno(item.id)}><Text style={styles.deleteText}>Remover</Text></TouchableOpacity>
                                </View>
                            )} ListEmptyComponent={<Text style={styles.emptyText}>Nenhum aluno vinculado.</Text>} />
                        </View>
                        <Text style={styles.sectionSubtitle}>Adicionar Novo Aluno:</Text>
                        <FlatList data={todosAlunos} keyExtractor={(ta) => ta.id.toString()} renderItem={({ item }) => (
                            <TouchableOpacity style={styles.selectItem} onPress={() => matricularAluno(item.id)}>
                                <Text style={styles.selectItemText}>➕ {item.nome} ({item.matricula})</Text>
                            </TouchableOpacity>
                        )} />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalAlunosVisible(false)}><Text style={styles.closeButtonText}>Fechar</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
    btnAddDisciplina: { backgroundColor: '#6f42c1', padding: 12, borderRadius: 8, marginBottom: 20, alignItems: 'center' },
    btnAddDisciplinaText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
    card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 15, elevation: 2 },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 4 },
    cardText: { fontSize: 14, color: '#666', marginBottom: 4 },
    cardProfessor: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 12 },
    managementSection: { marginTop: 5 },
    rowButtons: { flexDirection: 'row', justifyContent: 'space-between' },
    actionButton: { flex: 0.48, padding: 10, borderRadius: 6, alignItems: 'center' },
    actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    fullWidthButton: { backgroundColor: '#6c757d', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 10 },
    fullWidthButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 6, backgroundColor: '#fff', marginTop: 5, marginBottom: 15 },
    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10, maxHeight: '85%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
    sectionSubtitle: { fontSize: 14, fontWeight: 'bold', color: '#666', marginTop: 10, marginBottom: 4 },
    removeButton: { backgroundColor: '#dc3545', padding: 12, borderRadius: 6, alignItems: 'center', marginBottom: 10 },
    removeButtonText: { color: '#fff', fontWeight: 'bold' },
    selectItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
    selectItemText: { fontSize: 15, color: '#007bff' },
    enrolledItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#f9f9f9', borderRadius: 4, marginBottom: 6, alignItems: 'center' },
    enrolledItemText: { fontSize: 15, fontWeight: '500' },
    deleteText: { color: '#dc3545', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', color: '#999', marginVertical: 10 },
    closeButton: { backgroundColor: '#6c757d', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 10 },
    closeButtonText: { color: '#fff', fontWeight: 'bold' }
});