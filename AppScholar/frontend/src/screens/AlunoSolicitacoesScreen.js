import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function AlunoSolicitacoesScreen() {
    const [solicitacoes, setSolicitacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const [modalVisible, setModalVisible] = useState(false);
    const [mensagem, setMensagem] = useState('');
    const [enviando, setEnviando] = useState(false);

    useEffect(() => {
        buscarMinhasSolicitacoes();
    }, []);

    const buscarMinhasSolicitacoes = async () => {
        setLoading(true);
        try {
            const response = await api.get('/academico/solicitacoes');
            setSolicitacoes(response.data);
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar seu histórico de mensagens.');
        } finally {
            setLoading(false);
        }
    };

    const enviarNovaMensagem = async () => {
        if (!mensagem.trim()) {
            Alert.alert('Atenção', 'Escreva uma mensagem antes de enviar.');
            return;
        }

        setEnviando(true);
        try {
            await api.post('/academico/solicitacoes', { mensagem });
            Alert.alert('Sucesso', 'Sua mensagem foi enviada para a direção!');
            setMensagem('');
            setModalVisible(false);
            buscarMinhasSolicitacoes(); // Recarrega a lista
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível enviar a mensagem.');
        } finally {
            setEnviando(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: item.status === 'Pendente' ? '#f39c12' : (item.status === 'Recusado' ? '#e74c3c' : '#2ecc71') }]}>
            <View style={{ flex: 1 }}>
                
                {/* Mensagem enviada pelo aluno */}
                <Text style={{ fontWeight: 'bold', color: '#555', marginBottom: 5 }}>Você enviou:</Text>
                <View style={styles.messageBox}>
                    <Text style={styles.messageText}>&quot;{item.mensagem || item.tipo}&quot;</Text>
                </View>

                {/* Resposta do Admin */}
                {item.status === 'Pendente' ? (
                    <Text style={{ color: '#f39c12', fontSize: 13, marginTop: 10, fontWeight: 'bold', fontStyle: 'italic' }}>
                        ⏳ Aguardando retorno da Direção...
                    </Text>
                ) : (
                    <View style={styles.replyBox}>
                        <Text style={{ fontWeight: 'bold', color: item.status === 'Recusado' ? '#721c24' : '#155724', fontSize: 12 }}>
                            Resposta da Direção ({item.status}):
                        </Text>
                        <Text style={{ color: item.status === 'Recusado' ? '#721c24' : '#155724', fontSize: 14, marginTop: 4 }}>
                            {item.resposta || 'Sua solicitação foi processada sem comentários adicionais.'}
                        </Text>
                    </View>
                )}
            </View>
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
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <Text style={globalStyles.screenTitle}>Meus Contatos</Text>
                            <TouchableOpacity 
                                onPress={() => setModalVisible(true)}
                                style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 12 }}
                            >
                                <Ionicons name="add" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textMuted }}>Você ainda não enviou mensagens para a direção.</Text>}
                />
            )}

            {/* MODAL DE NOVA MENSAGEM */}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Nova Mensagem</Text>
                        <Text style={{ color: colors.textMuted, marginBottom: 15, fontSize: 14 }}>
                            Escreva sua dúvida ou pedido. A gestão irá lhe responder por aqui.
                        </Text>
                        
                        <TextInput
                            style={styles.inputArea}
                            placeholder="Digite sua mensagem aqui..."
                            multiline
                            textAlignVertical="top"
                            value={mensagem}
                            onChangeText={setMensagem}
                        />

                        <TouchableOpacity style={styles.btnEnviar} onPress={enviarNovaMensagem} disabled={enviando}>
                            <Text style={styles.btnText}>{enviando ? 'Enviando...' : 'Enviar Mensagem'}</Text>
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
    messageBox: { backgroundColor: '#f9f9f9', padding: 10, borderRadius: 6, borderWidth: 1, borderColor: '#eee' },
    messageText: { fontStyle: 'italic', color: '#444', fontSize: 14 },
    replyBox: { padding: 10, borderRadius: 6, marginTop: 10, backgroundColor: '#d4edda', borderWidth: 1, borderColor: '#c3e6cb' },
    
    modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10 },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
    inputArea: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 15, fontSize: 15, height: 120, backgroundColor: '#f9f9f9', marginBottom: 15 },
    btnEnviar: { backgroundColor: colors.primary, padding: 14, borderRadius: 8, alignItems: 'center' },
    btnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
    closeButton: { backgroundColor: '#6c757d', padding: 12, borderRadius: 6, alignItems: 'center', marginTop: 10 },
    closeButtonText: { color: '#fff', fontWeight: 'bold' }
});