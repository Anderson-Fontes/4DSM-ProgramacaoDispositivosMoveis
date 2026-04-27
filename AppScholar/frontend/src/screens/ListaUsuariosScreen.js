import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, StatusBar, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function ListaUsuariosScreen({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Estados para Edição
  const [modalVisivel, setModalVisivel] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [novoNome, setNovoNome] = useState('');
  const [novoEmail, setNovoEmail] = useState('');
  const [novaSenha, setNovaSenha] = useState('');

  useEffect(() => { buscarUsuarios(); }, []);

  const buscarUsuarios = async () => {
    try {
      const response = await api.get('/admin/usuarios');
      setUsuarios(response.data);
    } catch (error) { Alert.alert('Erro', 'Falha ao carregar dados.'); }
    finally { setLoading(false); }
  };

  const confirmarExclusao = (id, nome) => {
    Alert.alert("Excluir", `Deseja remover ${nome}?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Excluir", style: "destructive", onPress: () => deletar(id) }
    ]);
  };

  const deletar = async (id) => {
    try {
      await api.delete(`/admin/usuarios/${id}`);
      buscarUsuarios();
      Alert.alert("Sucesso", "Usuário removido.");
    } catch (e) { Alert.alert("Erro", "Não foi possível excluir."); }
  };

  const abrirEdicao = (user) => {
    setUsuarioEditando(user);
    setNovoNome(user.nome);
    setNovoEmail(user.email);
    setNovaSenha('');
    setModalVisivel(true);
  };

  const salvarEdicao = async () => {
    try {
      await api.put(`/admin/usuarios/${usuarioEditando.id}`, {
        nome: novoNome,
        email: novoEmail,
        senha: novaSenha || null,
        perfil: usuarioEditando.perfil
      });
      setModalVisivel(false);
      buscarUsuarios();
      Alert.alert("Sucesso", "Dados atualizados.");
    } catch (e) { Alert.alert("Erro", "Falha ao atualizar."); }
  };

  const renderUsuario = ({ item }) => {
    const cor = item.perfil === 'master' ? colors.danger : item.perfil === 'professor' ? colors.primary : colors.success;
    
    return (
      <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: cor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flex: 1 }}>
            <Text style={globalStyles.cardTitle}>{item.nome}</Text>
            <Text style={{ color: colors.textMuted }}>{item.email}</Text>
            <Text style={{ fontSize: 11, color: colors.primary, fontWeight: '700' }}>
              {item.perfil.toUpperCase()} {item.matricula ? `| MAT: ${item.matricula}` : ''}
            </Text>
          </View>
          
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity onPress={() => abrirEdicao(item)} style={{ padding: 8 }}>
              <Ionicons name="create-outline" size={22} color={colors.info} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => confirmarExclusao(item.id, item.nome)} style={{ padding: 8 }}>
              <Ionicons name="trash-outline" size={22} color={colors.danger} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderUsuario}
        contentContainerStyle={globalStyles.scrollContainer}
        ListHeaderComponent={() => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Text style={globalStyles.screenTitle}>Gestão de Usuários</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CadastroAluno')} style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 12 }}>
              <Ionicons name="add" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* MODAL DE EDIÇÃO */}
      <Modal visible={modalVisivel} animationType="slide" transparent={true}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 25 }}>
            <Text style={[globalStyles.cardTitle, { marginBottom: 20 }]}>Editar Usuário</Text>
            
            <Text style={globalStyles.label}>Nome</Text>
            <TextInput style={globalStyles.input} value={novoNome} onChangeText={setNovoNome} />
            
            <Text style={globalStyles.label}>E-mail (Login)</Text>
            <TextInput style={globalStyles.input} value={novoEmail} onChangeText={setNovoEmail} autoCapitalize="none" />
            
            <Text style={globalStyles.label}>Nova Senha (deixe vazio para manter)</Text>
            <TextInput style={globalStyles.input} placeholder="••••••••" secureTextEntry value={novaSenha} onChangeText={setNovaSenha} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setModalVisivel(false)} style={{ flex: 1, marginRight: 10, padding: 15, alignItems: 'center' }}>
                <Text style={{ color: colors.textMuted, fontWeight: 'bold' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={salvarEdicao} style={[globalStyles.buttonPrimary, { flex: 1, marginTop: 0 }]}>
                <Text style={globalStyles.buttonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}