import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { GlassCard } from '../GlassCard';
import { Button } from './Button';
import { colors } from '../../../core/theme';
import { useAuthStore } from '../../../app/stores/useAuthStore';

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({ visible, onClose, onSuccess }) => {
  const setPremiumStatus = useAuthStore(state => state.setPremiumStatus);

  const handleSimulatePurchase = () => {
    // In reality, this would call RevenueCat / Stripe SDK
    setPremiumStatus(true);
    onSuccess();
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <GlassCard style={styles.modalContent}>
          <Text style={styles.title}>Lazzos <Text style={styles.proText}>PRO</Text></Text>
          <Text style={styles.subtitle}>Desbloquea conexiones sin límites</Text>

          <View style={styles.benefitsList}>
            <Text style={styles.benefitItem}>✨ Mensajes directos In-App ilimitados.</Text>
            <Text style={styles.benefitItem}>✨ Filtros avanzados y sin anuncios.</Text>
            <Text style={styles.benefitItem}>✨ Badge dorado exclusivo en tu perfil.</Text>
            <Text style={styles.benefitItem}>✨ Mayor visibilidad en el Showcase.</Text>
          </View>

          <Button
            title="Obtener Pro Pass ($4.99/mes)"
            onPress={handleSimulatePurchase}
            style={styles.purchaseBtn}
            textStyle={styles.purchaseBtnText}
          />

          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>No gracias, prefiero usar redes externas</Text>
          </TouchableOpacity>
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 24,
  },
  modalContent: {
    borderColor: colors.accent,
    borderWidth: 2,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  proText: {
    color: colors.accent,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  benefitsList: {
    width: '100%',
    marginBottom: 32,
    gap: 12,
  },
  benefitItem: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  purchaseBtn: {
    backgroundColor: colors.accent,
    width: '100%',
    paddingVertical: 16,
  },
  purchaseBtnText: {
    color: '#000', // Black text on gold button
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeBtn: {
    marginTop: 16,
    padding: 8,
  },
  closeBtnText: {
    color: colors.textSecondary,
    fontSize: 14,
    textDecorationLine: 'underline',
  }
});
