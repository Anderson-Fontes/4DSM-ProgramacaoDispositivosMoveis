import { useEffect, useState } from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { colors, globalStyles } from '../styles/globalStyles';

export default function BoletimScreen() {
  const [boletim, setBoletim] = useState([]);

  // Uso obrigatório de useEffect para carregar dados mockados
  useEffect(() => {
    const dadosMockados = [
      { id: '1', disciplina: 'Dispositivos Móveis I', nota1: 8.5, nota2: 9.0, media: 8.75, situacao: 'Aprovado' },
      { id: '2', disciplina: 'Engenharia de Software III', nota1: 5.5, nota2: 6.5, media: 6.0, situacao: 'Exame' },
      { id: '3', disciplina: 'Inglês V', nota1: 9.5, nota2: 10, media: 9.75, situacao: 'Aprovado' },
      { id: '4', disciplina: 'Cálculo Numérico', nota1: 4.0, nota2: 3.5, media: 3.75, situacao: 'Reprovado' },
      { id: '5', disciplina: 'Laboratório de BD', nota1: 7.0, nota2: '-', media: '-', situacao: 'Em andamento' },
    ];
    setBoletim(dadosMockados);
  }, []);

  // Função helper para definir a cor baseada na situação (CRIATIVIDADE AQUI)
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
      // Aplicando cor dinâmica na borda esquerda do card
      <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: statusColor }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'start' }}>
            <View style={{flex: 1, paddingRight: 10}}>
                <Text style={globalStyles.cardTitle}>{item.disciplina}</Text>
                <Text style={[globalStyles.label, { color: colors.textMuted, marginLeft: 0 }]}>Prof. André Olimpio</Text>
            </View>
            {/* Badge Colorido da Situação */}
            <View style={[styles.statusBadge, { backgroundColor: statusColor + '15' }]}>
                <Text style={[styles.statusText, { color: statusColor }]}>{item.situacao}</Text>
            </View>
        </View>
        
        <View style={styles.notasRow}>
            <View style={styles.notaBlock}>
                <Text style={styles.notaLabel}>N1</Text>
                <Text style={styles.notaValue}>{item.nota1}</Text>
            </View>
            <View style={styles.notaBlock}>
                <Text style={styles.notaLabel}>N2</Text>
                <Text style={styles.notaValue}>{item.nota2}</Text>
            </View>
            <View style={[styles.notaBlock, { backgroundColor: statusColor + '10', borderRadius: 10 }]}>
                <Text style={[styles.notaLabel, {color: statusColor}]}>Média</Text>
                <Text style={[styles.notaValue, {color: statusColor, fontWeight: 'bold'}]}>{item.media}</Text>
            </View>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.mainContainer}>
      <StatusBar barStyle="dark-content" />
      <FlatList 
        data={boletim} 
        keyExtractor={item => item.id} 
        renderItem={renderItem} 
        contentContainerStyle={globalStyles.scrollContainer}
        ListHeaderComponent={() => (
            <Text style={[globalStyles.screenTitle, {marginBottom: 15}]}>Meu Desempenho</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
    },
    statusText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    notasRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 15,
    },
    notaBlock: {
        alignItems: 'center',
        flex: 1,
        padding: 5,
    },
    notaLabel: {
        fontSize: 12,
        color: colors.textMuted,
        marginBottom: 5,
        fontWeight: '600',
    },
    notaValue: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textMain,
    }
});