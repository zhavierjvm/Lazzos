import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { RadarScreen } from '../../presentation/screens/RadarScreen';
import { ShowcaseScreen } from '../../presentation/screens/ShowcaseScreen';
import { InboxScreen } from '../../presentation/screens/InboxScreen';
import { ProfileScreen } from '../../presentation/screens/ProfileScreen';
import { ChatScreen } from '../../presentation/screens/chat/ChatScreen';
import { colors } from '../../core/theme';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Tab = createBottomTabNavigator();
const InboxStack = createNativeStackNavigator();

const InboxFlow = () => (
  <InboxStack.Navigator screenOptions={{ headerShown: false }}>
    <InboxStack.Screen name="InboxMain" component={InboxScreen} />
    <InboxStack.Screen name="Chat" component={ChatScreen} />
  </InboxStack.Navigator>
);

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
      <Tab.Screen name="Inbox" component={InboxFlow} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
