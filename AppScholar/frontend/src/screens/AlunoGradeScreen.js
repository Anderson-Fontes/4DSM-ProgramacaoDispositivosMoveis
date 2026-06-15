import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, StyleSheet } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function AlunoGradeScreen() {
  const [grade, setGrade] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Busca a grade sempre que a tela for carregada
    api.get('/academico/grade')
      .then(res => setGrade(res.data))
      .catch(err => console.log('Erro ao carregar grade:', err))
      .finally(() => setLoading(false));
  }, []);

  // Mapeamento correto dos dias da semana de acordo com o padrão do banco (2=Segunda)
  const getDiaSemana = (num) => {
    const dias = { 2: 'Segunda-feira', 3: 'Terça-feira', 4: 'Quarta-feira', 5: 'Quinta-feira', 6: 'Sexta-feira', 7: 'Sábado' };
    return dias[num] || 'A Definir';
  };

  if (loading) return <View style={globalStyles.centeredContent}><ActivityIndicator size="large" color={colors.primary} /></View>;

  return (
    <View style={globalStyles.mainContainer}>
      <FlatList
        data={grade}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={globalStyles.scrollContainer}
        ListHeaderComponent={() => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Ionicons name="calendar-outline" size={30} color={colors.info} style={{ marginRight: 10 }} />
            <Text style={globalStyles.screenTitle}>Minha Grade</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textMuted }}>Você não está matriculado em nenhuma disciplina no momento.</Text>}
        renderItem={({ item }) => (
          <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: colors.info, flexDirection: 'row', marginBottom: 15 }]}>
            
            {/* Seção de Horários (Esquerda) */}
            <View style={styles.horarioContainer}>
              <Text style={styles.horaTexto}>
                {item.horario_inicio ? item.horario_inicio.substring(0, 5) : '--:--'}
              </Text>
              <Text style={styles.divisor}>até</Text>
              <Text style={styles.horaTexto}>
                {item.horario_fim ? item.horario_fim.substring(0, 5) : '--:--'}
              </Text>
            </View>

            {/* Seção de Informações (Direita) */}
            <View style={{ flex: 1 }}>
              <Text style={styles.diaSemana}>{getDiaSemana(item.dia_semana).toUpperCase()}</Text>
              <Text style={globalStyles.cardTitle}>{item.nome}</Text>
              
              <View style={styles.infoRow}>
                <Ionicons name="person" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>
                  Prof: {item.professor_nome || 'A Definir'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Ionicons name="location" size={14} color={colors.textMuted} />
                <Text style={styles.infoText}>Sala: {item.sala || 'A Definir'}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  horarioContainer: {
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#eee'
  },
  horaTexto: {
    fontWeight: 'bold',
    fontSize: 16,
    color: colors.info
  },
  divisor: {
    fontSize: 12,
    color: '#888',
    marginVertical: 2
  },
  diaSemana: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: 'bold',
    marginBottom: 4
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  infoText: {
    color: colors.textMuted,
    marginLeft: 5,
    fontSize: 14
  }
});