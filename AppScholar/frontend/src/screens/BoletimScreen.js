import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function BoletimScreen() {
  const [boletim, setBoletim] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarBoletim = async () => {
      try {
        const userJSON = await AsyncStorage.getItem('@appscholar_user');
        if (!userJSON) return;

        // Requisição para a rota corrigida (sem ID na URL)
        const response = await api.get('/academico/boletim');
        
        const dadosFormatados = response.data.map(item => {
            const totalAulas = parseInt(item.total_aulas) || 0;
            const presencas = parseInt(item.presencas) || 0;
            
            let freqPercentual = 100;
            if (totalAulas > 0) {
                freqPercentual = Math.round((presencas / totalAulas) * 100);
            }

            return {
                ...item,
                media: parseFloat(item.media).toFixed(1),
                frequencia: `${freqPercentual}%`,
                // Detalhamento já vem como JSON do backend
                detalhamento: item.detalhamento || []
            };
        });

        setBoletim(dadosFormatados);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar o seu boletim.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    buscarBoletim();
  }, []);

  const getSituacaoColor = (media) => {
    if (media >= 6) return colors.success;
    if (media >= 4) return colors.warning;
    return colors.danger;
  };

  const renderItem = ({ item }) => {
    const statusColor = getSituacaoColor(item.media);
    const isReprovadoFalta = parseInt(item.frequencia) < 75;

    return (
      <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: statusColor }]}>
        {/* Cabeçalho do Card */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{flex: 1, paddingRight: 10}}>
                <Text style={globalStyles.cardTitle}>{item.disciplina}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                    {item.media >= 6 ? 'Aprovado' : 'Em curso'}
                </Text>
            </View>
        </View>

        {/* SEÇÃO: Detalhamento de Notas (Atividades) */}
        <View style={styles.detalhamentoBox}>
            <Text style={styles.detalhamentoTitulo}>NOTAS DAS ATIVIDADES</Text>
            {item.detalhamento.length > 0 ? (
                item.detalhamento.map((atv, idx) => (
                    <View key={idx} style={styles.atvLinha}>
                        <Text style={styles.atvNome}>{atv.nome}</Text>
                        <Text style={styles.atvNota}>{parseFloat(atv.nota).toFixed(1)}</Text>
                    </View>
                ))
            ) : (
                <Text style={styles.semNota}>Nenhuma atividade avaliada ainda.</Text>
            )}
        </View>
        
        {/* Estatísticas de Frequência */}
        <View style={styles.estatisticasRow}>
            <View style={styles.pequenoCard}>
                <Text style={styles.pequenoTitulo}>Faltas</Text>
                <Text style={[styles.pequenoValor, {color: item.faltas > 0 ? colors.danger : colors.textMain}]}>
                    {item.faltas || 0}
                </Text>
            </View>
            <View style={styles.pequenoCard}>
                <Text style={styles.pequenoTitulo}>Presenças</Text>
                <Text style={[styles.pequenoValor, {color: colors.success}]}>{item.presencas || 0}</Text>
            </View>
            <View style={styles.pequenoCard}>
                <Text style={styles.pequenoTitulo}>Frequência</Text>
                <Text style={[styles.pequenoValor, {color: isReprovadoFalta ? colors.danger : colors.textMain}]}>
                    {item.frequencia}
                </Text>
            </View>
        </View>

        {/* Rodapé: Média Final */}
        <View style={[styles.notaFinalBlock, { backgroundColor: statusColor + '10' }]}>
            <Text style={[styles.notaLabel, {color: statusColor}]}>MÉDIA GERAL</Text>
            <Text style={[styles.notaValue, {color: statusColor}]}>{item.media}</Text>
        </View>
      </View>
    );
  };

  if (loading) return (
    <View style={globalStyles.centeredContent}>
        <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );

  return (
    <View style={globalStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <FlatList 
        data={boletim} 
        keyExtractor={(item, index) => item.disciplina + index} 
        renderItem={renderItem} 
        contentContainerStyle={globalStyles.scrollContainer}
        ListHeaderComponent={() => (
            <Text style={[globalStyles.screenTitle, {marginBottom: 15}]}>Meu Desempenho</Text>
        )}
        ListEmptyComponent={() => (
            <Text style={{textAlign: 'center', color: colors.textMuted, marginTop: 50}}>
                Nenhuma informação acadêmica disponível.
            </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    statusText: { fontSize: 11, fontWeight: 'bold' },
    
    // Estilos do Detalhamento de Notas
    detalhamentoBox: { 
        marginTop: 15, 
        padding: 12, 
        backgroundColor: '#F8F9FA', 
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#EDF2F7'
    },
    detalhamentoTitulo: { fontSize: 10, fontWeight: 'bold', color: colors.textMuted, marginBottom: 8, letterSpacing: 1 },
    atvLinha: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    atvNome: { fontSize: 13, color: colors.textMain },
    atvNota: { fontSize: 13, fontWeight: 'bold', color: colors.primary },
    semNota: { fontSize: 12, color: colors.textMuted, fontStyle: 'italic' },

    estatisticasRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 15, 
        paddingVertical: 12, 
        borderTopWidth: 1, 
        borderTopColor: colors.border 
    },
    pequenoCard: { alignItems: 'center', flex: 1 },
    pequenoTitulo: { fontSize: 10, color: colors.textMuted, textTransform: 'uppercase' },
    pequenoValor: { fontSize: 15, fontWeight: 'bold', marginTop: 2 },

    notaFinalBlock: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginTop: 5, 
        paddingHorizontal: 15, 
        paddingVertical: 12, 
        borderRadius: 10 
    },
    notaLabel: { fontSize: 13, fontWeight: 'bold' },
    notaValue: { fontSize: 20, fontWeight: '900' }
});