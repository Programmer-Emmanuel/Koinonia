import { router } from 'expo-router'
import { View, Text, TouchableOpacity, Image, Modal } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import images from '../../constants/images'
import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export function MenuDrawer({ setDrawerOpen }) {
  const [token, setToken] = useState(null)
  const [logoutModalVisible, setLogoutModalVisible] = useState(false)

  useEffect(() => {
    checkToken()
  }, [])

  const checkToken = async () => {
    try {
      const userToken = await AsyncStorage.getItem('token')
      setToken(userToken)
    } catch (error) {
      console.error('Erreur lors de la vérification du token:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token')
      setToken(null)
      setLogoutModalVisible(false)
      if (setDrawerOpen) setDrawerOpen(false)
      router.push('/(tabs)')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    }
  }

  // Menu items basés sur l'état de connexion
  const getMenuItems = () => {
    if (token) {
      // Utilisateur connecté
      return [
        {
          icon: 'person-outline',
          label: 'Profil',
          route: '/profil'
        },
        {
          icon: 'help-circle-outline',
          label: 'Aide',
          route: '/aide'
        },
        {
          icon: 'information-circle-outline',
          label: 'À propos',
          route: '/apropos'
        },
        {
          icon: 'log-out-outline',
          label: 'Déconnexion',
          action: () => setLogoutModalVisible(true)
        }
      ]
    } else {
      // Utilisateur non connecté
      return [
        {
          icon: 'help-circle-outline',
          label: 'Aide',
          route: '/aide'
        },
        {
          icon: 'information-circle-outline',
          label: 'À propos',
          route: '/apropos'
        },
        {
          icon: 'log-in-outline',
          label: 'Connexion',
          route: '/connexion'
        },
        {
          icon: 'person-add-outline',
          label: 'Inscription',
          route: '/inscription'
        }
      ]
    }
  }

  const handleNavigation = (route) => {
    if (setDrawerOpen) setDrawerOpen(false)
    router.push(route)
  }

  const handleMenuItemPress = (item) => {
    if (item.action) {
      item.action()
    } else if (item.route) {
      handleNavigation(item.route)
    }
  }

  const menuItems = getMenuItems()

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header avec logo et fermeture */}
      <View className="bg-white pt-12 px-6 pb-6 rounded-b-3xl mb-5 border-b border-gray-200">
        <View className="flex-row justify-between items-center mb-6 mt-5">
          <View className="flex-row items-center">
            <Image
              source={images.logo}
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 12 }}
              resizeMode="contain"
            />
            <Text className="text-2xl font-bold text-gray-900">Koinonia</Text>
          </View>
          <TouchableOpacity
            onPress={() => setDrawerOpen && setDrawerOpen(false)}
            className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
          >
            <Ionicons name="close" size={22} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Text className="text-gray-600 text-base font-bold">
          {token ? 'Bienvenue sur l\'application !' : 'Explorez l\'application !'}
        </Text>
      </View>

      {/* Menu items */}
      <View className="flex-1 px-6 pt-6">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`flex-row items-center gap-2 py-4 px-4 bg-white rounded-2xl mb-3 shadow-sm ${
              item.label === 'Déconnexion' ? '' : ''
            }`}
            onPress={() => handleMenuItemPress(item)}
          >
            <View className={`w-10 h-10 rounded-xl items-center justify-center mr-4 ${
              item.label === 'Déconnexion' ? 'bg-red-50' : 'bg-blue-50'
            }`}>
              <Ionicons 
                name={item.icon} 
                size={20} 
                color={item.label === 'Déconnexion' ? '#EF4444' : '#007BFF'} 
              />
            </View>
            <Text className={`text-lg font-semibold flex-1 ${
              item.label === 'Déconnexion' ? 'text-red-600' : 'text-gray-800'
            }`}>
              {item.label}
            </Text>
            <Ionicons 
              name="chevron-forward" 
              size={18} 
              color={item.label === 'Déconnexion' ? '#EF4444' : '#999'} 
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Modal de confirmation de déconnexion */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-2xl w-80 p-6">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3">
                <Ionicons name="log-out-outline" size={30} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">Déconnexion</Text>
              <Text className="text-gray-600 text-center text-base">
                Êtes-vous sûr de vouloir vous déconnecter ?
              </Text>
            </View>
            
            <View className="flex-row justify-between gap-3 mt-4">
              <TouchableOpacity
                className="flex-1 py-3 rounded-xl"
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text className="text-gray-700 text-center font-medium">Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 py-3 bg-red-50 rounded-xl border border-red-200"
                onPress={handleLogout}
              >
                <Text className="text-red-600 text-center font-bold">Déconnexion</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}