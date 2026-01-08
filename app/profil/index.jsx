import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../assets/api/api';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router';

export default function Profil() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/me");
      if (response.data.status === 1) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement du profil:", error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return '??';
    const names = name.split(' ');
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007BFF" />
        <Text className="mt-4 text-gray-600">Chargement du profil...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Ionicons name="warning" size={55} color="red" />
        <Text className="text-lg text-gray-600 font-bold px-15 mt-15">Erreur lors du chargement du profil</Text>
        <Text className="text-lg text-gray-600 px-15">Veuillez vous connectez si vous ne l’êtes pas.</Text>
        <TouchableOpacity onPress={()=>router.push('/connexion')}>
          <View className="flex-row items-center p-5 rounded bg-blue-100 gap-2 mt-5">
            <AntDesign name="login" size={24} color="blue" />
            <Text className="text-blue-600 font-bold text-xl">Se connecter</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6">
        {/* Header avec avatar */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">
              {getInitials(user.name)}
            </Text>
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-1">{user.name}</Text>
          <Text className="text-gray-500 text-base">{user.email}</Text>
        </View>

        {/* Informations */}
        <View className="space-y-4">
          <View className="bg-gray-50 rounded-2xl p-5">
            <Text className="text-gray-500 text-sm font-medium mb-3">INFORMATIONS PERSONNELLES</Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-blue-100 rounded-lg items-center justify-center mr-3">
                    <Text className="text-blue-600 font-semibold">👤</Text>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-xs">Nom complet</Text>
                    <Text className="text-gray-900 font-medium">{user.name}</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-green-100 rounded-lg items-center justify-center mr-3">
                    <Text className="text-green-600 font-semibold">📧</Text>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-xs">Email</Text>
                    <Text className="text-gray-900 font-medium">{user.email}</Text>
                  </View>
                </View>
              </View>

              <View className="flex-row items-center justify-between py-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-purple-100 rounded-lg items-center justify-center mr-3">
                    <Text className="text-purple-600 font-semibold">🌐</Text>
                  </View>
                  <View>
                    <Text className="text-gray-500 text-xs">Langue préférée</Text>
                    <Text className="text-gray-900 font-medium">{user.langue_preferee}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Statut du compte */}
          <View className="bg-blue-50 rounded-2xl p-5 mt-5">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-blue-800 font-semibold mb-1">Statut du compte</Text>
                <Text className="text-blue-600 text-sm">Compte vérifié et actif</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}