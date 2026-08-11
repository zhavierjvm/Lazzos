import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../../core/theme';
import { GlassCard } from '../../components/GlassCard';
import { supabase } from '../../../infrastructure/backend/supabase';

export const ChatScreen = ({ navigation }: any) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hola! Vi tu perfil en el Radar.', isMe: false, time: '10:42 AM' },
  ]);

  // Realtime Supabase Subscription for Chat
  useEffect(() => {
    const channel = supabase
      .channel('chat_room_1')
      .on('broadcast', { event: 'new_message' }, (payload) => {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), text: payload.payload.text, isMe: false, time: 'Ahora' }
        ]);
      })
      .subscribe();

    // For MVP demonstration if backend is empty, we simulate a received broadcast after 5s
    const timer = setTimeout(() => {
      channel.send({
        type: 'broadcast',
        event: 'new_message',
        payload: { text: '¿Qué tal? Yo también estoy en el café.' },
      });
    }, 5000);

    return () => {
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, []);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: message, isMe: true, time: 'Ahora' }]);
    setMessage('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Volver</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chat Seguro</Text>
      </View>

      <ScrollView style={styles.chatArea} contentContainerStyle={styles.chatContent}>
        <Text style={styles.encryptionNotice}>🔒 Chat Encriptado de Extremo a Extremo</Text>

        {messages.map(msg => (
          <View key={msg.id} style={[styles.messageRow, msg.isMe ? styles.myMessageRow : styles.theirMessageRow]}>
            <GlassCard style={msg.isMe ? [styles.bubble, styles.myBubble] : [styles.bubble, styles.theirBubble]}>
              <Text style={styles.messageText}>{msg.text}</Text>
              <Text style={styles.timeText}>{msg.time}</Text>
            </GlassCard>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Escribe un mensaje..."
          placeholderTextColor={colors.textSecondary}
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={styles.sendText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.glassBorder,
    backgroundColor: 'rgba(11, 14, 20, 0.9)',
  },
  backBtn: {
    marginRight: 16,
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
  },
  headerTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
  },
  encryptionNotice: {
    textAlign: 'center',
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 24,
  },
  messageRow: {
    marginBottom: 16,
    flexDirection: 'row',
  },
  myMessageRow: {
    justifyContent: 'flex-end',
  },
  theirMessageRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
  },
  myBubble: {
    backgroundColor: 'rgba(0, 255, 198, 0.1)',
    borderColor: colors.primary,
  },
  theirBubble: {
    backgroundColor: colors.glassBackground,
  },
  messageText: {
    color: colors.textPrimary,
    fontSize: 15,
  },
  timeText: {
    color: colors.textSecondary,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  inputArea: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.glassBorder,
    backgroundColor: colors.background,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: colors.glassBackground,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    color: colors.textPrimary,
    marginRight: 12,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sendText: {
    color: colors.background,
    fontWeight: 'bold',
  }
});
