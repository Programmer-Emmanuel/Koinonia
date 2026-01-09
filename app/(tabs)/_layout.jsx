import { Tabs } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'react-native-drawer-layout';
import { useState } from 'react';
import { MenuDrawer } from '../../components/Menu/MenuDrawer';

export default function TabLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const renderDrawerContent = () => (
    <MenuDrawer setDrawerOpen={setDrawerOpen} />
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      <Drawer
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
        drawerPosition="right"
        renderDrawerContent={renderDrawerContent}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <Tabs
            screenOptions={{
              headerShown: false,
              tabBarShowLabel: true,

              tabBarActiveTintColor: '#007BFF',
              tabBarInactiveTintColor: '#9CA3AF',

              tabBarStyle: {
                height: 72,
                paddingBottom: 8,
                paddingTop: 6,
                backgroundColor: '#FFFFFF',
                borderTopWidth: 0.5,
                borderTopColor: '#E5E7EB',
              },

              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
                marginTop: 2,
              },

              tabBarIconStyle: {
                marginTop: 4,
              },

              tabBarItemStyle: {
                justifyContent: 'center',
                alignItems: 'center',
              },
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                tabBarLabel: 'Bible',
                tabBarIcon: ({ color }) => (
                  <Feather name="book-open" size={22} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="dictionnaire"
              options={{
                tabBarLabel: 'Dictionnaire',
                tabBarIcon: ({ color }) => (
                  <Feather name="book" size={22} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="meditation"
              options={{
                tabBarLabel: 'Méditation',
                tabBarIcon: ({ color }) => (
                  <Feather name="heart" size={22} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="forum"
              options={{
                tabBarLabel: 'Forum',
                tabBarIcon: ({ color }) => (
                  <Feather name="message-circle" size={22} color={color} />
                ),
              }}
            />

            <Tabs.Screen
              name="menu"
              options={{
                tabBarLabel: 'Menu',
                tabBarIcon: ({ color }) => (
                  <Feather name="menu" size={22} color={color} />
                ),
              }}
              listeners={{
                tabPress: (e) => {
                  e.preventDefault();
                  setDrawerOpen(true);
                },
              }}
            />
          </Tabs>
        </SafeAreaView>
      </Drawer>
    </GestureHandlerRootView>
  );
}
