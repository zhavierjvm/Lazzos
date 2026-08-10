import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { GlassCard } from '../GlassCard';
import { Button } from '../ui/Button';
import { colors } from '../../../core/theme';
import { User } from '../../../domain/entities/User';
import { useRadarStore } from '../../../app/stores/useRadarStore';

interface UserPreviewModalProps {
  user: User | null;
  visible: boolean;
  onClose: () => void;
}

export const UserPreviewModal: React.FC<UserPreviewModalProps> = ({ user, visible, onClose }) => {
  const isFuzzyLocation = useRadarStore(state => state.isFuzzyLocation);

  if (!user) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />

        <GlassCard style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.avatarPlaceholder} />
            <View>
              <Text style={styles.name}>{user.fullName}</Text>
              <Text style={styles.distance}>
                {isFuzzyLocation ? 'En la misma zona' : 'A ~5 metros (BLE)'}
              </Text>
            </View>
          </View>

          <Text style={styles.bio}>{user.shortBio || 'Sin pitch disponible.'}</Text>

          <View style={styles.tagsContainer}>
            {user.intentions.map(tag => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>

          <View style={styles.socialContainer}>
            {user.socialLinks?.instagram && (
              <Button title="Instagram" variant="outline" onPress={() => {}} style={styles.socialBtn} />
            )}
            {user.socialLinks?.linkedin && (
              <Button title="LinkedIn" variant="outline" onPress={() => {}} style={styles.socialBtn} />
            )}
            {/* Paywall locked feature button */}
            <Button title="Chat In-App (Pro)" variant="primary" onPress={() => {}} style={styles.chatBtn} />
          </View>
        </GlassCard>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.glassBorder,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  distance: {
    color: colors.primary,
    fontSize: 12,
    marginTop: 4,
  },
  bio: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tag: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: 'bold',
  },
  socialContainer: {
    gap: 8,
  },
  socialBtn: {
    paddingVertical: 10,
  },
  chatBtn: {
    marginTop: 8,
    backgroundColor: colors.accent,
  }
});
