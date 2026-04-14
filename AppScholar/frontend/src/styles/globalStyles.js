// src/styles/globalStyles.js
import { Platform, StyleSheet } from 'react-native';

// Paleta de Cores Vibrante e Moderna
export const colors = {
  primary: '#6C5CE7',      // Roxo Vibrante (Principal)
  accent: '#00CEC9',       // Turquesa (Destaques)
  background: '#F0F3F7',   // Cinza muito claro azulado (Fundo)
  surface: '#FFFFFF',      // Branco (Cards)
  textMain: '#2D3436',     // Quase preto
  textMuted: '#636E72',    // Cinza
  border: '#DFE6E9',       // Borda suave
  
  // Cores de Situação (Feedback Visual)
  success: '#00B894',      // Verde (Aprovado)
  warning: '#FDCB6E',      // Amarelo (Exame/Atenção)
  danger: '#D63031',       // Vermelho (Reprovado)
  info: '#0984E3',         // Azul (Em andamento)
};

export const globalStyles = StyleSheet.create({
  // Containers
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 25,
  },

  // Tipografia
  hugeTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 1,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textMain,
    marginBottom: 25,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textMain,
    marginBottom: 5,
  },

  // Formulários (Inputs Modernos e Arredondados)
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary, // Label na cor principal
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 15, // Bem arredondado
    padding: 16,
    fontSize: 16,
    color: colors.textMain,
    // Sombra suave no input
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  // Botões Criativos
  buttonPrimary: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    // Sombra projetada
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonSecondary: {
    backgroundColor: colors.accent, // Usando a cor de destaque
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
  },
  buttonText: {
    color: colors.surface,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
  },

  // Cards e Feedback
  card: {
    backgroundColor: colors.surface,
    padding: 20,
    borderRadius: 20, // Cantos bem redondos
    marginBottom: 16,
    // Sombra "flutuante"
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  errorText: {
    color: colors.danger,
    textAlign: 'center',
    backgroundColor: '#FFE3E3',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    fontWeight: '600',
  },
});