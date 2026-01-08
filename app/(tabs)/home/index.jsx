import { Feather } from "@expo/vector-icons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const bibleVersions = {
  Français: "segond_1910.json",
  Anglais: "kjv_strongs.json",
};

// Fonction pour nettoyer les codes Strong
const cleanStrongsCodes = (text) => {
  return text.replace(/\{?\(?[A-Za-z]\d+\)?\}?/g, "");
};

let bibleData = { verses: [] };

const loadBibleVersion = (version) => {
  try {
    const fileName = bibleVersions[version];
    if (fileName === "segond_1910.json") {
      return require("../../../constants/segond_1910.json");
    } else if (fileName === "kjv_strongs.json") {
      const kjvData = require("../../../constants/kjv_strongs.json");
      return {
        ...kjvData,
        verses: kjvData.verses.map((verse) => ({
          ...verse,
          text: cleanStrongsCodes(verse.text),
        })),
      };
    }
    return require("../../../constants/segond_1910.json");
  } catch (error) {
    console.error("Erreur de chargement des données bibliques:", error);
    return {
      verses: [
        {
          book_name: "Genèse",
          book: 1,
          chapter: 1,
          verse: 1,
          text: "Au commencement, Dieu créa les cieux et la terre.",
        },
      ],
    };
  }
};

const correctBookNames = (data) => {
  return {
    ...data,
    verses: data.verses.map((verse) => {
      let correctedName = verse.book_name;

      if (verse.book_name === "Psaume") {
        correctedName = "Psaumes";
      } else if (verse.book_name === "Cantique Des Cantiqu") {
        correctedName = "Cantique Des Cantiques";
      }

      return {
        ...verse,
        book_name: correctedName,
      };
    }),
  };
};

const BibleService = {
  loadBibleData: async (version) => {
    try {
      const data = loadBibleVersion(version);
      return correctBookNames(data);
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
      throw error;
    }
  },

  getBooks: async (version) => {
    try {
      const data = await BibleService.loadBibleData(version);
      const bookMap = new Map();

      data.verses.forEach((verse) => {
        if (!bookMap.has(verse.book)) {
          bookMap.set(verse.book, {
            id: verse.book,
            name: verse.book_name,
          });
        }
      });

      const uniqueBooks = Array.from(bookMap.values());
      uniqueBooks.sort((a, b) => a.id - b.id);
      return uniqueBooks;
    } catch (error) {
      console.error("Erreur dans getBooks:", error);
      return [];
    }
  },

  getChapters: async (bookId, version) => {
    try {
      const data = await BibleService.loadBibleData(version);
      const chapterSet = new Set();

      data.verses.forEach((verse) => {
        if (verse.book === bookId) {
          chapterSet.add(verse.chapter);
        }
      });

      const uniqueChapters = Array.from(chapterSet);
      uniqueChapters.sort((a, b) => a - b);
      return uniqueChapters;
    } catch (error) {
      console.error("Erreur dans getChapters:", error);
      return [1];
    }
  },

  getVerses: async (bookId, chapterNumber, version) => {
    try {
      const data = await BibleService.loadBibleData(version);
      const verses = data.verses.filter(
        (verse) => verse.book === bookId && verse.chapter === chapterNumber
      );

      return verses.map((verse) => ({
        ...verse,
        text: cleanStrongsCodes(verse.text),
      }));
    } catch (error) {
      console.error("Erreur dans getVerses:", error);
      return [];
    }
  },
};

const navigateFavoris = () => {
  router.navigate("/home/favoris");
};

const { width } = Dimensions.get("window");

