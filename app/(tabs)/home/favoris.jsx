import React, { useState, useEffect } from 'react';
import { Text, View, FlatList, ActivityIndicator, TouchableOpacity, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Versions de la Bible disponibles
const bibleVersions = {
  Français: "segond_1910.json",
  Anglais: "kjv_strongs.json",
};

// Fonction pour nettoyer les codes Strong
const cleanStrongsCodes = (text) => {
  return text.replace(/\{?\(?[A-Za-z]\d+\)?\}?/g, "");
};

// Fonction pour charger la version biblique
const loadBibleVersion = (version) => {
  try {
    const fileName = bibleVersions[version];
    if (fileName === "segond_1910.json") {
      return require('../../../constants/segond_1910.json');
    } else if (fileName === "kjv_strongs.json") {
      const kjvData = require('../../../constants/kjv_strongs.json');
      return {
        ...kjvData,
        verses: kjvData.verses.map((verse) => ({
          ...verse,
          text: cleanStrongsCodes(verse.text),
        })),
      };
    }
    return require('../../../constants/segond_1910.json');
  } catch (error) {
    console.error('Erreur de chargement des données bibliques:', error);
    return {
      verses: [
        {
          book_name: "Genèse",
          book: 1,
          chapter: 1,
          verse: 1,
          text: "Au commencement, Dieu créa les cieux et la terre."
        }
      ]
    };
  }
};

// Correction des noms de livres
const correctBookNames = (data) => {
  return {
    ...data,
    verses: data.verses.map(verse => {
      let correctedName = verse.book_name;
      
      if (verse.book_name === "Psaume") {
        correctedName = "Psaumes";
      } else if (verse.book_name === "Cantique Des Cantiqu") {
        correctedName = "Cantique Des Cantiques";
      }
      
      return {
        ...verse,
        book_name: correctedName
      };
    })
  };
};

export default function Favoris() {
  const [favoriteVerses, setFavoriteVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [verseToDelete, setVerseToDelete] = useState(null);
  const [currentVersion, setCurrentVersion] = useState("Français");
  const router = useRouter();

  // Charger les versets favoris
  const loadFavoriteVerses = async () => {
    try {
      // Charger la version sélectionnée
      const savedVersion = await AsyncStorage.getItem('bibleVersion');
      if (savedVersion) {
        setCurrentVersion(savedVersion);
      }
      
      // Charger les données bibliques de la version actuelle
      const versionData = loadBibleVersion(savedVersion || "Français");
      const correctedData = correctBookNames(versionData);
      
      // Charger les surlignages depuis AsyncStorage
      const savedHighlights = await AsyncStorage.getItem('verseHighlights');
      if (savedHighlights) {
        const highlights = JSON.parse(savedHighlights);
        
        // Convertir l'objet highlights en tableau de versets favoris avec texte
        const favoritesWithText = Object.entries(highlights).map(([verseKey, color]) => {
          const [book, chapter, verse] = verseKey.split('-').map(Number);
          
          // Trouver le texte du verset dans les données bibliques de la version actuelle
          const verseData = correctedData.verses.find(v => 
            v.book === book && v.chapter === chapter && v.verse === verse
          );
          
          return {
            book,
            chapter,
            verse,
            color,
            key: verseKey,
            text: verseData?.text || `Verset ${book}-${chapter}-${verse}`,
            book_name: verseData?.book_name || `Livre ${book}`
          };
        });
        
        setFavoriteVerses(favoritesWithText);
      } else {
        setFavoriteVerses([]);
      }
      
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadFavoriteVerses();
  }, []);

  // Rafraîchir la liste
  const onRefresh = async () => {
    setRefreshing(true);
    await loadFavoriteVerses();
  };

  // Obtenir le style de surlignage
  const getHighlightStyle = (color) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-200 border-blue-300';
      case 'yellow':
        return 'bg-yellow-200 border-yellow-300';
      case 'green':
        return 'bg-green-200 border-green-300';
      case 'orange':
        return 'bg-orange-200 border-orange-300';
      default:
        return 'bg-gray-100 border-gray-200';
    }
  };

  // Ouvrir la modal de confirmation de suppression
  const confirmDelete = (verse) => {
    setVerseToDelete(verse);
    setDeleteModalVisible(true);
  };

  // Supprimer un verset des favoris
  const deleteFavorite = async () => {
    try {
      // Charger les surlignages actuels
      const savedHighlights = await AsyncStorage.getItem('verseHighlights');
      if (savedHighlights) {
        const highlights = JSON.parse(savedHighlights);
        
        // Supprimer le verset spécifique
        delete highlights[verseToDelete.key];
        
        // Sauvegarder les modifications
        await AsyncStorage.setItem('verseHighlights', JSON.stringify(highlights));
        
        // Mettre à jour l'état local
        setFavoriteVerses(prev => prev.filter(v => v.key !== verseToDelete.key));
        
        // Fermer la modal
        setDeleteModalVisible(false);
        setVerseToDelete(null);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
      Alert.alert('Erreur', 'Impossible de supprimer le favori');
    }
  };

  // Annuler la suppression
  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setVerseToDelete(null);
  };

  // Rendu d'un verset favori
  const renderFavoriteVerse = ({ item }) => (
    <TouchableOpacity 
      className={`p-4 mb-3 rounded-lg border ${getHighlightStyle(item.color)}`}
      onPress={() => confirmDelete(item)}
      activeOpacity={0.7}
    >
      <Text className="text-base font-semibold text-gray-700 mb-2">
        {item.book_name} {item.chapter}:{item.verse}
      </Text>
      <Text className="text-sm text-gray-600 leading-5">
        {item.text.replace('¶ ', '')}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#007BFF" />
        <Text className="text-lg text-gray-600 mt-4">Chargement des favoris...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* En-tête */}
      <View className="p-4 border-b border-gray-200 bg-gray-50">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="p-2"
          >
            <Ionicons name="arrow-back" size={24} color="#007BFF" />
          </TouchableOpacity>
          
          <View className="flex-1 items-center">
            <Text className="text-xl font-bold text-gray-800">Versets Favoris</Text>
            <Text className="text-sm text-gray-500">
              {favoriteVerses.length} verset(s) - {currentVersion}
            </Text>
          </View>
          
          <TouchableOpacity 
            onPress={onRefresh}
            className="p-2"
            disabled={refreshing}
          >
            <Ionicons 
              name="refresh" 
              size={24} 
              color={refreshing ? "#ccc" : "#007BFF"} 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Liste des favoris */}
      {favoriteVerses.length === 0 ? (
        <View className="flex-1 justify-center items-center p-8">
          <Ionicons name="bookmark-outline" size={64} color="#ccc" />
          <Text className="text-lg text-gray-500 text-center mt-4 mb-2">
            Aucun verset favori
          </Text>
          <Text className="text-sm text-gray-400 text-center">
            Surlignez des versets dans votre lecture{'\n'}pour les voir apparaître ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteVerses}
          renderItem={renderFavoriteVerse}
          keyExtractor={item => item.key}
          contentContainerClassName="p-4"
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}

      {/* Modal de confirmation de suppression */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={deleteModalVisible}
        onRequestClose={cancelDelete}
      >
        <TouchableWithoutFeedback onPress={cancelDelete}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-lg p-6 w-4/5">
                {/* Bouton de fermeture (croix) */}
                <TouchableOpacity 
                  onPress={cancelDelete}
                  className="absolute top-3 right-3 z-10 p-1"
                >
                  <Ionicons name="close" size={20} color="#666" />
                </TouchableOpacity>
                
                {verseToDelete && (
                  <>
                    <Text className="text-base font-semibold text-gray-700 mb-2 mt-2">
                      {verseToDelete.book_name} {verseToDelete.chapter}:{verseToDelete.verse}
                    </Text>
                    <Text className="text-sm text-gray-600 mb-4">
                      {verseToDelete.text.replace('¶ ', '')}
                    </Text>
                  </>
                )}
                
                <Text className="text-gray-600 mb-6">
                  Supprimer ce verset de vos favoris ?
                </Text>
                
                <View className="flex-row justify-end space-x-4">
                  <TouchableOpacity 
                    onPress={cancelDelete}
                    className="px-4 py-2 rounded"
                  >
                    <Text className="text-gray-600">Annuler</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    onPress={deleteFavorite}
                    className="px-4 py-2 bg-red-600 rounded"
                  >
                    <Text className="text-white">Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}