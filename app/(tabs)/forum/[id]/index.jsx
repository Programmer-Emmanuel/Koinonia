import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  RefreshControl
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import api from "../../../../assets/api/api";

export default function Commentaire() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // Données mockées (dans une vraie app, vous feriez un appel API)
  const postsData = [
    {
      id: "1",
      category: "Questions",
      title: "Comment comprendre Romains 8:28 ?",
      content: "Je traverse une période difficile et j'aimerais mieux comprendre ce verset.",
      author: "Marie K.",
      time: "il y a 2h",
      likes: 12,
      comments: 8,
      color: "blue",
      commentsList: [
        { id: 1, author: "Paul M.", text: "Ce verset m'a beaucoup aidé dans les moments difficiles.", time: "il y a 1h" },
        { id: 2, author: "Sarah T.", text: "Dieu transforme toute situation pour notre bien.", time: "il y a 30min" },
      ]
    },
    {
      id: "2",
      category: "Témoignages",
      title: "Témoignage de guérison",
      content: "Je voulais partager comment Dieu m'a guéri après des mois de maladie.",
      author: "Jean-Paul",
      time: "il y a 4h",
      likes: 24,
      comments: 15,
      color: "green",
      commentsList: [
        { id: 1, author: "Lucie B.", text: "Gloire à Dieu ! Merci pour ce témoignage.", time: "il y a 3h" },
        { id: 2, author: "David K.", text: "Ça encourage vraiment, merci de partager.", time: "il y a 2h" },
      ]
    },
    {
      id: "3",
      category: "Réflexions",
      title: "Réflexion sur la patience",
      content: "La patience est une vertu que j'apprends chaque jour.",
      author: "Aya B.",
      time: "il y a 6h",
      likes: 8,
      comments: 5,
      color: "purple",
      commentsList: [
        { id: 1, author: "Thomas P.", text: "La patience produit la persévérance.", time: "il y a 4h" },
      ]
    },
  ];

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Trouver le post correspondant à l'ID
  const post = postsData.find(p => p.id === id) || postsData[0];

  // Initialiser les commentaires
  useState(() => {
    if (post && post.commentsList) {
      setComments(post.commentsList);
    }
    setLoading(false);
  }, [post]);

  // Rafraîchir les commentaires
  const onRefresh = async () => {
    setRefreshing(true);
    // Simuler un appel API
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Ajouter un commentaire
  const handleAddComment = () => {
    if (!newComment.trim()) {
      Alert.alert("Erreur", "Veuillez écrire un commentaire");
      return;
    }

    const newCommentObj = {
      id: comments.length + 1,
      author: "Vous",
      text: newComment,
      time: "À l'instant"
    };

    setComments([newCommentObj, ...comments]);
    setNewComment("");

    // Ici, vous ajouteriez l'appel API
    // api.post(`/posts/${id}/comments`, { text: newComment });
  };

  // Supprimer un commentaire
  const handleDeleteComment = (commentId) => {
    Alert.alert(
      "Supprimer le commentaire",
      "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            setComments(comments.filter(comment => comment.id !== commentId));
          }
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="bg-white border-b border-gray-200 p-4">
        <View className="flex-row items-center justify-between mb-2">
          <TouchableOpacity onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">Commentaires</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Infos du post */}
        <View className="mt-2">
          <View className="flex-row items-center gap-2 mb-1">
            <View className={`px-2 py-1 rounded-full ${
              post.color === "blue" ? "bg-blue-100" :
              post.color === "green" ? "bg-green-100" :
              post.color === "purple" ? "bg-purple-100" : "bg-rose-100"
            }`}>
              <Text className={`font-medium text-xs ${
                post.color === "blue" ? "text-blue-700" :
                post.color === "green" ? "text-green-700" :
                post.color === "purple" ? "text-purple-700" : "text-rose-700"
              }`}>
                {post.category}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">{post.time}</Text>
          </View>
          <Text className="text-base font-semibold text-gray-900" numberOfLines={2}>
            {post.title}
          </Text>
          <Text className="text-gray-600 text-sm mt-1" numberOfLines={1}>
            {post.author} • {post.comments} commentaires
          </Text>
        </View>
      </View>

      {/* Liste des commentaires */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#2563eb"]}
            tintColor="#2563eb"
          />
        }
      >
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <ActivityIndicator size="large" color="#2563eb" />
            <Text className="text-gray-500 mt-4">Chargement des commentaires...</Text>
          </View>
        ) : comments.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20 px-8">
            <Feather name="message-circle" size={60} color="#d1d5db" />
            <Text className="text-gray-500 text-lg font-medium mt-4 text-center">
              Aucun commentaire
            </Text>
            <Text className="text-gray-400 text-sm mt-2 text-center">
              Soyez le premier à commenter ce post
            </Text>
          </View>
        ) : (
          <View className="p-4">
            <View className="mb-4">
              <Text className="text-gray-600 font-medium">
                {comments.length} commentaire{comments.length > 1 ? "s" : ""}
              </Text>
            </View>

            {comments.map((comment) => (
              <View
                key={comment.id}
                className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200"
              >
                {/* En-tête du commentaire */}
                <View className="flex-row items-center justify-between mb-2">
                  <View className="flex-row items-center gap-2">
                    <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center">
                      <Text className="text-blue-600 font-bold">
                        {comment.author.charAt(0)}
                      </Text>
                    </View>
                    <View>
                      <Text className="font-medium text-gray-900">
                        {comment.author}
                      </Text>
                      <Text className="text-gray-400 text-xs">
                        {comment.time || "Récemment"}
                      </Text>
                    </View>
                  </View>

                  {/* Bouton supprimer (visible seulement pour vos commentaires) */}
                  {comment.author === "Vous" && (
                    <TouchableOpacity
                      onPress={() => handleDeleteComment(comment.id)}
                      className="p-1"
                    >
                      <Ionicons name="trash-outline" size={18} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>

                {/* Contenu du commentaire */}
                <Text className="text-gray-700 mt-2">{comment.text}</Text>

                {/* Actions du commentaire */}
                <View className="flex-row items-center gap-4 mt-3 pt-3 border-t border-gray-200">
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Ionicons name="heart-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-500 text-xs">J'aime</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
                    <Text className="text-gray-500 text-xs">Répondre</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Input pour ajouter un commentaire */}
      <View className="bg-white border-t border-gray-200 p-4">
        <View className="flex-row items-center">
          <View className="flex-1 bg-gray-100 rounded-full px-4">
            <TextInput
              className="py-3 text-gray-900"
              placeholder="Écrire un commentaire..."
              placeholderTextColor="#adadadff"
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={!newComment.trim()}
            className={`ml-3 p-3 rounded-full ${!newComment.trim() ? "bg-gray-300" : "bg-blue-600"}`}
          >
            <Ionicons
              name="send"
              size={20}
              color={!newComment.trim() ? "#9ca3af" : "white"}
            />
          </TouchableOpacity>
        </View>
        <Text className="text-gray-400 text-xs text-center mt-2">
          Appuyez sur Entrée pour envoyer
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}