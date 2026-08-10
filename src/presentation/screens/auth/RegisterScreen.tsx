import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors } from '../../../core/theme';
import { GlassCard } from '../../components/GlassCard';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { AuthService } from '../../../infrastructure/backend/AuthService';
import { useAuthStore } from '../../../app/stores/useAuthStore';

export const RegisterScreen = ({ navigation }: any) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
     try {
       if (email && password && fullName) {
         await AuthService.signUp(email, password, fullName);
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
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Crear Cuenta</Text>

        <GlassCard style={styles.card}>
          <Input
            placeholder="Nombre Completo"
            value={fullName}
            onChangeText={setFullName}
          />
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

          <Button title="Registrarse" onPress={handleRegister} style={styles.registerBtn} />
        </GlassCard>

        <Button
          title="¿Ya tienes cuenta? Inicia sesión"
          onPress={() => navigation.goBack()}
          variant="outline"
          style={styles.loginBtn}
          textStyle={{ color: colors.textSecondary }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 32,
  },
  card: {
    padding: 24,
  },
  registerBtn: {
    marginTop: 24,
  },
  loginBtn: {
    marginTop: 24,
    borderWidth: 0,
  }
});
