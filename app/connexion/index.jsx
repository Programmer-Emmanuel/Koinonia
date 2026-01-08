import { useState } from "react"
import { Image, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from "react-native-paper";
import { router } from "expo-router";
import images from "../../constants/images";
import api from "../../assets/api/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Connexion(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (isLoading) return;
    
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post("/login", {
        email,
        password
      });
      
      if (response.data.status === 1) {
        await AsyncStorage.setItem('token', response.data.token);
        Alert.alert("Succès", "Connexion réussie !");
        router.replace('/(tabs)');
      } else {
        Alert.alert("Erreur", "Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("Erreur connexion:", error);
      Alert.alert("Erreur", "Erreur lors de la connexion");
    } finally {
      setIsLoading(false);
    }
  };

  return(
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <SafeAreaView className="flex-1 justify-center px-6">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
        >

          <Image
            source={images.logo}
            style={{ width: 100, height: 100, alignSelf: "center", marginBottom: 20, borderRadius: 100 }}
            resizeMode="contain"
          />

          <View className="justify-center items-center mb-10">
            <Text className="font-bold text-3xl text-gray-900">Connexion Koinania</Text>
            <Text className="text-gray-600 text-center mt-2 text-base">
              Content de vous revoir !
            </Text>
          </View>

          <View className="flex-col space-y-4">
            <TextInput 
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              label="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              theme={{
                colors: {
                  primary: "#007BFF",
                  outline: "#999999",
                  text: "#000000",
                  placeholder: "#AAAAAA",
                },
              }}
              style={{ backgroundColor: 'white' }}
            />

            <TextInput
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              label="Mot de passe"
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              right={
                <TextInput.Icon
                  icon={passwordVisible ? "eye-off" : "eye"}
                  onPress={() => setPasswordVisible(!passwordVisible)}
                />
              }
              theme={{
                colors: {
                  primary: "#007BFF",
                  outline: "#999999",
                  text: "#000000",
                  placeholder: "#AAAAAA",
                },
              }}
              style={{ backgroundColor: 'white' }}
            />

            <TouchableOpacity className="self-end mb-4">
              <Text className="text-blue-500 text-sm font-semibold">
                Mot de passe oublié ?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              className={`rounded-full p-4 mt-2 mb-4 shadow-md ${isLoading ? 'bg-blue-300' : 'bg-blue-500'}`}
              onPress={handleSignIn}
              disabled={isLoading}
            >
              <View>
                <Text className="text-white text-center text-lg font-semibold">
                  {isLoading ? "Connexion..." : "Se connecter"}
                </Text>
              </View>
            </TouchableOpacity>

            <View className="py-4 mb-15">
              <Text className="text-gray-600 text-center text-base">
                Pas encore de compte ?{" "}
                <Text 
                  onPress={() => router.push('inscription')} 
                  className="text-blue-500 font-semibold underline"
                >
                  S'inscrire
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}