import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../../../core/theme';
import { GlassCard } from '../../components/GlassCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuthStore } from '../../../app/stores/useAuthStore';
import { AuthService } from '../../../infrastructure/backend/AuthService';

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (email && password) {
        await AuthService.signIn(email, password);
      } else {
        // Fallback for simulation if no credentials are provided during UI testing
        useAuthStore.getState().setSession({} as any);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Lazzos</Text>
        <Text style={styles.subtitle}>Conecta con quien tienes cerca</Text>

        <GlassCard style={styles.card}>
          <Input
            placeholder="Correo Electrónico"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Input
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button title="Iniciar Sesión" onPress={handleLogin} style={styles.loginBtn} />

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>O</Text>
            <View style={styles.line} />
          </View>

          <Button title="Continuar con Google" onPress={() => {}} variant="outline" />
          <Button title="Continuar con Apple" onPress={() => {}} variant="outline" />
        </GlassCard>

        <Button
          title="¿No tienes cuenta? Regístrate"
          onPress={() => navigation.navigate('Register')}
          variant="outline"
          style={styles.registerBtn}
          textStyle={{ color: colors.textSecondary }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    padding: 24,
  },
  loginBtn: {
    marginTop: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.glassBorder,
  },
  dividerText: {
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  registerBtn: {
    marginTop: 24,
    borderWidth: 0,
  }
});
