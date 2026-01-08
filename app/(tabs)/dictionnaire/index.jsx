import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList, Alert, RefreshControl, ActivityIndicator } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState, useEffect } from "react";
import { Searchbar } from "react-native-paper";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import api from "../../../assets/api/api";

export default function Dictionnaire() {
  const [search, setSearch] = useState("");
  const [langueModal, setLangueModal] = useState(false);
  const [langueTraduiteModal, setLangueTraduiteModal] = useState(false);
  const [resultModal, setResultModal] = useState(false);
  const [selectedLangue, setSelectedLangue] = useState("Français");
  const [selectedLangueTraduite, setSelectedLangueTraduite] = useState("Hébreu");
  const [mostSearched, setMostSearched] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const langues = ["Français", "Anglais", "Espagnol", "Allemand"];
  const languesTraduites = ["Français", "Anglais", "Espagnol", "Allemand", "Hébreu", "Grec"];

  useEffect(() => {
    fetchMostSearched();
  }, []);

  const fetchMostSearched = async () => {
    try {
      setSearchLoading(true);
      const response = await api.get("/MostSearch");
      if (response.data.status === 1) {
        setMostSearched(response.data.data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des mots populaires:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMostSearched();
    setRefreshing(false);
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    
    setLoading(true);
    try {
      const response = await api.post("/traduireMot", {
        mot_tape: search,
        langue_traduit: selectedLangueTraduite
      });
      
      if (response.data.status === 1) {
        setSearchResult(response.data.data);
        setResultModal(true);
        fetchMostSearched();
      }
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      Alert.alert("Erreur", "Impossible de se connecter au serveur. Vérifiez votre connexion internet.");
    } finally {
      setLoading(false);
      setSearch("");
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="p-4 border-b border-gray-200 active:bg-gray-50"
      onPress={() => {
        if (langueModal) {
          setSelectedLangue(item);
          setLangueModal(false);
        } else {
          setSelectedLangueTraduite(item);
          setLangueTraduiteModal(false);
        }
      }}
    >
      <Text className="text-gray-800 text-base">{item}</Text>
    </TouchableOpacity>
  );

  const getReferencesArray = (references) => {
    if (!references) return [];
    if (typeof references === 'string') {
      return references.split(',').map(ref => ref.trim()).filter(ref => ref);
    }
    if (Array.isArray(references)) {
      return references;
    }
    return [];
  };

  const renderWordCard = (word) => (
    <View key={word.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-4 mx-4">
      {/* Mot Recherché */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Feather name="search" size={16} color="#6b7280" />
            <Text className="text-gray-600 font-medium text-sm">RECHERCHÉ</Text>
          </View>
          <View className="bg-blue-50 px-3 py-1 rounded-full">
            <Text className="text-blue-600 font-medium text-xs">{word.langue_mot}</Text>
          </View>
        </View>
        <Text className="text-2xl font-bold text-gray-900">{word.mot_tape}</Text>
      </View>

      {/* Divider */}
      <View className="relative my-5">
        <View className="border-t border-gray-200" />
        <View className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3">
          <Ionicons name="arrow-forward" size={20} color="#9ca3af" />
        </View>
      </View>

      {/* Mot Traduit */}
      <View className="mb-5">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center gap-2">
            <Feather name="globe" size={16} color="#6b7280" />
            <Text className="text-gray-600 font-medium text-sm">TRADUIT</Text>
          </View>
          <View className="bg-green-50 px-3 py-1 rounded-full">
            <Text className="text-green-600 font-medium text-xs">{word.langue_traduit}</Text>
          </View>
        </View>
        <View className="flex-row items-baseline gap-2">
          <Text className="text-2xl font-bold text-gray-900">{word.mot}</Text>
          {word.transliteration && (
            <Text className="text-gray-500 text-sm italic">({word.transliteration})</Text>
          )}
        </View>
      </View>

      {/* Signification */}
      {word.signification && (
        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="information-circle-outline" size={16} color="#6b7280" />
            <Text className="text-gray-600 font-medium text-sm">SIGNIFICATION</Text>
          </View>
          <Text className="text-blue-700 font-medium text-base bg-blue-50 p-3 rounded-lg">
            {word.signification}
          </Text>
        </View>
      )}

      {/* Définition */}
      {word.definition && (
        <View className="mb-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Ionicons name="book-outline" size={16} color="#6b7280" />
            <Text className="text-gray-600 font-medium text-sm">DÉFINITION</Text>
          </View>
          <Text className="text-gray-700 text-base leading-relaxed p-3 bg-gray-50 rounded-lg">
            {word.definition}
          </Text>
        </View>
      )}

      {/* Références bibliques */}
      {word.references && getReferencesArray(word.references).length > 0 && (
        <View className="mt-4">
          <View className="flex-row items-center gap-2 mb-3">
            <Ionicons name="bookmark-outline" size={16} color="#6b7280" />
            <Text className="text-gray-600 font-medium text-sm">RÉFÉRENCES</Text>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {getReferencesArray(word.references).map((ref, index) => (
              <View key={index} className="bg-purple-50 px-3 py-2 rounded-lg">
                <Text className="text-purple-700 text-sm font-medium">{ref}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Footer avec infos additionnelles */}
      <View className="mt-6 pt-4 border-t border-gray-100">
        <Text className="text-gray-500 text-xs text-center">
          Recherché par des membres de la communauté
        </Text>
      </View>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Entête */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingVertical: 14,
          paddingHorizontal: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 6,
          zIndex: 10,
        }}
      >
        <View className="flex-row gap-4 justify-start items-center mb-5">
          <Feather name="book" size={25} color="#007BFF" />
          <Text className="font-bold text-xl text-gray-900">Dictionnaire Biblique</Text>
        </View>

        <View className="relative">
          <Searchbar
            placeholder="Rechercher un mot grec, hébreu..."
            placeholderTextColor="#7e7d7dff"
            onChangeText={setSearch}
            value={search}
            onSubmitEditing={handleSearch}
            inputStyle={{ fontSize: 16 }}
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
              marginBottom: 15,
            }}
            iconColor="#7e7d7dff"
          />
          
          {/* Indicateur de chargement */}
          {loading && (
            <View className="absolute right-12 top-3">
              <ActivityIndicator size="small" color="#007BFF" />
            </View>
          )}
        </View>

        {/* Sélecteur de langue de traduction seul - Prend tout l'espace */}
        <TouchableOpacity
          activeOpacity={0.7}
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderWidth: 1,
            borderColor: "#ccc",
            paddingVertical: 12,
            paddingHorizontal: 15,
            borderRadius: 10,
            backgroundColor: "#fff",
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.05,
            shadowRadius: 3,
            elevation: 2,
          }}
          onPress={() => setLangueTraduiteModal(true)}
        >
          <View className="flex-row items-center gap-3">
            <Feather name="globe" size={18} color="#666" />
            <Text className="text-gray-800 text-base">Traduire en: {selectedLangueTraduite}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-down" size={22} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Modal pour langue de traduction */}
      <Modal
        visible={langueTraduiteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLangueTraduiteModal(false)}
      >
        <TouchableOpacity 
          className="flex-1 justify-center items-center bg-black/50"
          activeOpacity={1}
          onPress={() => setLangueTraduiteModal(false)}
        >
          <TouchableOpacity activeOpacity={1}>
            <View className="bg-white rounded-2xl w-80 max-h-96">
              <View className="p-4 border-b border-gray-200">
                <Text className="text-lg font-semibold text-gray-800">Langue de traduction</Text>
              </View>
              <FlatList
                data={languesTraduites}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                showsVerticalScrollIndicator={false}
              />
              <TouchableOpacity
                className="p-4 border-t border-gray-200"
                onPress={() => setLangueTraduiteModal(false)}
              >
                <Text className="text-blue-600 text-center font-medium">Fermer</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      {/* Modal pour résultat */}
      <Modal
        visible={resultModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setResultModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl w-[90%] max-h-[85%]">
            <View className="p-4 border-b border-gray-200 flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Résultat de recherche</Text>
              <TouchableOpacity 
                onPress={() => setResultModal(false)}
                className="p-1"
              >
                <MaterialIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
            <ScrollView 
              className="p-4"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {searchResult && renderWordCard(searchResult)}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Liste des mots populaires avec indicateur de chargement */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 20 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#007BFF"]}
            tintColor="#007BFF"
          />
        }
      >
        {searchLoading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#007BFF" />
            <Text className="text-gray-500 mt-3">Chargement des mots...</Text>
          </View>
        ) : mostSearched.length > 0 ? (
          <>
            {/* Section titre mots populaires */}
            <View className="px-4 mb-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="trending-up" size={20} color="#007BFF" />
                  <Text className="text-lg font-bold text-gray-900">Mots les plus recherchés</Text>
                </View>
                <Text className="text-gray-500 text-sm">{mostSearched.length} résultats</Text>
              </View>
            </View>

            {/* Cartes des mots */}
            {mostSearched.map(word => renderWordCard(word))}
          </>
        ) : !refreshing && (
          <View className="items-center justify-center py-20 px-8">
            <Feather name="book-open" size={60} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4 text-center">
              Aucun mot populaire pour le moment
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Effectuez une recherche pour ajouter des mots à cette liste
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}