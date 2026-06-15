import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal, FlatList } from 'react-native';
import api from '../services/api';

export default function CadastroDisciplinaScreen({ navigation }) {
    const [nome, setNome] = useState('');
    const [curso, setCurso] = useState('DSM');
    const [cargaHoraria, setCargaHoraria] = useState('80');
    
    // Controle de Professores
    const [professores, setProfessores] = useState([]);
    const [professorSelecionado, setProfessorSelecionado] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    // Carrega os professores assim que a tela abre
    useEffect(() => {
        carregarProfessores();
    }, []);

    const carregarProfessores = async () => {
        try {
            const response = await api.get('/admin/professores');
            setProfessores(response.data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os professores.');
        }
    };

    const handleCadastro = async () => {
        if (!nome) {
            Alert.alert('Atenção', 'Por favor, preencha o nome da disciplina.');
            return;
        }

        try {
            await api.post('/admin/disciplinas', {
                nome,
                curso,
                carga_horaria: parseInt(cargaHoraria) || 80,
                professor_id: professorSelecionado ? professorSelecionado.id : null // Vincula o professor aqui
            });
            Alert.alert('Sucesso', 'Disciplina cadastrada com sucesso!');
            navigation.goBack(); // Volta para a tela anterior
        } catch (error) {
            Alert.alert('Erro', error.response?.data?.erro || 'Erro ao cadastrar disciplina');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastrar Nova Disciplina</Text>

            <TextInput
                style={styles.input}
                placeholder="Nome da Disciplina"
                value={nome}
                onChangeText={setNome}
            />

            <TextInput
                style={styles.input}
                placeholder="Curso (Ex: DSM)"
                value={curso}
                onChangeText={setCurso}
            />

            <TextInput
                style={styles.input}
                placeholder="Carga Horária (Ex: 80)"
                keyboardType="numeric"
                value={cargaHoraria}
                onChangeText={setCargaHoraria}
            />

            {/* Seleção de Professor */}
            <Text style={styles.label}>Professor Responsável:</Text>
            <TouchableOpacity 
                style={styles.selectorButton} 
                onPress={() => setModalVisible(true)}
            >
                <Text style={styles.selectorText}>
                    {professorSelecionado ? professorSelecionado.nome : 'Toque para selecionar um Professor'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
                <Text style={styles.buttonText}>Salvar Disciplina</Text>
            </TouchableOpacity>

            {/* Modal que exibe a lista de Professores */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Escolha um Professor</Text>
                        <FlatList
                            data={professores}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setProfessorSelecionado(item);
                                        setModalVisible(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{item.nome} - {item.area || 'Sem área'}</Text>
                                </TouchableOpacity>
                            )}
                        />
                        <TouchableOpacity 
                            style={[styles.button, { backgroundColor: '#dc3545', marginTop: 10 }]} 
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
    title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    label: { fontSize: 16, fontWeight: 'bold', marginBottom: 5, marginTop: 10, color: '#555' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 15, backgroundColor: '#fff' },
    selectorButton: { borderWidth: 1, borderColor: '#007bff', padding: 15, borderRadius: 8, marginBottom: 20, backgroundColor: '#e9f2ff', alignItems: 'center' },
    selectorText: { color: '#007bff', fontWeight: 'bold', fontSize: 16 },
    button: { backgroundColor: '#28a745', padding: 15, borderRadius: 8, alignItems: 'center' },
    buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    
    // Modal
    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10, maxHeight: '80%' },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
    modalItem: { padding: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
    modalItemText: { fontSize: 16 }
});