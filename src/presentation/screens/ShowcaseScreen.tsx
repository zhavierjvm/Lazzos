import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { colors } from '../../core/theme';
import { GlassCard } from '../components/GlassCard';
import { IntentionFilterBar } from '../components/radar/IntentionFilterBar';
import { useRadarStore } from '../../app/stores/useRadarStore';
import { User, CatalogItem } from '../../domain/entities/User';
import { Button } from '../components/ui/Button';
import { GlassSkeleton } from '../components/ui/GlassSkeleton';

// Mock data for the feed
const MOCK_PITCHES: User[] = [
  {
    id: '1',
    email: 'maru@example.com',
    fullName: 'María González',
    shortBio: 'Diseñadora gráfica freelance. Creando identidades visuales únicas. ¿Tomamos un café y hablamos de tu marca?',
    intentions: ['Negocios/Servicios', 'Emprendimiento/Ventas'],
    socialLinks: { instagram: '@maru_dg', linkedin: 'linkedin.com/in/maru' },
    isGhostMode: false,
    isPremium: true,
    catalogItems: [
      { id: 'c1', title: 'Logo Design', price: '$150' },
      { id: 'c2', title: 'Brand Kit', price: '$300' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    email: 'carlos@example.com',
    fullName: 'Carlos Dev',
    shortBio: 'Buscando co-founder técnico para startup Fintech. Actualmente en fase MVP.',
    intentions: ['Negocios/Servicios'],
    socialLinks: { linkedin: 'linkedin.com/in/carlos' },
    isGhostMode: false,
    isPremium: false,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    email: 'ana@example.com',
    fullName: 'Ana Bake',
    shortBio: '¡Hola! Vendo postres veganos artesanales a 2 cuadras de aquí. ¡Pásate por el parque!',
    intentions: ['Emprendimiento/Ventas'],
    socialLinks: { whatsapp: '+123456789' },
    isGhostMode: false,
    isPremium: false,
    catalogItems: [
      { id: 'c3', title: 'Brownie Vegano', price: '$5' },
      { id: 'c4', title: 'Cheesecake Frutos Rojos', price: '$12' },
      { id: 'c5', title: 'Galletas de Avena', price: '$3' }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const ShowcaseScreen = () => {
  const { selectedFilter } = useRadarStore();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, [selectedFilter]);

  const filteredPitches = useMemo(() => {
    if (selectedFilter === 'Todos') return MOCK_PITCHES;
    return MOCK_PITCHES.filter(pitch => pitch.intentions.includes(selectedFilter as any));
  }, [selectedFilter]);

  const renderCatalogItem = (item: CatalogItem) => (
    <View key={item.id} style={styles.catalogItem}>
      <View style={styles.catalogImgPlaceholder} />
      <View style={styles.catalogInfo}>
        <Text style={styles.catalogTitle}>{item.title}</Text>
        <Text style={styles.catalogPrice}>{item.price}</Text>
      </View>
    </View>
  );

  const renderPitchCard = ({ item }: { item: User }) => (
    <GlassCard style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.avatarPlaceholder} />
        <View style={styles.headerText}>
          <Text style={styles.name}>
            {item.fullName} {item.isPremium && <Text style={styles.proBadge}>★ PRO</Text>}
          </Text>
          <View style={styles.tagsContainer}>
            {item.intentions.map(tag => (
              <Text key={tag} style={styles.tagText}>#{tag.split('/')[0]}</Text>
            ))}
          </View>
        </View>
      </View>

      <Text style={styles.bio}>{item.shortBio}</Text>

      {item.intentions.includes('Emprendimiento/Ventas') && item.catalogItems && (
        <View style={styles.catalogContainer}>
          <Text style={styles.catalogHeader}>Catálogo Rápido:</Text>
          <View style={styles.catalogList}>
            {item.catalogItems.slice(0, 3).map(renderCatalogItem)}
          </View>
        </View>
      )}

      <Button title="Conectar" variant="outline" onPress={() => {}} style={styles.connectBtn} />
    </GlassCard>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Showcase Feed</Text>
      <View style={styles.filterWrapper}>
        <IntentionFilterBar />
      </View>

      {isLoading ? (
        <View style={styles.listContent}>
          <GlassSkeleton style={{ height: 200, width: '100%', marginBottom: 16 }} />
          <GlassSkeleton style={{ height: 200, width: '100%' }} />
        </View>
      ) : (
        <FlatList
          data={filteredPitches}
          keyExtractor={item => item.id}
          renderItem={renderPitchCard}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.secondary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterWrapper: {
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  card: {
    padding: 20,
    borderColor: colors.secondary,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.glassBorder,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  proBadge: {
    color: colors.accent,
    fontSize: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  tagText: {
    color: colors.primary,
    fontSize: 12,
  },
  bio: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  catalogContainer: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  catalogHeader: {
    color: colors.textPrimary,
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 8,
  },
  catalogList: {
    gap: 8,
  },
  catalogItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.glassBackground,
    padding: 8,
    borderRadius: 8,
  },
  catalogImgPlaceholder: {
    width: 40,
    height: 40,
    backgroundColor: colors.glassBorder,
    borderRadius: 4,
    marginRight: 12,
  },
  catalogInfo: {
    flex: 1,
  },
  catalogTitle: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: 'bold',
  },
  catalogPrice: {
    color: colors.accent,
    fontSize: 12,
    marginTop: 2,
  },
  connectBtn: {
    paddingVertical: 8,
    borderColor: colors.secondary,
  }
});
