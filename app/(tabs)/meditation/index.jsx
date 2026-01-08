import React, { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StatusBar, Platform, KeyboardAvoidingView } from 'react-native';
import { Heart, Calendar, Edit3, BookOpen } from 'lucide-react-native';
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from 'react-native-safe-area-context';
import api from "../../../assets/api/api";

export default function MeditationQuotidienne() {
  const [notes, setNotes] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentDate] = useState("lundi 1 décembre 2025");
  const [verseData] = useState({
    text: '"Je puis tout par celui qui me fortifie."',
    reference: "Philippiens 4:13",
    theme: "Force et Persévérance"
  });
  
  const [reflections] = useState([
    "Quels défis actuels nécessitent la force de Christ ?",
    "Comment puis-je m'appuyer davantage sur Dieu ?",
    "Quels témoignages de Sa force puis-je partager ?"
  ]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <View className="px-6 pb-4 border-b border-gray-100">
          <View className="flex-row items-center mb-3">
            <Heart size={26} color="#4444efff" />
            <Text className="ml-2 text-2xl font-bold text-gray-900">Méditation Quotidienne</Text>
          </View>
          <View className="flex-row items-center">
            <Calendar size={18} color="#6B7280" />
            <Text className="ml-2 text-gray-600 text-lg">{currentDate}</Text>
          </View>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {/* Fond gradient pour toute la zone de contenu */}
          <LinearGradient
            colors={["#ced2ffff", "#ffffff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="flex-1"
          >
            <View className="px-6 py-6">
              {/* Verse Section */}
              <View className="mb-8 bg-white p-7 rounded-2xl">
                <View className="flex-row gap-8 justify-center items-center mb-8">
                  <Text className="text-xl font-bold text-gray-900">Verset du jour</Text>
                  <View className="px-3 py-1 bg-blue-50 rounded-full">
                    <Text className="text-blue-600 text-sm font-semibold">{verseData.theme}</Text>
                  </View>
                </View>
                
                <LinearGradient
                  colors={["#ced2ffff", "#ffffffff"]} // Un peu plus clair pour contraster
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="rounded p-7 border border-red-100"
                >
                  <Text className="text-xl font-medium text-gray-900 italic text-center leading-relaxed mb-3 mt-5">
                    {verseData.text}
                  </Text>
                  <Text className="text-blue-600 font-semibold text-center mb-5">
                    {verseData.reference}
                  </Text>
                </LinearGradient>
              </View>

              {/* Divine Strength Section avec fond blanc */}
              <View className="mb-8 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-4">
                  <BookOpen size={25} color="#2516f9ff" />
                  <Text className="ml-2 text-2xl font-semibold text-gray-900">La force divine en nous</Text>
                </View>
                
                <View className="space-y-4">
                  <Text className="text-gray-700 leading-relaxed text-lg">
                    Ce verset nous rappelle que notre force ne vient pas de nous-mêmes, mais de Christ qui vit en nous.
                  </Text>
                  <Text className="text-gray-700 leading-relaxed text-lg">
                    Quand nous traversons des moments difficiles, nous pouvons nous appuyer sur cette promesse. La force divine nous permet de surmonter les obstacles qui semblent insurmontables.
                  </Text>
                  <Text className="text-gray-700 leading-relaxed font-medium text-lg">
                    Réfléchissons aujourd'hui : Dans quels domaines de ma vie ai-je besoin de cette force divine ?
                  </Text>
                </View>

                {/* Reflection Questions */}
                <View className="mt-8 pt-6 border-t border-gray-100">
                  <Text className="text-2xl font-semibold text-gray-900 mb-4">Questions de réflexion</Text>
                  <View className="space-y-4">
                    {reflections.map((question, index) => (
                      <View key={index} className="flex-row items-start">
                        <View className="w-8 h-8 bg-blue-50 rounded-full items-center justify-center mr-3 mt-0.5">
                          <Text className="text-blue-600 font-medium text-lg">{index + 1}</Text>
                        </View>
                        <Text className="text-gray-700 flex-1 leading-relaxed text-lg">{question}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Personal Notes avec fond blanc */}
              <View className="mb-24 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-semibold text-gray-900">Notes personnelles</Text>
                  <TouchableOpacity 
                    onPress={() => setIsEditing(!isEditing)}
                    className="flex-row items-center px-4 py-2 bg-blue-50 rounded-lg"
                  >
                    <Edit3 size={20} color="#4444efff" />
                    <Text className="ml-2 text-blue-600 font-medium text-lg">Modifier</Text>
                  </TouchableOpacity>
                </View>
                
                <View className="bg-gray-50 rounded-xl border border-gray-200 min-h-[140px]">
                  {isEditing ? (
                    <TextInput
                      value={notes}
                      onChangeText={setNotes}
                      placeholder="Écrivez vos réflexions personnelles ici..."
                      placeholderTextColor="#9CA3AF"
                      multiline
                      className="p-4 text-gray-700 text-lg"
                      autoFocus
                      style={{ textAlignVertical: 'top' }}
                    />
                  ) : (
                    <View className="p-4">
                      <Text className="text-gray-500 italic text-lg leading-relaxed">
                        {notes || "Cliquez sur 'Modifier' pour ajouter vos réflexions personnelles..."}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          </LinearGradient>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}