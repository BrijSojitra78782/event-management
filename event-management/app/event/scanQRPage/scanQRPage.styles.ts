import { StyleSheet } from 'react-native';
import {Platform } from 'react-native';

export default StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0f14' },
  header: { paddingTop: Platform.select({ ios: 60, android: 40 }), paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: '700', color: '#ffffff' },
  subtitle: { marginTop: 6, fontSize: 14, color: '#9aa4af' },

  scannerWrapper: {
    position: 'relative',
    marginTop: 20,
    marginHorizontal: 16,
    height: 340,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
  },

  // Semi-transparent mask around the focus square
  maskOuter: { ...StyleSheet.absoluteFillObject },
  maskRow: { width: '100%' },
  maskCenter: { flexDirection: 'row' },
  maskFrame: { backgroundColor: 'rgba(0,0,0,0.45)', flex: 1 },

  // The scanning focus square
  focusSquare: {
    width: 220,
    height: 220,
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#6ee7b7',
    backgroundColor: 'transparent',
  },

  actions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a3441',
    backgroundColor: '#131a22',
    alignItems: 'center',
  },
  buttonActive: { borderColor: '#6ee7b7' },
  primaryButton: { backgroundColor: '#6ee7b7', borderColor: '#6ee7b7' },
  buttonText: { color: '#e5eef7', fontSize: 14, fontWeight: '600' },
  primaryButtonText: { color: '#0b0f14' },
  placeholder: { flex: 1 },

  resultCard: {
    marginTop: 16,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0f151c',
    borderWidth: 1,
    borderColor: '#223041',
  },
  resultTitle: { color: '#9aa4af', fontSize: 12, marginBottom: 6 },
  resultValue: { color: '#ffffff', fontSize: 14, lineHeight: 20 },
  hintText: { color: '#9aa4af', marginTop: 8, fontSize: 12 },
  centerBox: {
    flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#0b0f14',
  },
  subtleText: { color: '#9aa4af', textAlign: 'center' },
  errorText: { color: '#ff6b6b', fontWeight: '700', fontSize: 16, marginBottom: 8, textAlign: 'center' },
});