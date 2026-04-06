import {Dimensions, StyleSheet} from 'react-native';

const {width} = Dimensions.get('window');
const horizontalPadding = 14;
const buttonSpacing = 8;
const estimatedButtonSize =
  (width - horizontalPadding * 2 - buttonSpacing * 6) / 4;
const buttonSize = Math.max(64, Math.min(86, Math.floor(estimatedButtonSize)));

export const colors = {
  backgroundTop: '#060611',
  backgroundBottom: '#030307',
  panel: 'rgba(10, 14, 34, 0.88)',
  panelBorder: 'rgba(0, 245, 255, 0.32)',
  panelGlow: '#00f5ff',
  neonCyan: '#00f5ff',
  neonMagenta: '#ff2bd6',
  neonBlue: '#6d8cff',
  numberButton: 'rgba(8, 16, 38, 0.92)',
  utilityButton: 'rgba(24, 30, 55, 0.95)',
  dangerButton: 'rgba(70, 18, 40, 0.95)',
  operatorButton: 'rgba(17, 28, 57, 0.95)',
  textPrimary: '#eaf8ff',
  textMuted: '#82a6bf',
  textDark: '#04020b',
};

export const GlobalTheme = StyleSheet.create({
  homeScreenContainer: {
    flex: 1,
    backgroundColor: colors.backgroundTop,
  },
  calculatorContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: horizontalPadding,
    paddingBottom: 14,
  },
  backgroundGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  orbMagenta: {
    position: 'absolute',
    top: 80,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 43, 214, 0.13)',
  },
  orbCyan: {
    position: 'absolute',
    bottom: 180,
    left: -65,
    width: 230,
    height: 230,
    borderRadius: 115,
    backgroundColor: 'rgba(0, 245, 255, 0.11)',
  },
  displayPanel: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.panelBorder,
    backgroundColor: colors.panel,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    shadowColor: colors.panelGlow,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 10,
  },
  displayTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  displayLabel: {
    color: colors.neonCyan,
    fontSize: 12,
    letterSpacing: 2,
    fontWeight: '700',
  },
  displaySubtotal: {
    color: colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
  displayFormula: {
    color: colors.neonBlue,
    fontSize: 20,
    textAlign: 'right',
    marginBottom: 6,
  },
  displayNumber: {
    color: colors.textPrimary,
    fontSize: 54,
    textAlign: 'right',
    fontWeight: '300',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: buttonSpacing,
  },
  buttonBase: {
    flex: 1,
    height: buttonSize,
    marginHorizontal: 4,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    overflow: 'hidden',
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{scale: 0.96}],
  },
  buttonNumber: {
    backgroundColor: colors.numberButton,
    borderColor: 'rgba(0, 245, 255, 0.35)',
  },
  buttonUtility: {
    backgroundColor: colors.utilityButton,
    borderColor: 'rgba(109, 140, 255, 0.45)',
  },
  buttonDanger: {
    backgroundColor: colors.dangerButton,
    borderColor: 'rgba(255, 43, 214, 0.55)',
  },
  buttonOperator: {
    backgroundColor: colors.operatorButton,
    borderColor: 'rgba(255, 43, 214, 0.55)',
  },
  buttonEquals: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255, 255, 255, 0.22)',
  },
  buttonGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  buttonText: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  operatorText: {
    color: '#ffd9ff',
  },
  utilityText: {
    color: '#cfdcff',
  },
  dangerText: {
    color: '#ffd6f4',
  },
  equalsText: {
    color: colors.textDark,
  },
});
