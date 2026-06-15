import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function AdminSolicitacoesScreen() {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);

    // Controle do Modal de Resposta
    const [modalVisible, setModalVisible] = useState(false);
    const [solSelecionada, setSolSelecionada] = useState(null);
    const [resposta, setResposta] = useState('');

    useEffect(() => {
        buscarSolicitacoes();
    }, []);

    const buscarSolicitacoes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/admin/solicitacoes');
            setSolicitacoes(response.data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar as mensagens.');
        } finally {
            setLoading(false);
        }
    };

    const abrirModalResposta = (item) => {
        setSolSelecionada(item);
        setResposta('');
        setModalVisible(true);
    };

    const enviarResposta = async (status) => {
        if (!resposta.trim()) {
            Alert.alert('Atenção', 'Por favor, escreva uma resposta para o aluno.');
            return;
        }

        try {
            await api.put(`/admin/solicitacoes/${solSelecionada.id}`, { status, resposta });
            Alert.alert('Sucesso', `Mensagem respondida como ${status}!`);
            setModalVisible(false);
            buscarSolicitacoes(); 
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar a resposta.');
        }
    };

    const renderItem = ({ item }) => (
        <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: item.status === 'Pendente' ? '#f39c12' : (item.status === 'Resolvido' || item.status === 'Aprovado' ? '#2ecc71' : '#e74c3c') }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>
                        Aluno: {item.aluno_nome}
                    </Text>
                    
                    {item.mensagem ? (
                        <View style={styles.messageBox}>
                            <Text style={styles.messageText}>&quot;{item.mensagem}&quot;</Text>
                        </View>
                    ) : (
                        <Text style={{ color: colors.primary, fontSize: 13, marginTop: 8, fontStyle: 'italic' }}>
                            Pedido: {item.tipo} {item.disciplina_nome && `(${item.disciplina_nome})`}
                        </Text>
                    )}

                    <Text style={{ color: item.status === 'Pendente' ? '#f39c12' : (item.status === 'Recusado' ? '#e74c3c' : '#2ecc71'), fontSize: 13, marginTop: 8, fontWeight: 'bold' }}>
                        Status: {item.status}
                    </Text>
                    
                    {/* Se já foi respondido, mostra a resposta do Admin */}
                    {item.resposta && (
                        <View style={styles.replyBox}>
                            <Text style={{ fontWeight: 'bold', color: '#155724', fontSize: 12 }}>Sua Resposta:</Text>
                            <Text style={{ color: '#155724', fontSize: 13, marginTop: 2 }}>{item.resposta}</Text>
                        </View>
                    )}
                </View>
            </View>

            {item.status === 'Pendente' && (
                <TouchableOpacity style={styles.actionButton} onPress={() => abrirModalResposta(item)}>
                    <Ionicons name="chatbubble-ellipses" size={18} color="#fff" style={{marginRight: 6}}/>
                    <Text style={styles.actionButtonText}>Responder ao Aluno</Text>
                </TouchableOpacity>
            )}
        </View>
    );

    return (
        <View style={globalStyles.mainContainer}>
            {loading ? (
                <View style={globalStyles.centeredContent}><ActivityIndicator size="large" color={colors.primary} /></View>
            ) : (
                <FlatList
                    data={solicitacoes}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={globalStyles.scrollContainer}
                    ListHeaderComponent={() => (
                        <View style={{ marginBottom: 20 }}>
                            <Text style={globalStyles.screenTitle}>Caixa de Entrada</Text>
                            <Text style={{ color: colors.textMuted }}>Leia e responda as mensagens enviadas pelos alunos.</Text>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textMuted }}>Caixa de entrada vazia!</Text>}
                />
            )}

            {/* MODAL DE RESPOSTA */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Responder Aluno</Text>
                        <Text style={{ color: '#555', marginBottom: 10, fontStyle: 'italic' }}>
                            Mensagem: &quot;{solSelecionada?.mensagem || solSelecionada?.tipo}&quot;
                        </Text>
                        
                        <TextInput
                            style={styles.inputArea}
                            placeholder="Escreva a resposta da direção..."
                            multiline
                            textAlignVertical="top"
                            value={resposta}
                            onChangeText={setResposta}
                        />

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: '#28a745' }]} onPress={() => enviarResposta('Resolvido')}>
                                <Text style={styles.btnText}>Resolver</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.btn, { backgroundColor: '#dc3545' }]} onPress={() => enviarResposta('Recusado')}>
                                <Text style={styles.btnText}>Recusar</Text>
                            </TouchableOpacity>
                        </View>

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
    messageBox: { backgroundColor: '#f1f2f6', padding: 12, borderRadius: 6, marginTop: 10, borderLeftWidth: 3, borderLeftColor: colors.primary },
    messageText: { fontStyle: 'italic', color: '#444', fontSize: 14, lineHeight: 20 },
    replyBox: { backgroundColor: '#d4edda', padding: 10, borderRadius: 6, marginTop: 10, borderLeftWidth: 3, borderLeftColor: '#28a745' },
    actionButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 15, flexDirection: 'row', justifyContent: 'center' },
    actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
    inputArea: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 15, height: 120, backgroundColor: '#f9f9f9' },
    btn: { flex: 0.48, padding: 12, borderRadius: 6, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
    closeButton: { backgroundColor: '#6c757d', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 15 },
    closeButtonText: { color: '#fff', fontWeight: 'bold' }
});