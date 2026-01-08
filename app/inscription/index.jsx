import { useState } from "react"
import { Image, Text, TouchableOpacity, View, ScrollView, KeyboardAvoidingView, Platform, Modal, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from "react-native-paper";
import { router } from "expo-router";
import images from "../../constants/images";
import api from "../../assets/api/api";
import AsyncStorage from "@react-native-async-storage/async-storage";


// Liste des langues disponibles
const LANGUAGES = [
  { code: 'fr', name: 'Français' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' },
  { code: 'de', name: 'Deutsch' },
  { code: 'it', name: 'Italiano' },
  { code: 'ar', name: 'العربية' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'ln', name: 'Lingala' },
  { code: 'kg', name: 'Kikongo' },
];

export default function Inscription(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [langue_preferee, setLangue_preferee] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }
    
    if (!langue_preferee) {
      alert("Veuillez sélectionner votre langue préférée");
      return;
    }
    
    setIsLoading(true);
    try {
      // Votre logique d'inscription ici
      const response = await api.post("/register", {
        name : name,
        email: email,
        password : password,
        langue_preferee : langue_preferee
      });
      if (response.data.status === 1) {
        AsyncStorage.setItem('email', response.data.email);
        router.replace('/otp');
      }
      else{
        Alert.alert('Erreur')
      }
    } catch (error) {
      alert("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
    }
  };

  const selectLanguage = (languageName) => {
    setLangue_preferee(languageName);
    setModalVisible(false);
  };

  const getSelectedLanguageName = () => {
    const selectedLang = LANGUAGES.find(lang => lang.name === langue_preferee);
    return selectedLang ? selectedLang.name : "Choisissez votre langue préférée";
  };

  return(
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <SafeAreaView className="flex-1 justify-center px-6">
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        >

          {/* Logo */}
          <Image
            source={images.logo}
            style={{ width: 100, height: 100, alignSelf: "center", marginBottom: 20, borderRadius: 100 }}
            resizeMode="contain"
          />

          {/* Titre */}
          <View className="justify-center items-center mb-10">
            <Text className="font-bold text-3xl text-gray-900">Inscription Koinania</Text>
            <Text className="text-gray-600 text-center mt-2 text-base">
              Rejoignez notre communauté spirituelle !
            </Text>
          </View>

          {/* Formulaire */}
          <View className="flex-col space-y-4">
            <TextInput 
              value={name}
              onChangeText={setName}
              mode="outlined"
              label="Nom complet"
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

            {/* Sélecteur de langue */}
            <TouchableOpacity 
              onPress={() => setModalVisible(true)}
              className="border border-gray-300 rounded-md bg-white overflow-hidden mt-2"
            >
              <View pointerEvents="none">
                <TextInput 
                  value={getSelectedLanguageName()}
                  mode="outlined"
                  label="Langue préférée"
                  editable={false}
                  right={
                    <TextInput.Icon
                      icon="chevron-down"
                      color="#666"
                    />
                  }
                  theme={{
                    colors: {
                      primary: "#007BFF",
                      outline: "transparent",
                      text: langue_preferee ? "#000000" : "#AAAAAA",
                      placeholder: "#AAAAAA",
                    },
                  }}
                  style={{ backgroundColor: 'white', marginTop: 5 }}
                />
              </View>
            </TouchableOpacity>

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

            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              label="Confirmation du mot de passe"
              secureTextEntry={!confirmPasswordVisible}
              autoCapitalize="none"
              right={
                <TextInput.Icon
                  icon={confirmPasswordVisible ? "eye-off" : "eye"}
                  onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
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

            {/* Bouton d'inscription */}
            <TouchableOpacity 
              className="rounded-full p-4 bg-blue-500 mt-6 mb-4 shadow-md"
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <View>
                <Text className="text-white text-center text-lg font-semibold">
                  {isLoading ? "Inscription en cours..." : "S'inscrire"}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Lien de connexion */}
            <View className="py-4">
              <Text className="text-gray-600 text-center text-base">
                Déjà un compte ?{" "}
                <Text 
                  onPress={() => router.push('connexion')} 
                  className="text-blue-500 font-semibold underline"
                >
                  Se connecter
                </Text>
              </Text>
            </View>
          </View>

          {/* Modal de sélection de langue */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-end bg-black/50">
              <View className="bg-white rounded-t-3xl max-h-3/4">
                {/* Header du modal */}
                <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                  <Text className="text-lg font-semibold text-gray-900">
                    Choisir une langue
                  </Text>
                  <TouchableOpacity 
                    onPress={() => setModalVisible(false)}
                    className="w-8 h-8 items-center justify-center"
                  >
                    <Text className="text-xl text-gray-500">×</Text>
                  </TouchableOpacity>
                </View>

                {/* Liste des langues */}
                <ScrollView className="max-h-96">
                  {LANGUAGES.map((language, index) => (
                    <TouchableOpacity
                      key={language.code}
                      className={`flex-row items-center px-4 py-3 ${
                        index !== LANGUAGES.length - 1 ? 'border-b border-gray-100' : ''
                      } ${langue_preferee === language.name ? 'bg-blue-50' : ''}`}
                      onPress={() => selectLanguage(language.name)}
                    >
                      <View className={`w-6 h-6 rounded-full border-2 mr-3 items-center justify-center ${
                        langue_preferee === language.name ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                      }`}>
                        {langue_preferee === language.name && (
                          <Text className="text-white text-xs">✓</Text>
                        )}
                      </View>
                      <Text className={`text-base ${
                        langue_preferee === language.name ? 'text-blue-600 font-semibold' : 'text-gray-800'
                      }`}>
                        {language.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Modal>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  )
}