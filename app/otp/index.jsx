import { useState, useRef, useEffect } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  TextInput as RNTextInput
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from "../../assets/api/api";

export default function Otp() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [email, setEmail] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    loadEmail();
    startTimer();
    // Focus sur la première case au chargement
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
  }, []);

  const loadEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem('email');
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch (error) {
      console.error("Erreur lors du chargement de l'email:", error);
    }
  };

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleChangeText = (value, index) => {
    const cleanedValue = value.replace(/[^0-9]/g, '');
    
    // Si l'utilisateur colle un OTP complet (6 chiffres)
    if (cleanedValue.length === 6) {
      const otpArray = cleanedValue.split('');
      setOtp(otpArray);
      
      // Focus sur la dernière case
      setTimeout(() => {
        if (inputRefs.current[5]) {
          inputRefs.current[5].focus();
        }
      }, 10);
      return;
    }
    
    // Si l'utilisateur entre un chiffre
    if (cleanedValue.length === 1) {
      const newOtp = [...otp];
      newOtp[index] = cleanedValue;
      setOtp(newOtp);
      
      // Passer à la case suivante si ce n'est pas la dernière
      if (index < 5) {
        setTimeout(() => {
          if (inputRefs.current[index + 1]) {
            inputRefs.current[index + 1].focus();
          }
        }, 10);
      } else {
        // Si c'est la dernière case, masquer le clavier
        if (inputRefs.current[index]) {
          inputRefs.current[index].blur();
        }
      }
    } 
    // Si l'utilisateur supprime (case vide)
    else if (cleanedValue.length === 0) {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      
      // Aller à la case précédente si ce n'est pas la première
      if (index > 0) {
        setTimeout(() => {
          if (inputRefs.current[index - 1]) {
            inputRefs.current[index - 1].focus();
          }
        }, 10);
      }
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    // Gestion du backspace quand la case est vide
    if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      
      setTimeout(() => {
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      }, 10);
    }
  };

  const handlePaste = async (index) => {
    try {
      // Récupérer le contenu du presse-papier
      const clipboardContent = await navigator.clipboard?.readText();
      
      if (clipboardContent && /^\d{6}$/.test(clipboardContent)) {
        const otpArray = clipboardContent.split('');
        setOtp(otpArray);
        
        // Focus sur la dernière case
        setTimeout(() => {
          if (inputRefs.current[5]) {
            inputRefs.current[5].focus();
          }
        }, 10);
      }
    } catch (error) {
      console.log("Impossible de lire le presse-papier:", error);
    }
  };

  const handleVerifyOtp = async () => {
    if (isLoading) return;
    
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      Alert.alert("Erreur", "Veuillez saisir les 6 chiffres du code OTP");
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await api.post("/verifyOtp", {
        email: email,
        otp: enteredOtp
      });
      
      if (response.data.status === 1) {
        await AsyncStorage.setItem('token', response.data.token);
        await AsyncStorage.removeItem('email');
        Alert.alert("Succès", "Inscription réussie !");
        router.replace('/index');
      } else {
        Alert.alert("Erreur", "Code OTP incorrect. Veuillez réessayer.");
        // Réinitialiser l'OTP
        setOtp(['', '', '', '', '', '']);
        // Focus sur la première case
        setTimeout(() => {
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        }, 100);
      }
    } catch (error) {
      console.error("Erreur vérification OTP:", error);
      Alert.alert("Erreur", "Erreur lors de la vérification du code OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timeLeft > 0) return;
    
    try {
      const response = await api.post("/renvoyerOtp", {
        email: email
      });
      
      if (response.data.status === 1) {
        setTimeLeft(60);
        startTimer();
        Alert.alert("Code renvoyé", "Un nouveau code OTP a été envoyé à votre email.");
        
        // Réinitialiser l'OTP et focus sur la première case
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => {
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        }, 100);
      } else {
        Alert.alert("Erreur", "Impossible de renvoyer le code OTP");
      }
    } catch (error) {
      console.error("Erreur renvoi OTP:", error);
      Alert.alert("Erreur", "Erreur lors du renvoi du code OTP");
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <SafeAreaView className="flex-1">
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6 pb-6">
            <Text className="text-3xl font-bold text-gray-900 mb-4 text-center">
              Vérification OTP
            </Text>
            
            <Text className="text-gray-600 text-base mb-2 text-center">
              Nous avons envoyé un code à 6 chiffres à
            </Text>
            <Text className="text-blue-500 font-semibold text-lg mb-6 text-center">
              {email}
            </Text>
          </View>

          <View className="px-6 mb-8">
            <Text className="text-gray-700 text-sm font-medium mb-4 text-center">
              Entrez le code de vérification
            </Text>
            
            <View className="flex-row justify-between gap-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <View key={index} className="flex-1">
                  <RNTextInput
                    ref={ref => inputRefs.current[index] = ref}
                    value={otp[index]}
                    onChangeText={(value) => handleChangeText(value, index)}
                    onKeyPress={(e) => handleKeyPress(e, index)}
                    onFocus={() => {
                      // Sélectionner le texte dans la case
                      if (otp[index]) {
                        inputRefs.current[index]?.setNativeProps({
                          selection: { start: 0, end: otp[index].length }
                        });
                      }
                    }}
                    onTouchEnd={() => {
                      // Si la case est vide, effacer les cases suivantes
                      if (otp[index] === '') {
                        const newOtp = [...otp];
                        for (let i = index + 1; i < 6; i++) {
                          newOtp[i] = '';
                        }
                        setOtp(newOtp);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={1}
                    textAlign="center"
                    className="border-2 border-gray-300 rounded-xl text-2xl font-bold text-center h-14"
                    style={{
                      borderColor: otp[index] ? '#007BFF' : '#D1D5DB',
                      backgroundColor: '#FFFFFF',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}
                    selectionColor="#007BFF"
                    cursorColor="#007BFF"
                    selectTextOnFocus
                    contextMenuHidden={true}
                    onPaste={() => handlePaste(index)}
                  />
                </View>
              ))}
            </View>
            
            {/* Indicateur visuel des cases */}
            <View className="flex-row justify-between gap-2 mt-2">
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <View 
                  key={index} 
                  className={`h-1 flex-1 rounded-full ${
                    otp[index] ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </View>
          </View>

          <View className="px-6 mb-6">
            <TouchableOpacity 
              className={`rounded-xl p-4 ${
                otp.join('').length === 6 && !isLoading 
                  ? 'bg-blue-500 active:bg-blue-600' 
                  : 'bg-blue-300'
              }`}
              onPress={handleVerifyOtp}
              disabled={otp.join('').length !== 6 || isLoading}
              activeOpacity={0.8}
            >
              <Text className="text-white text-center text-lg font-semibold">
                {isLoading ? "Vérification..." : "Vérifier le code"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="px-6">
            <Text className="text-gray-600 text-center text-base mb-4">
              Vous n'avez pas reçu le code ?
            </Text>
            
            <TouchableOpacity 
              onPress={handleResendOtp}
              disabled={timeLeft > 0}
              className={`rounded-xl p-3 ${
                timeLeft > 0 ? 'bg-gray-100' : 'bg-blue-50 active:bg-blue-100'
              }`}
              activeOpacity={0.8}
            >
              <Text className={`text-center text-base font-semibold ${
                timeLeft > 0 ? 'text-gray-400' : 'text-blue-500'
              }`}>
                {timeLeft > 0 ? `Renvoyer (${timeLeft}s)` : "Renvoyer le code"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="px-6 mt-8">
            <View className="bg-blue-50 rounded-2xl p-4">
              <Text className="text-blue-800 text-sm text-center">
                💡 Le code OTP est valable pendant 10 minutes. 
                Vérifiez vos spams si vous ne le trouvez pas dans votre boîte de réception.
              </Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}