// src/screens/ListaCursosScreen.js
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator, Alert, FlatList, Modal, ScrollView,
    StyleSheet, Text, TextInput, TouchableOpacity, View
} from 'react-native';
import api from '../services/api';
import { colors, globalStyles } from '../styles/globalStyles';

import { Picker } from '@react-native-picker/picker';
const ModalField = ({ label, ...props }) => (
    <View style={{ marginBottom: 12 }}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <TextInput style={styles.fieldInput} placeholderTextColor="#A0AEC0" {...props} />
    </View>
);

// Campos iniciais em branco
const TIPOS_CURSO = ['Bacharelado', 'Tecnólogo', 'Técnico', 'ETEC'];

// Cor e ícone por tipo
const TIPO_META = {
    'Bacharelado': { cor: '#0984E3', icone: 'school'        },
    'Tecnólogo':   { cor: '#6C5CE7', icone: 'laptop'        },
    'Técnico':     { cor: '#00B894', icone: 'construct'      },
    'ETEC':        { cor: '#E17055', icone: 'business'       },
};

const FORM_VAZIO = { nome: '', area: '', duracao: '', coordenador: '', etec: '', tipo: '' };

export default function ListaCursosScreen({ navigation }) {
    const [cursos, setCursos]           = useState([]);
    const [loading, setLoading]         = useState(true);
    const [salvando, setSalvando]       = useState(false);
    const [modalVisible, setModal]      = useState(false);
    const [cursoEdit, setCursoEdit]     = useState(null);   // null = novo, objeto = edição
    const [form, setForm]               = useState(FORM_VAZIO);

    // ── Carrega lista ───────────────────────────────────────
    const buscarCursos = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/cursos');
            setCursos(data);
        } catch {
            Alert.alert('Erro', 'Não foi possível carregar os cursos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const unsub = navigation.addListener('focus', buscarCursos);
        return unsub;
    }, [navigation, buscarCursos]);

    // ── Abrir modal ─────────────────────────────────────────
    const abrirNovo = () => {
        setCursoEdit(null);
        setForm(FORM_VAZIO);
        setModal(true);
    };

    const abrirEdicao = (curso) => {
        setCursoEdit(curso);
        setForm({
            nome:        curso.nome        || '',
            area:        curso.area        || '',
            duracao:     curso.duracao     || '',
            coordenador: curso.coordenador || '',
            etec:        curso.etec        || '',
            tipo:        curso.tipo        || '',
        });
        setModal(true);
    };

    // ── Salvar (criar ou editar) ────────────────────────────
    const salvar = async () => {
        if (!form.nome.trim()) {
            Alert.alert('Atenção', 'O nome do curso é obrigatório.');
            return;
        }
        setSalvando(true);
        try {
            if (cursoEdit) {
                await api.put(`/admin/cursos/${cursoEdit.id}`, form);
                Alert.alert('Sucesso', 'Curso atualizado!');
            } else {
                await api.post('/admin/cursos', form);
                Alert.alert('Sucesso', 'Curso cadastrado!');
            }
            setModal(false);
            buscarCursos();
        } catch (error) {
            Alert.alert('Erro', error.response?.data?.erro || 'Erro ao salvar curso.');
        } finally {
            setSalvando(false);
        }
    };

    // ── Excluir ─────────────────────────────────────────────
    const confirmarExclusao = (curso) => {
        Alert.alert(
            'Excluir Curso',
            `Deseja excluir "${curso.nome}"?\nOs alunos vinculados serão desvinculados.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Excluir',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await api.delete(`/admin/cursos/${curso.id}`);
                            Alert.alert('Removido', 'Curso excluído com sucesso.');
                            buscarCursos();
                        } catch {
                            Alert.alert('Erro', 'Não foi possível excluir o curso.');
                        }
                    },
                },
            ]
        );
    };

    // ── Render do card ──────────────────────────────────────
    const renderCurso = ({ item }) => {
        const meta = TIPO_META[item.tipo] || { cor: colors.textMuted, icone: 'help-circle' };

        return (
        <View style={[globalStyles.card, styles.card]}>
            {/* Cabeçalho */}
            <View style={styles.cardHeader}>
                <View style={[styles.iconWrap, { backgroundColor: meta.cor + '20' }]}>
                    <Ionicons name={meta.icone} size={22} color={meta.cor} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={globalStyles.cardTitle} numberOfLines={2}>{item.nome}</Text>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                        {item.tipo ? (
                            <View style={[styles.tipoBadge, { backgroundColor: meta.cor + '20', borderColor: meta.cor }]}>
                                <Ionicons name={meta.icone} size={11} color={meta.cor} />
                                <Text style={[styles.tipoBadgeText, { color: meta.cor }]}>{item.tipo}</Text>
                            </View>
                        ) : null}
                        {item.area ? (
                            <Text style={styles.badge}>{item.area}</Text>
                        ) : null}
                    </View>
                </View>
            </View>

            {/* Detalhes */}
            <View style={styles.details}>
                <InfoRow icon="time-outline"     label="Duração"      value={item.duracao}     />
                <InfoRow icon="person-outline"   label="Coord."       value={item.coordenador} />
                <InfoRow icon="business-outline" label="ETEC/Fatec"   value={item.etec}        />
                <InfoRow icon="people-outline"   label="Alunos"       value={`${item.total_alunos || 0} vinculado(s)`} />
            </View>

            {/* Ações */}
            <View style={styles.actions}>
                <TouchableOpacity style={[styles.btn, styles.btnEdit]} onPress={() => abrirEdicao(item)}>
                    <Ionicons name="create-outline" size={16} color={colors.primary} />
                    <Text style={[styles.btnText, { color: colors.primary }]}>Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.btn, styles.btnDelete]} onPress={() => confirmarExclusao(item)}>
                    <Ionicons name="trash-outline" size={16} color={colors.danger} />
                    <Text style={[styles.btnText, { color: colors.danger }]}>Excluir</Text>
                </TouchableOpacity>
            </View>
        </View>
        );
    };

    // ── Render principal ────────────────────────────────────
    return (
        <View style={globalStyles.mainContainer}>
            {loading ? (
                <View style={globalStyles.centeredContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={cursos}
                    keyExtractor={(i) => i.id.toString()}
                    renderItem={renderCurso}
                    contentContainerStyle={globalStyles.scrollContainer}
                    ListHeaderComponent={() => (
                        <View style={styles.header}>
                            <Text style={globalStyles.screenTitle}>Cursos</Text>
                            <TouchableOpacity style={styles.addBtn} onPress={abrirNovo}>
                                <Ionicons name="add" size={24} color="white" />
                            </TouchableOpacity>
                        </View>
                    )}
                    ListEmptyComponent={
                        <View style={globalStyles.centeredContent}>
                            <Ionicons name="school-outline" size={60} color={colors.border} />
                            <Text style={{ color: colors.textMuted, marginTop: 12, textAlign: 'center' }}>
                                Nenhum curso cadastrado.{'\n'}Toque em + para adicionar.
                            </Text>
                        </View>
                    }
                />
            )}

            {/* ══════════ MODAL DE CADASTRO / EDIÇÃO ══════════ */}
            <Modal visible={modalVisible} animationType="slide" transparent>
                <View style={styles.overlay}>
                    <View style={styles.modalBox}>
                        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                            {/* Título */}
                            <View style={styles.modalHeader}>
                                <Ionicons name="school" size={24} color={colors.primary} />
                                <Text style={styles.modalTitle}>
                                    {cursoEdit ? 'Editar Curso' : 'Novo Curso'}
                                </Text>
                            </View>

                            <ModalField
                                label="Nome do Curso *"
                                placeholder="Ex: Desenvolvimento de Software Multiplataforma"
                                value={form.nome}
                                onChangeText={(v) => setForm(f => ({ ...f, nome: v }))}
                            />
                            <ModalField
                                label="Área"
                                placeholder="Ex: Tecnologia da Informação"
                                value={form.area}
                                onChangeText={(v) => setForm(f => ({ ...f, area: v }))}
                            />
                            <ModalField
                                label="Duração"
                                placeholder="Ex: 3 anos / 6 semestres"
                                value={form.duracao}
                                onChangeText={(v) => setForm(f => ({ ...f, duracao: v }))}
                            />
                            <ModalField
                                label="Coordenador"
                                placeholder="Nome do coordenador"
                                value={form.coordenador}
                                onChangeText={(v) => setForm(f => ({ ...f, coordenador: v }))}
                            />
                            <ModalField
                                label="ETEC / Fatec"
                                placeholder="Ex: Fatec Jacareí"
                                value={form.etec}
                                onChangeText={(v) => setForm(f => ({ ...f, etec: v }))}
                            />

                            {/* ── Tipo de curso ── */}
                            <Text style={styles.fieldLabel}>Tipo de Curso *</Text>
                            <View style={[styles.fieldInput, { padding: 0, overflow: 'hidden', marginBottom: 12 }]}>
                                <Picker
                                    selectedValue={form.tipo}
                                    onValueChange={(v) => setForm(f => ({ ...f, tipo: v }))}
                                >
                                    <Picker.Item label="— Selecione o tipo —" value="" color="#A0AEC0" />
                                    {TIPOS_CURSO.map((t) => (
                                        <Picker.Item key={t} label={t} value={t} />
                                    ))}
                                </Picker>
                            </View>

                            <TouchableOpacity
                                style={[globalStyles.buttonPrimary, { marginTop: 8 }]}
                                onPress={salvar}
                                disabled={salvando}
                            >
                                {salvando
                                    ? <ActivityIndicator color="#FFF" />
                                    : <Text style={globalStyles.buttonText}>
                                        {cursoEdit ? 'Salvar Alterações' : 'Cadastrar Curso'}
                                      </Text>
                                }
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[globalStyles.buttonPrimary, styles.cancelBtn]}
                                onPress={() => setModal(false)}
                            >
                                <Text style={globalStyles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// ── Componente auxiliar ────────────────────────────────────
const InfoRow = ({ icon, label, value }) => {
    if (!value) return null;
    return (
        <View style={styles.infoRow}>
            <Ionicons name={icon} size={14} color={colors.textMuted} />
            <Text style={styles.infoLabel}>{label}: </Text>
            <Text style={styles.infoValue} numberOfLines={1}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: 20,
    },
    addBtn: {
        backgroundColor: colors.primary, padding: 10,
        borderRadius: 12,
    },
    card: { borderLeftWidth: 5, borderLeftColor: colors.primary, marginBottom: 15 },
    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
    iconWrap: {
        backgroundColor: colors.primary + '15', padding: 10,
        borderRadius: 12,
    },
    tipoBadge: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        alignSelf: 'flex-start', borderWidth: 1,
        paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20,
    },
    tipoBadgeText: { fontSize: 11, fontWeight: '700' },
    badge: {
        marginTop: 4, alignSelf: 'flex-start',
        backgroundColor: colors.primary + '20',
        color: colors.primary, fontSize: 11, fontWeight: '700',
        paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20,
    },
    details: { gap: 6, marginBottom: 14 },
    infoRow: { flexDirection: 'row', alignItems: 'center' },
    infoLabel: { fontSize: 13, color: colors.textMuted, marginLeft: 5 },
    infoValue: { fontSize: 13, fontWeight: '600', color: colors.textMain, flex: 1 },
    actions: { flexDirection: 'row', gap: 10 },
    btn: {
        flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        paddingVertical: 8, borderRadius: 10, borderWidth: 1,
    },
    btnEdit:   { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
    btnDelete: { borderColor: colors.danger,  backgroundColor: colors.danger  + '10' },
    btnText:   { marginLeft: 5, fontWeight: '700', fontSize: 13 },

    // Modal
    overlay: {
        flex: 1, backgroundColor: 'rgba(0,0,0,0.55)',
        justifyContent: 'flex-end',
    },
    modalBox: {
        backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: 24, maxHeight: '90%',
    },
    modalHeader: {
        flexDirection: 'row', alignItems: 'center', marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20, fontWeight: 'bold',
        color: colors.textMain, marginLeft: 10,
    },
    fieldLabel: {
        fontSize: 13, fontWeight: '600',
        color: colors.primary, marginBottom: 6,
    },
    fieldInput: {
        backgroundColor: '#F7F9FC', borderWidth: 1,
        borderColor: colors.border, borderRadius: 12,
        padding: 14, fontSize: 15, color: colors.textMain,
    },
    cancelBtn: { backgroundColor: '#B2BEC3', marginTop: 10 },
});