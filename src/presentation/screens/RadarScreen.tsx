import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import { colors } from '../../core/theme';
import { useRadarStore } from '../../app/stores/useRadarStore';
import { useProximityPermissions } from '../../infrastructure/ble/useProximityPermissions';
import { BLEProximityService } from '../../infrastructure/ble/BLEProximityService';
import { ProximityRangeSelector } from '../components/radar/ProximityRangeSelector';
import { IntentionFilterBar } from '../components/radar/IntentionFilterBar';
import { UserPreviewModal } from '../components/radar/UserPreviewModal';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/GlassCard';
import { User } from '../../domain/entities/User';
import * as Linking from 'expo-linking';
import { supabase } from '../../infrastructure/backend/supabase';

export const RadarScreen = () => {
  const { isMapView, setMapView, isDevMockMode } = useRadarStore();
  const hasPermissions = useProximityPermissions();
  const [detectedUsers, setDetectedUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Track notified users to prevent spam
  const notifiedUsers = React.useRef(new Set<string>());

  useEffect(() => {
    // Supabase Realtime channel for Radar updates (Ghost Mode and Blocks)
    const channel = supabase.channel('radar_updates')
      .on('broadcast', { event: 'user_blocked' }, (payload) => {
        setDetectedUsers(prev => prev.filter(u => u.id !== payload.payload.blockedUserId));
        if (selectedUser?.id === payload.payload.blockedUserId) setSelectedUser(null);
      })
      .on('broadcast', { event: 'ghost_mode_changed' }, (payload) => {
        if (payload.payload.isGhostMode) {
           setDetectedUsers(prev => prev.filter(u => u.id !== payload.payload.userId));
           if (selectedUser?.id === payload.payload.userId) setSelectedUser(null);
        }
      })
      .subscribe();

    BLEProximityService.initialize();

    if (hasPermissions) {
      if (isDevMockMode) {
        // Generate mock users for testing
        setDetectedUsers([
          {
            id: '1',
            email: 'test@lazzos.app',
            fullName: 'María González',
            shortBio: 'Diseñadora gráfica freelance. Tomando un café.',
            intentions: ['Negocios/Servicios'],
            socialLinks: { instagram: '@maru_dg' },
            isGhostMode: false,
            createdAt: new Date(),
            updatedAt: new Date()
          } as User,
          {
            id: '2',
            email: 'dev@lazzos.app',
            fullName: 'Lucas Dev',
            shortBio: 'Desarrollador buscando cofounder.',
            intentions: ['Amigos'],
            isGhostMode: false,
            createdAt: new Date(),
            updatedAt: new Date()
          } as User
        ]);
      } else {
        setDetectedUsers([]); // Clear when dev mode is off
      }

      BLEProximityService.startScanning((device) => {
        // Debounce/deduplicate notifications for same user
        const deviceId = device.id || 'unknown';
        if (!notifiedUsers.current.has(deviceId)) {
          notifiedUsers.current.add(deviceId);
          BLEProximityService.notifyMatch('Nuevo perfil encontrado', 'Alguien coincide con tus intenciones cerca.');
        }
      });
    }

    return () => {
      BLEProximityService.stopScanning();
      supabase.removeChannel(channel);
    };
  }, [hasPermissions, isDevMockMode, selectedUser]);

  return (
    <View style={styles.container}>
      {/* Top Header Toggle */}
      <View style={styles.header}>
        <Text style={styles.title}>Radar</Text>
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Mapa</Text>
          <Switch
            trackColor={{ false: colors.glassBorder, true: colors.primary }}
            thumbColor={isMapView ? colors.background : colors.textSecondary}
            onValueChange={setMapView}
            value={isMapView}
          />
        </View>
      </View>

      <IntentionFilterBar />
      <ProximityRangeSelector />

      {/* Permissions Error Handling */}
      {!hasPermissions && (
        <GlassCard style={styles.errorCard}>
          <Text style={styles.errorTitle}>Radar Desactivado</Text>
          <Text style={styles.errorSub}>Lazzos necesita permisos de Bluetooth y Ubicación para encontrar a las personas a tu alrededor.</Text>
          <Button
            title="Activar Permisos"
            onPress={() => Linking.openSettings()}
            style={styles.errorBtn}
          />
        </GlassCard>
      )}

      {/* Main View Area */}
      <View style={styles.viewArea}>
        {isMapView ? (
          <View style={styles.placeholderView}>
            <Text style={styles.placeholderText}>🗺️ Vista Mapa Activa</Text>
            <Text style={styles.placeholderSub}>Mapbox SDK renderizaría aquí con estilo oscuro.</Text>
          </View>
        ) : (
          <View style={styles.radarView}>
            {/* Pulsing rings placeholder */}
            <View style={styles.radarRing1}>
              <View style={styles.radarRing2}>
                <View style={styles.radarCenter} />
              </View>
            </View>

            {/* Render detected users (Mocked position) */}
            {detectedUsers.map((user, i) => {
              // Simple randomish scatter for mock mode visual
              const top = i % 2 === 0 ? '30%' : '70%';
              const left = i % 2 === 0 ? '60%' : '25%';
              return (
                <TouchableOpacity
                  key={user.id}
                  style={[styles.userNode, { top, left }]}
                  onPress={() => setSelectedUser(user)}
                >
                  <View style={styles.userAvatar} />
                </TouchableOpacity>
              )
            })}
          </View>
        )}
      </View>

      <UserPreviewModal
        user={selectedUser}
        visible={!!selectedUser}
        onClose={() => setSelectedUser(null)}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  viewArea: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholderSub: {
    color: colors.textSecondary,
    marginTop: 8,
  },
  radarView: {
    width: 300,
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarRing1: {
    width: 300,
    height: 300,
    borderRadius: 150,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 198, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarRing2: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 198, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radarCenter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  userNode: {
    position: 'absolute',
    padding: 4,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.secondary,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  errorCard: {
    margin: 16,
    borderColor: 'red',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    color: 'red',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  errorSub: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  errorBtn: {
    backgroundColor: 'red',
    paddingHorizontal: 24,
  }
});
