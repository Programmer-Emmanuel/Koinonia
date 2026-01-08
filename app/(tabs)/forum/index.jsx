import { useState } from "react";
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Modal, 
  TextInput, 
  Alert 
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Feather } from "@expo/vector-icons";
import { Link } from "expo-router";
import api from "../../../assets/api/api";

export default function Forum() {
  const [posts, setPosts] = useState([
    {
      id: 1,
      category: "Questions",
      title: "Comment comprendre Romains 8:28 ?",
      content: "Je traverse une période difficile et j'aimerais mieux comprendre ce verset. J'ai besoin de conseils sur comment appliquer cette parole dans ma vie quotidienne.",
      author: "Marie K.",
      time: "il y a 2h",
      likes: 12,
      comments: 8,
      liked: false,
      color: "blue",
      commentsList: [
        { id: 1, author: "Paul M.", text: "Ce verset m'a beaucoup aidé dans les moments difficiles.", time: "il y a 1h" },
        { id: 2, author: "Sarah T.", text: "Dieu transforme toute situation pour notre bien.", time: "il y a 30min" },
      ]
    },
    {
      id: 2,
      category: "Témoignages",
      title: "Témoignage de guérison",
      content: "Je voulais partager comment Dieu m'a guéri après des mois de maladie. C'est un vrai miracle dans ma vie !",
      author: "Jean-Paul",
      time: "il y a 4h",
      likes: 24,
      comments: 15,
      liked: false,
      color: "green",
      commentsList: [
        { id: 1, author: "Lucie B.", text: "Gloire à Dieu ! Merci pour ce témoignage.", time: "il y a 3h" },
        { id: 2, author: "David K.", text: "Ça encourage vraiment, merci de partager.", time: "il y a 2h" },
      ]
    },
    {
      id: 3,
      category: "Réflexions",
      title: "Réflexion sur la patience",
      content: "La patience est une vertu que j'apprends chaque jour. C'est un processus qui demande de la persévérance.",
      author: "Aya B.",
      time: "il y a 6h",
      likes: 8,
      comments: 5,
      liked: false,
      color: "purple",
      commentsList: [
        { id: 1, author: "Thomas P.", text: "La patience produit la persévérance.", time: "il y a 4h" },
      ]
    },
  ]);

  const [activeTab, setActiveTab] = useState("Tous");
  const [showModal, setShowModal] = useState(false);
  const [showFullPost, setShowFullPost] = useState(null);
  const [newPost, setNewPost] = useState({
    category: "Questions",
    title: "",
    content: "",
  });

  // Gestion des likes
  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  // Gestion de la sélection de catégorie
  const handleCategorySelect = (category) => {
    setNewPost({...newPost, category});
  };

  // Publication d'un nouveau post
  const handlePublish = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const newPostObj = {
      id: posts.length + 1,
      category: newPost.category,
      title: newPost.title,
      content: newPost.content,
      author: "Vous",
      time: "À l'instant",
      likes: 0,
      comments: 0,
      liked: false,
      color: newPost.category === "Questions" ? "blue" : 
             newPost.category === "Témoignages" ? "green" : 
             newPost.category === "Réflexions" ? "purple" : "rose",
      commentsList: []
    };

    setPosts([newPostObj, ...posts]);
    setNewPost({ category: "Questions", title: "", content: "" });
    setShowModal(false);
    Alert.alert("Succès", "Votre post a été publié !");
  };

  // Filtrage des posts par catégorie
  const filteredPosts = activeTab === "Tous" 
    ? posts 
    : posts.filter(post => post.category === activeTab);

  // Composant Modal pour nouveau post
  const NewPostModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={() => setShowModal(false)}
    >
      <TouchableOpacity 
        className="flex-1 bg-black/50 justify-center items-center"
        activeOpacity={1}
        onPress={() => setShowModal(false)}
      >
        <TouchableOpacity 
          activeOpacity={1}
          className="w-11/12 bg-white rounded-xl p-6"
          onPress={(e) => e.stopPropagation()}
        >
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-900">Nouveau Post</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Sélecteur de catégorie */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {["Questions", "Témoignages", "Réflexions", "Prières"].map((cat) => (
              <TouchableOpacity
                key={cat}
                onPress={() => handleCategorySelect(cat)}
                className={`mr-3 px-4 py-2 rounded-full ${newPost.category === cat ? 
                  cat === "Questions" ? "bg-blue-100" :
                  cat === "Témoignages" ? "bg-green-100" :
                  cat === "Réflexions" ? "bg-purple-100" : "bg-rose-100"
                  : "bg-gray-100"}`}
              >
                <Text className={`font-medium ${newPost.category === cat ? 
                  cat === "Questions" ? "text-blue-700" :
                  cat === "Témoignages" ? "text-green-700" :
                  cat === "Réflexions" ? "text-purple-700" : "text-rose-700"
                  : "text-gray-600"}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Champ titre */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">Titre</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-gray-900"
              placeholder="Titre de votre post"
              value={newPost.title}
              onChangeText={(text) => setNewPost({...newPost, title: text})}
            />
          </View>

          {/* Champ message */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">Message</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3 text-gray-900 h-32 text-align-top"
              placeholder="Partagez votre pensée..."
              placeholderTextColor="#999"
              value={newPost.content}
              onChangeText={(text) => setNewPost({...newPost, content: text})}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Boutons d'action */}
          <View className="flex-row justify-end gap-3">
            <TouchableOpacity
              onPress={() => setShowModal(false)}
              className="px-6 py-3 bg-gray-200 rounded-lg"
            >
              <Text className="text-gray-700 font-medium">Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePublish}
              className="px-6 py-3 bg-blue-600 rounded-lg flex-row items-center gap-2"
            >
              <Ionicons name="paper-plane" size={18} color="white" />
              <Text className="text-white font-medium">Publier</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );

  // Composant Modal pour voir le post complet
  const FullPostModal = ({ post }) => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showFullPost === post.id}
      onRequestClose={() => setShowFullPost(null)}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="bg-white border-b border-gray-200 p-4">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={() => setShowFullPost(null)}>
              <Ionicons name="arrow-back" size={24} color="#6b7280" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900">Post complet</Text>
            <View style={{ width: 24 }} />
          </View>
        </View>

        {/* Contenu du post */}
        <ScrollView className="flex-1 p-4">
          <View className="flex-row items-center gap-2 mb-4">
            <View className={`px-3 py-1 rounded-full ${
              post.color === "blue" ? "bg-blue-100" :
              post.color === "green" ? "bg-green-100" :
              post.color === "purple" ? "bg-purple-100" : "bg-rose-100"
            }`}>
              <Text className={`font-medium ${
                post.color === "blue" ? "text-blue-700" :
                post.color === "green" ? "text-green-700" :
                post.color === "purple" ? "text-purple-700" : "text-rose-700"
              }`}>
                {post.category}
              </Text>
            </View>
            <Text className="text-gray-500 text-sm">{post.time}</Text>
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-4">{post.title}</Text>
          <Text className="text-gray-700 text-lg leading-relaxed mb-6">{post.content}</Text>
          
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-gray-600 mb-2">Par {post.author}</Text>
            <View className="flex-row items-center gap-4">
              <TouchableOpacity 
                className="flex-row items-center gap-1"
                onPress={() => handleLike(post.id)}
              >
                <Ionicons 
                  name={post.liked ? "heart" : "heart-outline"} 
                  size={20} 
                  color={post.liked ? "#ef4444" : "#6b7280"} 
                />
                <Text className="text-gray-600">{post.likes}</Text>
              </TouchableOpacity>
              
              {/* Lien vers les commentaires avec Expo Router */}
              <Link href={`/forum/${post.id}`} asChild>
                <TouchableOpacity className="flex-row items-center gap-1">
                  <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
                  <Text className="text-gray-600">{post.comments}</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View className="flex-1 bg-gradient-to-b from-blue-50 to-indigo-50">
      <NewPostModal />
      
      {/* HEADER */}
      <View className="bg-white border-b border-gray-200 p-4">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <Feather name="message-circle" size={24} color="#2563eb" />
            <Text className="text-2xl font-bold text-black">Forum</Text>
          </View>
        </View>

        {/* TABS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          {["Tous", "Questions", "Témoignages", "Réflexions", "Prières"].map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-2 rounded-full mr-2 ${
                activeTab === tab 
                  ? tab === "Tous" ? "bg-gray-600" :
                    tab === "Questions" ? "bg-blue-600" :
                    tab === "Témoignages" ? "bg-green-600" :
                    tab === "Réflexions" ? "bg-purple-600" : "bg-rose-600"
                  : "bg-gray-100"
              }`}
            >
              <Text className={`font-medium text-sm ${
                activeTab === tab ? "text-white" : 
                tab === "Questions" ? "text-blue-700" :
                tab === "Témoignages" ? "text-green-700" :
                tab === "Réflexions" ? "text-purple-700" :
                tab === "Prières" ? "text-rose-700" : "text-gray-600"
              }`}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* POSTS */}
      <ScrollView 
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Bouton Nouveau Post */}
        <TouchableOpacity
          onPress={() => setShowModal(true)}
          className="mb-6 bg-white rounded-xl p-4 border border-gray-200 flex-row items-center justify-center gap-2"
        >
          <Ionicons name="add-circle" size={20} color="#2563eb" />
          <Text className="text-blue-600 font-medium">Nouveau post</Text>
        </TouchableOpacity>

        {filteredPosts.map((post) => (
          <View key={post.id} className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-4">
            {/* Catégorie et temps */}
            <View className="flex-row items-center gap-2 mb-3">
              <View className={`px-3 py-1 rounded-full ${
                post.color === "blue" ? "bg-blue-100" :
                post.color === "green" ? "bg-green-100" :
                post.color === "purple" ? "bg-purple-100" : "bg-rose-100"
              }`}>
                <Text className={`font-medium text-sm ${
                  post.color === "blue" ? "text-blue-700" :
                  post.color === "green" ? "text-green-700" :
                  post.color === "purple" ? "text-purple-700" : "text-rose-700"
                }`}>
                  {post.category}
                </Text>
              </View>
              <Text className="text-gray-500 text-sm">{post.time}</Text>
            </View>

            {/* Titre et extrait */}
            <Text className="font-bold text-gray-900 text-lg mb-2">{post.title}</Text>
            <Text className="text-gray-600 text-base mb-3" numberOfLines={3}>
              {post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}
            </Text>
            
            {/* Auteur */}
            <Text className="text-gray-500 text-sm mb-4">Par {post.author}</Text>

            {/* Actions */}
            <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
              <View className="flex-row items-center gap-4">
                {/* Like */}
                <TouchableOpacity 
                  className="flex-row items-center gap-1"
                  onPress={() => handleLike(post.id)}
                >
                  <Ionicons 
                    name={post.liked ? "heart" : "heart-outline"} 
                    size={20} 
                    color={post.liked ? "#ef4444" : "#6b7280"} 
                  />
                  <Text className="text-gray-600 text-sm">{post.likes}</Text>
                </TouchableOpacity>
                
                {/* Lien vers les commentaires avec Expo Router */}
                <Link href={`/forum/${post.id}`} asChild>
                  <TouchableOpacity className="flex-row items-center gap-1">
                    <Ionicons name="chatbubble-outline" size={20} color="#6b7280" />
                    <Text className="text-gray-600 text-sm">{post.comments}</Text>
                  </TouchableOpacity>
                </Link>
              </View>
              
              {/* Lire plus */}
              <TouchableOpacity onPress={() => setShowFullPost(post.id)}>
                <Text className="text-blue-600 text-sm font-medium">Lire plus</Text>
              </TouchableOpacity>
            </View>

            {/* Modal pour post complet */}
            {showFullPost === post.id && <FullPostModal post={post} />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}