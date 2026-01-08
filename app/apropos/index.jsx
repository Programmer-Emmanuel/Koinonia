import { View, Text, ScrollView, Image, Linking, TouchableOpacity } from 'react-native';
import images from "../../constants/images";

export default function Apropos() {
    const handleEmailPress = () => {
        Linking.openURL('mailto:koinonia735@gmail.com');
    };

    return (
        <ScrollView className="flex-1 bg-white">
            {/* Header avec logo */}
            <View className="items-center py-8 bg-primary-50">
                <Image 
                    source={images.logo}
                    className="w-32 h-32 rounded-full"
                    resizeMode="contain"
                />
                <Text className="text-3xl font-bold text-primary-900 mt-4">Koinonia</Text>
                <Text className="text-lg text-gray-600 mt-2">Dictionnaire & Méditation Biblique</Text>
            </View>

            {/* Section Présentation */}
            <View className="px-6 py-8">
                <Text className="text-2xl font-bold text-primary-800 mb-6 text-center">
                    Présentation du Projet
                </Text>
                
                <Text className="text-lg leading-7 text-gray-700 mb-8">
                    Notre projet consiste à développer une application mobile et web qui réunit trois grandes fonctionnalités pour approfondir votre foi et votre compréhension des Écritures.
                </Text>

                {/* Fonctionnalités */}
                <View className="space-y-8">
                    {/* Dictionnaire */}
                    <View className="bg-primary-50 rounded-2xl p-6 ">
                        <View className="flex-row items-center mb-4">
                            <View className="w-12 h-12 bg-primary-600 rounded-full items-center justify-center">
                                <Text className="font-bold text-4xl">1</Text>
                            </View>
                            <Text className="text-xl font-bold text-primary-800 ml-4">
                                Dictionnaire Hébreu et Grec
                            </Text>
                        </View>
                        <View className="space-y-3">
                            <Text className="text-gray-700 leading-6">
                                • Accès à un dictionnaire des mots en hébreu et en Grec biblique
                            </Text>
                            <Text className="text-gray-700 leading-6">
                                • Traduction et explication des mots en français et en d'autres langues
                            </Text>
                            <Text className="text-gray-700 leading-6">
                                • Possibilité d'ajouter des langues locales ivoiriennes (Baoulé, Bété, Malinké, etc.)
                            </Text>
                        </View>
                        <Text className="text-primary-600 font-medium mt-3">
                            Accessible même sans connaissance du français
                        </Text>
                    </View>

                    {/* Méditation */}
                    <View className="bg-secondary-50 rounded-2xl p-6">
                        <View className="flex-row items-center mb-4">
                            <View className="w-12 h-12 bg-secondary-600 rounded-full items-center justify-center">
                                <Text className=" font-bold text-4xl">2</Text>
                            </View>
                            <Text className="text-xl font-bold text-secondary-800 ml-4">
                                Espace de Méditation
                            </Text>
                        </View>
                        <View className="space-y-3">
                            <Text className="text-gray-700 leading-6">
                                • Versets bibliques quotidiens pour votre édification
                            </Text>
                            <Text className="text-gray-700 leading-6">
                                • Méditations guidées pour approfondir la compréhension spirituelle
                            </Text>
                            <Text className="text-gray-700 leading-6">
                                • Notes personnelles : enregistrez vos propres réflexions
                            </Text>
                        </View>
                    </View>

                    {/* Forum */}
                    <View className="bg-accent-50 rounded-2xl p-6">
                        <View className="flex-row items-center mb-4">
                            <View className="w-12 h-12 bg-accent-600 rounded-full items-center justify-center">
                                <Text className="font-bold text-4xl">3</Text>
                            </View>
                            <Text className="text-xl font-bold text-accent-800 ml-4">
                                Forum Communautaire
                            </Text>
                        </View>
                        <View className="space-y-3">
                            <Text className="text-gray-700 leading-6">
                                • Plateforme interactive où les utilisateurs peuvent échanger
                            </Text>
                            <Text className="text-gray-700 leading-6">
                                • Poser des questions, partager des réflexions ou des témoignages
                            </Text>
                            <Text className="text-gray-700 leading-6">
                                • Favoriser l'entraide et la croissance spirituelle
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Section Objectifs */}
            <View className="px-6 py-8 bg-gray-50">
                <Text className="text-2xl font-bold text-primary-800 mb-6 text-center">
                    Objectifs du Projet
                </Text>
                
                <View className="space-y-4">
                    <View className="flex-row items-start">
                        <Text className="text-primary-600 text-lg mr-3">•</Text>
                        <Text className="text-gray-700 leading-6 flex-1">
                            Faciliter l'étude de la Bible et l'accès aux mots en hébreu
                        </Text>
                    </View>
                    <View className="flex-row items-start">
                        <Text className="text-primary-600 text-lg mr-3">•</Text>
                        <Text className="text-gray-700 leading-6 flex-1">
                            Encourager la méditation et la croissance spirituelle
                        </Text>
                    </View>
                    <View className="flex-row items-start">
                        <Text className="text-primary-600 text-lg mr-3">•</Text>
                        <Text className="text-gray-700 leading-6 flex-1">
                            Créer une communauté interactive autour de la Parole
                        </Text>
                    </View>
                    <View className="flex-row items-start">
                        <Text className="text-primary-600 text-lg mr-3">•</Text>
                        <Text className="text-gray-700 leading-6 flex-1">
                            Promouvoir la compréhension de la Bible même pour ceux qui ne maîtrisent pas le français
                        </Text>
                    </View>
                </View>
            </View>

            {/* Section Innovation */}
            <View className="px-6 py-8">
                <View className="flex-row items-center justify-center mb-6">
                    <Text className="text-3xl mr-3">💡</Text>
                    <Text className="text-2xl font-bold text-primary-800">
                        Innovation du Projet
                    </Text>
                </View>
                
                <View className="space-y-4 bg-blue-50 rounded-xl">
                    <View className="p-4">
                        <Text className="text-gray-700 leading-6 text-center">
                            Intégration unique entre dictionnaire, méditation et forum
                        </Text>
                    </View>
                    <View className="p-4">
                        <Text className="text-gray-700 leading-6 text-center">
                            Mise en avant des langues locales ivoiriennes pour une meilleure inclusion
                        </Text>
                    </View>
                    <View className="p-4">
                        <Text className="text-gray-700 leading-6 text-center">
                            Application pensée pour être simple, accessible et utile à la fois aux étudiants de la Bible et au grand public
                        </Text>
                    </View>
                </View>
            </View>

            {/* Section Contact */}
            <View className="px-6 py-8 bg-primary-900">
                <Text className="text-xl font-bold text-center mb-2">
                    Contactez-nous
                </Text>
                <TouchableOpacity onPress={handleEmailPress}>
                    <Text 
                        className="text-primary-200 text-center text-lg font-bold bg-blue-500 py-2 text-white rounded"
                    >
                        koinonia735@gmail.com
                    </Text>
                </TouchableOpacity>
                <Text className="text-white text-center mt-6 text-sm">
                    Rejoignez notre communauté et grandissez ensemble dans la foi
                </Text>
            </View>
        </ScrollView>
    );
}