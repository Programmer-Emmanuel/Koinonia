import { Tabs, useRouter } from 'expo-router';
import Feather from '@expo/vector-icons/Feather';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'react-native-drawer-layout';
import { useState } from 'react';
import { MenuDrawer } from '../../components/Menu/MenuDrawer';

export default function TabLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const renderDrawerContent = () => {
    return (
      <MenuDrawer setDrawerOpen={setDrawerOpen} />
    );
  };


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" className="bg-gray-50" />
      <Drawer
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
        drawerPosition="right"
        renderDrawerContent={renderDrawerContent}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: "#ffff" }}>
          <Tabs 
            screenOptions={{
              tabBarActiveTintColor: '#007BFF',
              headerShown: false,
              tabBarStyle: {
                height: 60,
              },
              tabBarItemStyle: {
                backgroundColor: ""
              }
            }}
          >
            <Tabs.Screen
              name="home"
              options={{
                tabBarLabel: 'Bible',
                tabBarIcon: ({ color }) => <Feather name="book-open" size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="dictionnaire"
              options={{
                tabBarLabel: 'Dictionnaire',
                tabBarIcon: ({ color }) => <Feather name="book" size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="meditation"
              options={{
                tabBarLabel: 'Meditation',
                tabBarIcon: ({ color }) => <Feather name="heart" size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="forum"
              options={{
                tabBarLabel: 'Forum',
                tabBarIcon: ({ color }) => <Feather name="message-circle" size={24} color={color} />,
              }}
            />
            <Tabs.Screen
              name="menu"
              options={{
                tabBarLabel: 'Menu',
                tabBarIcon: ({ color }) => <Feather name="menu" size={24} color={color} />,
              }}
              listeners={{
                tabPress: (e) => {
                  // Empêcher la navigation normale et ouvrir le drawer à la place
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