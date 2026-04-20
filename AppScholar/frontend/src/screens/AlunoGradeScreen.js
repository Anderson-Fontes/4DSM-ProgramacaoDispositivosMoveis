import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View } from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

export default function AlunoGradeScreen() {
  const [grade, setGrade] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/academico/grade')
      .then(res => setGrade(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getDiaSemana = (num) => {
    const dias = { 1: 'Segunda-feira', 2: 'Terça-feira', 3: 'Quarta-feira', 4: 'Quinta-feira', 5: 'Sexta-feira', 6: 'Sábado' };
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
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.textMuted }}>Nenhuma aula agendada.</Text>}
        renderItem={({ item }) => (
          <View style={[globalStyles.card, { borderLeftWidth: 5, borderLeftColor: colors.info, flexDirection: 'row' }]}>
            <View style={{ marginRight: 15, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, color: colors.info }}>{item.horario_inicio ? item.horario_inicio.substring(0,5) : '--:--'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, color: colors.textMuted, fontWeight: 'bold' }}>{getDiaSemana(item.dia_semana).toUpperCase()}</Text>
              <Text style={globalStyles.cardTitle}>{item.nome}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                <Ionicons name="location" size={14} color={colors.textMuted} />
                <Text style={{ color: colors.textMuted, marginLeft: 5 }}>Sala: {item.sala || 'A Definir'}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}