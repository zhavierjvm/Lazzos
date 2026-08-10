import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RadarScreen } from '../../presentation/screens/RadarScreen';
import { ShowcaseScreen } from '../../presentation/screens/ShowcaseScreen';
import { InboxScreen } from '../../presentation/screens/InboxScreen';
import { ProfileScreen } from '../../presentation/screens/ProfileScreen';
import { colors } from '../../core/theme';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopColor: colors.glassBorder,
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen name="Radar" component={RadarScreen} />
      <Tab.Screen name="Showcase" component={ShowcaseScreen} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