const BibleReader = () => {
  const [currentBook, setCurrentBook] = useState(1);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [verses, setVerses] = useState([]);
  const [books, setBooks] = useState([]);
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [currentBookName, setCurrentBookName] = useState("Genèse");
  const [chapters, setChapters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fontSize, setFontSize] = useState("normal");
  const [showSettingsDrawer, setShowSettingsDrawer] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [showHighlightOptions, setShowHighlightOptions] = useState(false);
  const [highlights, setHighlights] = useState({});
  const [currentVersion, setCurrentVersion] = useState("Français");

  // SIMPLIFICATION : On utilise un état simple pour le drawer
  const drawerAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedFontSize = await AsyncStorage.getItem("bibleFontSize");
        if (savedFontSize) {
          setFontSize(savedFontSize);
        }

        const savedVersion = await AsyncStorage.getItem("bibleVersion");
        if (savedVersion) {
          setCurrentVersion(savedVersion);
        }

        const lastRead = await AsyncStorage.getItem("lastRead");
        if (lastRead) {
          const { book, chapter } = JSON.parse(lastRead);
          setCurrentBook(book);
          setCurrentChapter(chapter);
        }

        const savedHighlights = await AsyncStorage.getItem("verseHighlights");
        if (savedHighlights) {
          setHighlights(JSON.parse(savedHighlights));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des paramètres:", error);
      }
    };

    loadSettings();
  }, []);

  // OUVERTURE IMMÉDIATE du drawer
  const openDrawer = () => {
    setShowSettingsDrawer(true);
    // Pas d'animation, affichage immédiat
  };

  // FERMETURE du drawer
  const closeDrawer = () => {
    setShowSettingsDrawer(false);
  };

  const saveLastRead = async (book, chapter) => {
    try {
      await AsyncStorage.setItem("lastRead", JSON.stringify({ book, chapter }));
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };

  const saveHighlights = async (newHighlights) => {
    try {
      await AsyncStorage.setItem(
        "verseHighlights",
        JSON.stringify(newHighlights)
      );
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des surlignages:", error);
    }
  };

  const saveVersion = async (version) => {
    try {
      await AsyncStorage.setItem("bibleVersion", version);
      setCurrentVersion(version);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde de la version:", error);
    }
  };

  const getFontSizeStyle = () => {
    switch (fontSize) {
      case "small":
        return "text-base";
      case "normal":
        return "text-xm";
      case "large":
        return "text-xl";
      default:
        return "text-lg";
    }
  };

  const applyHighlight = async (color) => {
    if (!selectedVerse) return;

    const verseKey = `${selectedVerse.book}-${selectedVerse.chapter}-${selectedVerse.verse}`;
    const newHighlights = { ...highlights, [verseKey]: color };

    setHighlights(newHighlights);
    await saveHighlights(newHighlights);
    setShowHighlightOptions(false);
    setSelectedVerse(null);
  };

  const removeHighlight = async () => {
    if (!selectedVerse) return;

    const verseKey = `${selectedVerse.book}-${selectedVerse.chapter}-${selectedVerse.verse}`;
    const newHighlights = { ...highlights };
    delete newHighlights[verseKey];

    setHighlights(newHighlights);
    await saveHighlights(newHighlights);
    setShowHighlightOptions(false);
    setSelectedVerse(null);
  };

  const getVerseHighlight = (verse) => {
    const verseKey = `${verse.book}-${verse.chapter}-${verse.verse}`;
    return highlights[verseKey] || null;
  };

  const getHighlightStyle = (color) => {
    switch (color) {
      case "blue":
        return "bg-blue-200";
      case "yellow":
        return "bg-yellow-200";
      case "green":
        return "bg-green-200";
      case "orange":
        return "bg-orange-200";
      default:
        return "";
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const loadedBooks = await BibleService.getBooks(currentVersion);
        setBooks(loadedBooks);

        if (loadedBooks.length > 0) {
          const book =
            loadedBooks.find((b) => b.id === currentBook) || loadedBooks[0];
          setCurrentBook(book.id);
          setCurrentBookName(book.name);
        }
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error);
        Alert.alert("Erreur", "Impossible de charger les données bibliques");
      }
    };

    loadInitialData();
  }, [currentVersion]);

  useEffect(() => {
    const loadChapterData = async () => {
      if (!currentBook) return;

      try {
        setIsLoading(true);

        const loadedChapters = await BibleService.getChapters(
          currentBook,
          currentVersion
        );
        setChapters(loadedChapters);

        const isValidChapter = loadedChapters.includes(currentChapter);
        const chapterToUse = isValidChapter
          ? currentChapter
          : loadedChapters[0] || 1;

        if (!isValidChapter) {
          setCurrentChapter(chapterToUse);
        }

        const loadedVerses = await BibleService.getVerses(
          currentBook,
          chapterToUse,
          currentVersion
        );
        setVerses(loadedVerses);

        await saveLastRead(currentBook, chapterToUse);
      } catch (error) {
        console.error("Erreur lors du chargement des chapitres:", error);
        setVerses([]);
        setChapters([1]);
      } finally {
        setIsLoading(false);
      }
    };

    loadChapterData();
  }, [currentBook, currentChapter, currentVersion]);

  const navigateToPreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const navigateToNextChapter = () => {
    const maxChapter = chapters.length > 0 ? Math.max(...chapters) : 1;
    if (currentChapter < maxChapter) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  const selectBook = async (book) => {
    try {
      setCurrentBook(book.id);
      setCurrentBookName(book.name);
      setShowBookSelector(false);

      const loadedChapters = await BibleService.getChapters(
        book.id,
        currentVersion
      );
      setChapters(loadedChapters);

      setCurrentChapter(1);

      setShowChapterSelector(true);
    } catch (error) {
      console.error("Erreur dans selectBook:", error);
      Alert.alert("Erreur", "Impossible de charger le livre sélectionné");
    }
  };

  const selectChapter = (chapter) => {
    setCurrentChapter(chapter);
    setShowChapterSelector(false);
  };

  const saveFontSize = async (size) => {
    try {
      await AsyncStorage.setItem("bibleFontSize", size);
      setFontSize(size);
    } catch (error) {
      console.error(
        "Erreur lors de la sauvegarde de la taille de police:",
        error
      );
    }
  };

  const handleVersePress = (verse) => {
    setSelectedVerse(verse);
    setShowHighlightOptions(true);
  };

  const handleVersionChange = async (version) => {
    await saveVersion(version);
    closeDrawer();
  };

  const maxChapter = useMemo(() => {
    return chapters.length > 0 ? Math.max(...chapters) : 1;
  }, [chapters]);

  if (isLoading && verses.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#007BFF" />
          <Text className="text-lg text-gray-600 mt-4">Chargement...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Overlay pour fermer le drawer */}
      {showSettingsDrawer && (
        <TouchableOpacity
          className="absolute inset-0 bg-black/50 z-40"
          onPress={closeDrawer}
          activeOpacity={1}
        />
      )}

      {/* Drawer des paramètres - AFFICHAGE IMMÉDIAT */}
      {showSettingsDrawer && (
        <View className="absolute left-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl">
          <View className="flex-1">
            <View className="p-6 pt-12 border-b border-gray-200">
              <Text className="text-2xl font-bold text-gray-800">Paramètres</Text>
            </View>

            <ScrollView className="flex-1 p-6">
              {/* Sélection de la langue */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-gray-700 mb-4">
                  Version de la Bible
                </Text>
                <View className="space-y-3">
                  {Object.keys(bibleVersions).map((version) => (
                    <TouchableOpacity
                      key={version}
                      className={`p-4 rounded-lg border-2 my-1 ${
                        currentVersion === version
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 bg-white"
                      }`}
                      onPress={() => handleVersionChange(version)}
                    >
                      <Text
                        className={`text-base font-medium ${
                          currentVersion === version
                            ? "text-blue-700"
                            : "text-gray-700"
                        }`}
                      >
                        {version}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Taille de police */}
              <View className="mb-8">
                <Text className="text-lg font-semibold text-gray-700 mb-4">
                  Taille de police
                </Text>
                <View className="space-y-3">
                  <TouchableOpacity
                    className={`flex-row items-center p-4 rounded-lg border-2 ${
                      fontSize === "small"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => saveFontSize("small")}
                  >
                    <MaterialCommunityIcons
                      name="format-size"
                      size={20}
                      color={fontSize === "small" ? "#3b82f6" : "#6b7280"}
                    />
                    <Text
                      className={`ml-3 text-base ${
                        fontSize === "small"
                          ? "text-blue-700 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      Petit
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-row my-2 items-center p-4 rounded-lg border-2 ${
                      fontSize === "normal"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => saveFontSize("medium")}
                  >
                    <MaterialCommunityIcons
                      name="format-size"
                      size={24}
                      color={fontSize === "medium" ? "#3b82f6" : "#6b7280"}
                    />
                    <Text
                      className={`ml-3 text-base ${
                        fontSize === "medium"
                          ? "text-blue-700 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      Moyen
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className={`flex-row items-center p-4 rounded-lg border-2 ${
                      fontSize === "large"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onPress={() => saveFontSize("large")}
                  >
                    <MaterialCommunityIcons
                      name="format-size"
                      size={28}
                      color={fontSize === "large" ? "#3b82f6" : "#6b7280"}
                    />
                    <Text
                      className={`ml-3 text-base ${
                        fontSize === "large"
                          ? "text-blue-700 font-semibold"
                          : "text-gray-700"
                      }`}
                    >
                      Grand
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Informations */}
              <View className="p-4 rounded-lg mt-20">
                <Text className="text-sm text-gray-600">
                  &copy; Koinonia - Tous droits réservés
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* Header principal */}
      <View className="p-4 border-b border-gray-300 bg-gray-50">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center flex-1">
            <View className="w-10 h-10 rounded-full justify-center items-center mr-2">
              <Feather name="book-open" size={24} color="#007BFF" />
            </View>
            <Text className="text-xl font-bold text-gray-800">
              {currentVersion == "Français" ? 'Sainte Bible' : 'Holy Bible' }
            </Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity className="p-1 ml-1">
              <Ionicons name="search-outline" size={24} color="#777" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1 ml-1"
              onPress={() => navigateFavoris()}
            >
              <Ionicons name="bookmark-outline" size={22} color="#777" />
            </TouchableOpacity>
            <TouchableOpacity
              className="p-1 ml-1"
              onPress={openDrawer}
            >
              <Ionicons name="settings-outline" size={22} color="#777" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row justify-between">
          <TouchableOpacity
            className="flex-row items-center bg-white p-3 rounded-lg border border-gray-300 flex-1 mx-1 justify-between"
            onPress={() => setShowBookSelector(true)}
          >
            <Text
              className="text-base text-gray-800 flex-shrink"
              numberOfLines={1}
            >
              {currentBookName}
            </Text>
            <Text className="text-xs text-gray-600 ml-1">▼</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center bg-white p-3 rounded-lg border border-gray-300 flex-1 mx-1 justify-between"
            onPress={() => setShowChapterSelector(true)}
          >
            <Text className="text-base text-gray-800">
              Ch. {currentChapter}
            </Text>
            <Text className="text-xs text-gray-600 ml-1">▼</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Contenu principal */}
      <ScrollView className="flex-1">
        <View className="p-5">
          {verses.length === 0 ? (
            <Text className="text-center text-base text-gray-600 my-5">
              Aucun verset trouvé pour cette sélection.
            </Text>
          ) : (
            verses.map((verse) => {
              const highlightColor = getVerseHighlight(verse);
              const highlightStyle = getHighlightStyle(highlightColor);

              return (
                <TouchableOpacity
                  key={`${verse.book}-${verse.chapter}-${verse.verse}`}
                  className={`mb-4 p-2 rounded-lg ${highlightStyle}`}
                  onPress={() => handleVersePress(verse)}
                  activeOpacity={0.7}
                >
                  <Text
                    className={`${getFontSizeStyle()} leading-7 text-gray-800 text-left`}
                  >
                    <Text className="font-bold text-blue-600">
                      {verse.verse}.{" "}
                    </Text>
                    {verse.text.replace("¶ ", "")}
                  </Text>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* Navigation entre chapitres */}
      <View className="flex-row justify-around p-1 absolute bottom-2 left-0 right-0 bg-transparent">
        <TouchableOpacity
          className="p-3"
          onPress={navigateToPreviousChapter}
          disabled={currentChapter === 1}
        >
          <FontAwesome6
            name="circle-chevron-left"
            size={35}
            color={currentChapter === 1 ? "#ccc" : "#007BFF"}
          />
        </TouchableOpacity>

        <TouchableOpacity
          className="p-3"
          onPress={navigateToNextChapter}
          disabled={currentChapter === maxChapter}
        >
          <FontAwesome6
            name="circle-chevron-right"
            size={35}
            color={currentChapter === maxChapter ? "#ccc" : "#007BFF"}
          />
        </TouchableOpacity>
      </View>

      {/* Modal de sélection des livres */}
      <Modal
        visible={showBookSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowBookSelector(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowBookSelector(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-xl w-11/12 max-h-3/5 my-20">
                <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-200">
                  <Text className="text-lg font-bold">
                    Sélectionnez un livre
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowBookSelector(false)}
                    className="p-2"
                  >
                    <Text className="text-xl font-bold text-gray-500">×</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={books}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      className="p-4 border-b border-gray-100"
                      onPress={() => selectBook(item)}
                    >
                      <Text className="text-base">{item.name}</Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={
                    <Text className="text-center text-base text-gray-600 my-5">
                      Aucun livre disponible
                    </Text>
                  }
                  initialNumToRender={20}
                  maxToRenderPerBatch={30}
                  windowSize={10}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal de sélection des chapitres */}
      <Modal
        visible={showChapterSelector}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChapterSelector(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowChapterSelector(false)}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-xl p-4 w-11/12 max-h-4/5">
                <Text className="text-lg font-bold mb-4 text-center">
                  Sélectionnez un chapitre
                </Text>

                <ScrollView
                  className="max-h-96"
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  <View className="flex-row flex-wrap justify-center">
                    {chapters.length === 0 ? (
                      <Text className="text-center text-base text-gray-600 my-5">
                        Aucun chapitre disponible
                      </Text>
                    ) : (
                      chapters.map((chapter) => (
                        <TouchableOpacity
                          key={chapter}
                          className={`w-12 h-12 justify-center items-center m-2 rounded-lg ${
                            currentChapter === chapter
                              ? "bg-blue-600"
                              : "bg-gray-100"
                          }`}
                          onPress={() => selectChapter(chapter)}
                        >
                          <Text
                            className={`text-base ${
                              currentChapter === chapter
                                ? "text-white font-bold"
                                : "text-gray-800"
                            }`}
                          >
                            {chapter}
                          </Text>
                        </TouchableOpacity>
                      ))
                    )}
                  </View>
                </ScrollView>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Modal des options de surlignage */}
      <Modal
        visible={showHighlightOptions}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowHighlightOptions(false)}
      >
        <TouchableWithoutFeedback
          onPress={() => setShowHighlightOptions(false)}
        >
          <View className="flex-1 bg-black/50 justify-center items-center">
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-xl p-5 w-11/12 max-w-md">
                <Text className="text-lg font-bold mb-4 text-center">
                  Surligner le verset
                </Text>

                <View className="flex-row justify-around mb-5">
                  <TouchableOpacity
                    className="w-12 h-12 rounded-full bg-blue-200 justify-center items-center"
                    onPress={() => applyHighlight("blue")}
                  />
                  <TouchableOpacity
                    className="w-12 h-12 rounded-full bg-yellow-200 justify-center items-center"
                    onPress={() => applyHighlight("yellow")}
                  />
                  <TouchableOpacity
                    className="w-12 h-12 rounded-full bg-green-200 justify-center items-center"
                    onPress={() => applyHighlight("green")}
                  />
                  <TouchableOpacity
                    className="w-12 h-12 rounded-full bg-orange-200 justify-center items-center"
                    onPress={() => applyHighlight("orange")}
                  />
                </View>

                <TouchableOpacity
                  className="p-3 bg-gray-100 rounded-lg"
                  onPress={removeHighlight}
                >
                  <Text className="text-center text-base text-gray-800">
                    Retirer le surlignage
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="p-3 mt-3 bg-gray-200 rounded-lg"
                  onPress={() => {
                    setShowHighlightOptions(false);
                    setSelectedVerse(null);
                  }}
                >
                  <Text className="text-center text-base text-gray-800">
                    Annuler
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default BibleReader;