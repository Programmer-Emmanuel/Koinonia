import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';

export default function LayoutOtp() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
}
