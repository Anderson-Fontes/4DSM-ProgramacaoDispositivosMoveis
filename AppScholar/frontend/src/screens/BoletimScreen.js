import { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function BoletimScreen() {
  const [boletim, setBoletim] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarBoletim = async () => {
      try {
        // Pega os dados do usuário salvo no login para saber quem é
        const userJSON = await AsyncStorage.getItem('@appscholar_user');
        if (!userJSON) return;
        
        const usuario = JSON.parse(userJSON);

        // Faz a requisição pro backend usando o ID do usuário logado
        const response = await api.get(`/academico/boletim/${usuario.id}`);
        setBoletim(response.data);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o seu boletim.');
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    buscarBoletim();
  }, []);

  const getSituacaoColor = (situacao) => {
    switch (situacao) {
      case 'Aprovado': return colors.success;
      case 'Exame': return colors.warning;
      case 'Reprovado': return colors.danger;
      default: return colors.info; // Em andamento
    }
  };

  const renderItem = ({ item }) => {
    const statusColor = getSituacaoColor(item.situacao);

    return (
      <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: statusColor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{flex: 1, paddingRight: 10}}>
                <Text style={globalStyles.cardTitle}>{item.disciplina}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{item.situacao}</Text>
            </View>
        </View>
        
        <View style={styles.notasRow}>
            {/* Como mudamos para "Atividades Variadas", mostramos apenas a Média e Frequência aqui */}
            <View style={styles.notaBlock}>
                <Text style={styles.notaLabel}>Frequência</Text>
                <Text style={styles.notaValue}>{item.frequencia}</Text>
            </View>
            <View style={[styles.notaBlock, { backgroundColor: statusColor + '10', borderRadius: 10 }]}>
                <Text style={[styles.notaLabel, {color: statusColor}]}>Média Final</Text>
                <Text style={[styles.notaValue, {color: statusColor, fontWeight: 'bold'}]}>{item.media}</Text>
            </View>
        </View>
      </View>
    );
  };

  if (loading) {
      return (
          <View style={[globalStyles.mainContainer, {justifyContent: 'center', alignItems: 'center'}]}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={{marginTop: 10, color: colors.primary}}>Buscando notas...</Text>
          </View>
      );
  }

  return (
    <View style={globalStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <FlatList 
        data={boletim} 
        keyExtractor={item => item.disciplina_id.toString()} 
        renderItem={renderItem} 
        contentContainerStyle={globalStyles.scrollContainer}
        ListHeaderComponent={() => (
            <Text style={[globalStyles.screenTitle, {marginBottom: 15}]}>Meu Desempenho</Text>
        )}
        ListEmptyComponent={() => (
            <Text style={{textAlign: 'center', color: colors.textMuted}}>Nenhuma disciplina matriculada encontrada.</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
    statusText: { fontSize: 12, fontWeight: 'bold' },
    notasRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 15 },
    notaBlock: { alignItems: 'center', flex: 1, padding: 5 },
    notaLabel: { fontSize: 12, color: colors.textMuted, marginBottom: 5, fontWeight: '600' },
    notaValue: { fontSize: 18, fontWeight: '600', color: colors.textMain }
});