import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://koinonia.msgroupe.tech/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000, 
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn("Impossible de récupérer le token :", error);
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (!error.response) {
      console.warn("Erreur réseau :", error.message);
      return Promise.reject({
        message: "Impossible de contacter le serveur. Vérifiez votre connexion Internet.",
      });
    }

    const { status } = error.response;

    if (status === 401) {
      console.log("Token expiré ou invalide → Déconnexion auto");

      await AsyncStorage.removeItem('token');

      return Promise.reject({
        message: "Votre session a expiré. Veuillez vous reconnecter.",
        status,
      });
    }

    return Promise.reject(error.response.data || error.message);
  }
);

export default api;
