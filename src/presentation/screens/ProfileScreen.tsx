import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { colors } from '../../core/theme';
import { GlassCard } from '../components/GlassCard';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAuthStore } from '../../app/stores/useAuthStore';
import { IntentionCategory } from '../../domain/entities/User';
import { AuthService } from '../../infrastructure/backend/AuthService';

const CATEGORIES: IntentionCategory[] = [
  'Negocios/Servicios',
  'Citas',
  'Emprendimiento/Ventas',
  'Amigos'
];

export const ProfileScreen = () => {
  const [isGhostMode, setIsGhostMode] = useState(false);
  const [bio, setBio] = useState('');
  const [selectedIntentions, setSelectedIntentions] = useState<IntentionCategory[]>([]);
  const signOut = useAuthStore(state => state.signOut);

  const toggleIntention = (intention: IntentionCategory) => {
    setSelectedIntentions(prev =>
      prev.includes(intention)
        ? prev.filter(i => i !== intention)
        : [...prev, intention]
    );
  };

  const handleLogout = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      console.error(error);
      signOut(); // Fallback to clear state even if API fails
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>Mi Perfil</Text>

      {/* Ghost Mode Toggle */}
      <GlassCard style={styles.ghostCard}>
        <View style={styles.ghostRow}>
          <View>
            <Text style={styles.ghostTitle}>Modo Fantasma</Text>
            <Text style={styles.ghostSub}>Vuélvete invisible en el radar</Text>
          </View>
          <Switch
            trackColor={{ false: colors.glassBorder, true: colors.primary }}
            thumbColor={isGhostMode ? colors.background : colors.textSecondary}
            onValueChange={setIsGhostMode}
            value={isGhostMode}
          />
        </View>
      </GlassCard>

      {/* Digital Card Preview */}
      <Text style={styles.sectionTitle}>Tarjeta Digital</Text>
      <GlassCard style={styles.previewCard}>
        <View style={styles.avatarPlaceholder} />
        <Text style={styles.previewName}>Usuario de Prueba</Text>
        <Text style={styles.previewBio}>{bio || "Escribe un pitch corto aquí..."}</Text>

        <View style={styles.tagsContainer}>
          {selectedIntentions.map(tag => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </GlassCard>

      {/* Edit Form */}
      <Text style={styles.sectionTitle}>Editar Información</Text>
      <GlassCard style={styles.editCard}>
        <Input
          placeholder="Mi Pitch / Bio corta..."
          value={bio}
          onChangeText={setBio}
          multiline
          style={{ height: 80, textAlignVertical: 'top' }}
        />

        <Text style={styles.label}>Intenciones</Text>
        <View style={styles.intentionsWrapper}>
          {CATEGORIES.map(cat => {
            const isSelected = selectedIntentions.includes(cat);
            return (
              <Button
                key={cat}
                title={cat}
                variant={isSelected ? 'primary' : 'outline'}
                onPress={() => toggleIntention(cat)}
                style={isSelected ? [styles.intentionBtn, styles.intentionBtnSelected] : styles.intentionBtn}
                textStyle={{ fontSize: 12 }}
              />
            );
          })}
        </View>

        <Text style={styles.label}>Redes Sociales</Text>
        <Input placeholder="Instagram (Ej. @usuario)" />
        <Input placeholder="LinkedIn URL" />
      </GlassCard>

      <Button
        title="Cerrar Sesión"
        onPress={handleLogout}
        variant="outline"
        style={styles.logoutBtn}
        textStyle={{ color: 'red' }}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 24,
  },
  ghostCard: {
    marginBottom: 24,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  ghostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ghostTitle: {
    color: colors.primary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  ghostSub: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 12,
    marginTop: 8,
  },
  previewCard: {
    alignItems: 'center',
    padding: 24,
    marginBottom: 24,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.glassBorder,
    marginBottom: 16,
  },
  previewName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  previewBio: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
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
  editCard: {
    padding: 16,
  },
  label: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  intentionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  intentionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 0,
    borderColor: colors.glassBorder,
  },
  intentionBtnSelected: {
    borderColor: colors.primary,
  },
  logoutBtn: {
    marginTop: 32,
    borderColor: 'red',
  }
});
