import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function LayoutInscription() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: '',
          headerBackTitleVisible: false, // supprime le texte “Back” par défaut
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginLeft: 15 }}
              onPress={() => router.back()} // action du bouton retour
            >
              <Feather name="arrow-left" size={24} color="#007BFF" />
            </TouchableOpacity>
          ),
        }}
      />
      
    </Stack>
  );
}
