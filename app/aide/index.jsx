import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import images from "../../constants/images";
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function Aide() {
    const handleEmailPress = () => {
        Linking.openURL('mailto:koinonia735@gmail.com');
    };

    const handlePhonePress1 = () => {
        Linking.openURL('tel:+2250152161769');
    };

    const handlePhonePress2 = () => {
        Linking.openURL('tel:+2250140022693');
    };

        const handlePhonePress3 = () => {
        Linking.openURL('tel:+2250140834531');
    };

    const handleFacebookPress = () => {
        // Remplace par ton lien Facebook
        Linking.openURL('https://www.facebook.com/share/1BqmjYkqmN/?mibextid=wwXIfr');
    };

    const handleInstagramPress = () => {
        // Remplace par ton lien Instagram
        Linking.openURL('https://www.instagram.com/koinonia339?igsh=Z3MyaGJ2b3BjZ3k%3D&utm_source=qr');
    };

    const handleWhatsappPress = () => {
        // Remplace par ton lien Whatsapp
        Linking.openURL("https://wa.me/2250504126099?text=Bonjour Monsieur/Madame, j’aimerais vous exposer un problème que je rencontre sur l’application Koinonia.");
    };

    return (
        <ScrollView className="flex-1 bg-gray-50">
            {/* Header avec logo */}
            <View className="items-center py-8 bg-white">
                <Image 
                    source={images.logo}
                    className="w-24 h-24 rounded-full"
                    resizeMode="contain"
                />
                <Text className="text-2xl font-bold text-primary-900 mt-4">Besoin d'Aide ?</Text>
                <Text className="text-gray-600 mt-2 text-center px-6">
                    Nous sommes là pour vous accompagner. Contactez-nous par le moyen le plus pratique pour vous.
                </Text>
            </View>

            {/* Cartes de contact */}
            <View className="px-6 py-6 space-y-6 bg-white gap-5">
                {/* Email */}
                <TouchableOpacity 
                    className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-gray-500"
                    onPress={handleEmailPress}
                >
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
                            <Entypo name="mail" size={24} color="black" />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-lg font-bold text-gray-800">Email</Text>
                            <Text className="text-primary-600 mt-1">koinonia735@gmail.com</Text>
                        </View>
                    </View>
                    <Text className="text-gray-600 text-sm mt-3">
                        Envoyez-nous un email et nous vous répondrons dans les plus brefs délais
                    </Text>
                </TouchableOpacity>

                {/* Téléphone 1 */}
                <TouchableOpacity 
                    className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-green-500"
                    onPress={handlePhonePress1}
                >
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-green-100 rounded-full items-center justify-center">
                            <Ionicons name="call-sharp" size={24} color="black" />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-lg font-bold text-gray-800">Contact 1</Text>
                            <Text className="text-green-600 mt-1">+225 01 52 16 17 69</Text>
                        </View>
                    </View>
                    <Text className="text-gray-600 text-sm mt-3">
                        Appelez-nous pour une assistance immédiate
                    </Text>
                </TouchableOpacity>

                {/* Téléphone 2 */}
                <TouchableOpacity 
                    className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-orange-500"
                    onPress={handlePhonePress2}
                >
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center">
                            <Ionicons name="call-sharp" size={24} color="black" />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-lg font-bold text-gray-800">Contact 2</Text>
                            <Text className="text-orange-600 mt-1">+225 01 40 02 26 93</Text>
                        </View>
                    </View>
                    <Text className="text-gray-600 text-sm mt-3">
                        Numéro alternatif disponible pour vous servir
                    </Text>
                </TouchableOpacity>

                {/* Téléphone 3 */}
                <TouchableOpacity 
                    className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-yellow-500"
                    onPress={handlePhonePress3}
                >
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-yellow-100 rounded-full items-center justify-center">
                            <Ionicons name="call-sharp" size={24} color="black" />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-lg font-bold text-gray-800">Contact 3</Text>
                            <Text className="text-yellow-600 mt-1">+225 01 40 83 45 31</Text>
                        </View>
                    </View>
                    <Text className="text-gray-600 text-sm mt-3">
                        Numéro alternatif disponible pour vous servir
                    </Text>
                </TouchableOpacity>

                {/* Réseaux sociaux */}
                <View className="bg-white rounded-2xl p-6 shadow-sm border-l-4 border-purple-500">
                    <View className="flex-row items-center">
                        <View className="w-12 h-12 bg-purple-100 rounded-full items-center justify-center">
                            <AntDesign name="global" size={24} color="black" />
                        </View>
                        <View className="ml-4 flex-1">
                            <Text className="text-lg font-bold text-gray-800">Réseaux Sociaux</Text>
                            <Text className="text-gray-600 mt-1">Suivez-nous sur nos plateformes</Text>
                        </View>
                    </View>
                    
                    <View className="flex-row mt-4 space-x-4 gap-3">
                        {/* Facebook */}
                        <TouchableOpacity 
                            className="flex-1 bg-blue-50 rounded-xl p-4 items-center"
                            onPress={handleFacebookPress}
                        >
                            <FontAwesome name="facebook-f" size={24} color="blue" />
                            <Text className="text-blue-600 font-medium text-xs">Facebook</Text>
                        </TouchableOpacity>

                        {/* Instagram */}
                        <TouchableOpacity 
                            className="flex-1 bg-pink-50 rounded-xl p-4 items-center"
                            onPress={handleInstagramPress}
                        >
                            <Entypo name="instagram" size={24} color="#db2777" />
                            <Text className="text-pink-600 font-medium text-xs">Instagram</Text>
                        </TouchableOpacity>

                        {/* Whatsapp */}
                        <TouchableOpacity 
                            className="flex-1 bg-green-50 rounded-xl p-4 items-center"
                            onPress={handleWhatsappPress}
                        >
                            <FontAwesome name="whatsapp" size={24} color="green" />
                            <Text className="text-green-600 font-medium text-xs">Whatsapp</Text>
                        </TouchableOpacity>
                    </View>
                    
                    <Text className="text-gray-600 text-sm mt-4">
                        Restez connecté avec notre communauté
                    </Text>
                </View>
            </View>

            {/* Section informations supplémentaires */}
            <View className="px-6 py-8 bg-blue-50">                
                <Text className="text-center mb-5">
                    Nous nous engageons à vous répondre dans les 24 heures
                </Text>
                <Text className="text-center mb-5 font-bold">
                    &copy; Koinonia - Tous droits réservés
                </Text>
            </View>
        </ScrollView>
    );
}