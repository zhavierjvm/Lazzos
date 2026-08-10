import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { colors } from '../../core/theme';
import { GlassCard } from '../components/GlassCard';
import { PaywallModal } from '../components/ui/PaywallModal';
import { useAuthStore } from '../../app/stores/useAuthStore';
import { Button } from '../components/ui/Button';

// Mock list of potential connections (people nearby or who matched)
const MOCK_INBOX = [
  { id: '1', name: 'Laura', lastMsg: 'Hola! Vi tu perfil...', time: '10:42 AM', unread: true },
  { id: '2', name: 'Pedro Dev', lastMsg: 'Me interesa tu proyecto.', time: 'Ayer', unread: false },
];

export const InboxScreen = ({ navigation }: any) => {
  const isPremium = useAuthStore(state => state.userProfile?.isPremium);
  const [showPaywall, setShowPaywall] = useState(false);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  const handleOpenChat = (chatId: string) => {
    if (isPremium) {
      navigation.navigate('Chat', { chatId });
    } else {
      setSelectedChat(chatId);
      setShowPaywall(true);
    }
  };

  const onPaywallSuccess = () => {
    if (selectedChat) {
      navigation.navigate('Chat', { chatId: selectedChat });
    }
  };

  const renderInboxItem = ({ item }: { item: typeof MOCK_INBOX[0] }) => (
    <TouchableOpacity onPress={() => handleOpenChat(item.id)}>
      <GlassCard style={styles.chatItem}>
        <View style={styles.avatar} />
        <View style={styles.chatInfo}>
          <Text style={styles.chatName}>{item.name}</Text>
          <Text style={[styles.lastMsg, item.unread && styles.unreadMsg]}>
            {item.lastMsg}
          </Text>
        </View>
        <View style={styles.metaInfo}>
          <Text style={styles.time}>{item.time}</Text>
          {item.unread && <View style={styles.unreadDot} />}
        </View>
      </GlassCard>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inbox</Text>

      {!isPremium && (
        <GlassCard style={styles.promoCard}>
          <Text style={styles.promoText}>Actualiza a Lazzos PRO para desbloquear los mensajes in-app y chatear al instante.</Text>
          <Button
            title="Ver Beneficios"
            onPress={() => setShowPaywall(true)}
            style={styles.promoBtn}
            textStyle={{ color: '#000' }}
          />
        </GlassCard>
      )}

      <FlatList
        data={MOCK_INBOX}
        keyExtractor={item => item.id}
        renderItem={renderInboxItem}
        contentContainerStyle={styles.list}
      />

      <PaywallModal
        visible={showPaywall}
        onClose={() => setShowPaywall(false)}
        onSuccess={onPaywallSuccess}
      />
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
    color: colors.textPrimary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  promoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderColor: colors.accent,
    backgroundColor: 'rgba(255, 184, 0, 0.1)',
  },
  promoText: {
    color: colors.textPrimary,
    fontSize: 14,
    marginBottom: 12,
  },
  promoBtn: {
    backgroundColor: colors.accent,
    paddingVertical: 10,
  },
  list: {
    paddingHorizontal: 16,
    gap: 12,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.glassBorder,
    marginRight: 12,
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  lastMsg: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  unreadMsg: {
    color: colors.textPrimary,
    fontWeight: '600',
  },
  metaInfo: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  time: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 4,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  }
});
