import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Switch, TouchableOpacity } from 'react-native';
import { colors } from '../../core/theme';
import { useRadarStore } from '../../app/stores/useRadarStore';
import { useProximityPermissions } from '../../infrastructure/ble/useProximityPermissions';
import { BLEProximityService } from '../../infrastructure/ble/BLEProximityService';
import { ProximityRangeSelector } from '../components/radar/ProximityRangeSelector';
import { IntentionFilterBar } from '../components/radar/IntentionFilterBar';
import { UserPreviewModal } from '../components/radar/UserPreviewModal';
import { User } from '../../domain/entities/User';

export const RadarScreen = () => {
  const { isMapView, setMapView } = useRadarStore();
  const hasPermissions = useProximityPermissions();
  const [detectedUsers, setDetectedUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    BLEProximityService.initialize();

    if (hasPermissions) {
      // Mocked data insertion for MVP UI purposes since actual BLE devices aren't present
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
        } as User
      ]);

      BLEProximityService.startScanning((device) => {
        // Logic to update detected users state
        // console.log("Found device:", device);
      });
    }

    return () => {
      BLEProximityService.stopScanning();
    };
  }, [hasPermissions]);

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
            {detectedUsers.map((user, i) => (
              <TouchableOpacity
                key={user.id}
                style={[styles.userNode, { top: '30%', left: '60%' }]}
                onPress={() => setSelectedUser(user)}
              >
                <View style={styles.userAvatar} />
              </TouchableOpacity>
            ))}
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
  }
});
