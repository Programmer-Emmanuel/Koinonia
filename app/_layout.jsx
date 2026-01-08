import { Stack } from 'expo-router';
import "../global.css";
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { registerForPushNotifications } from '../src/utils/notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Gestion affichage notification (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function Layout() {
  useEffect(() => {
    async function initPushToken() {
      try {
        // 1️⃣ Générer le Expo Push Token
        const expoToken = await registerForPushNotifications();

        if (!expoToken) {
          console.log('❌ Pas de token Expo');
          return;
        }

        console.log('📲 Expo Push Token:', expoToken);

        // 2️⃣ Récupérer le token Sanctum
        const authToken = await AsyncStorage.getItem('auth_token');

        if (!authToken) {
          console.log('ℹ️ Utilisateur non connecté, token non envoyé');
          return;
        }

        // 3️⃣ Envoyer à Laravel
        const response = await fetch(
          'https://baseURL/api/uptadeDeviceToken/',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({
              device_token: expoToken,
            }),
          }
        );

        const data = await response.json();
        console.log('✅ Device token envoyé:', data);
      } catch (error) {
        console.error('❌ Erreur push token:', error);
      }
    }

    initPushToken();

    // 4️⃣ Listener quand on clique la notification
    const sub =
      Notifications.addNotificationResponseReceivedListener(
        response => {
          console.log('🔔 Notification cliquée:', response);
        }
      );

    return () => sub.remove();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="profil" options={{ headerShown: false }} />
      <Stack.Screen name="inscription" options={{ headerShown: false }} />
      <Stack.Screen name="connexion" options={{ headerShown: false }} />
      <Stack.Screen name="otp" options={{ headerShown: false }} />
      <Stack.Screen name="apropos" options={{ headerShown: false }} />
      <Stack.Screen name="aide" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
