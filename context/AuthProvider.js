import { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";

const AuthContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
});

export const useAuth = () => useContext(AuthContext);

function useProtectedRoute(user, token) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      router.replace("/login");
    } else if (user && inAuthGroup) {
      router.replace("/home");
    }
  }, [user, segments]);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("token");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error loading user data from AsyncStorage:", error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const saveUserData = async () => {
      try {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("token",token?token:'');
      } catch (error) {
        console.error("Error saving user data to AsyncStorage:", error);
      }
    };

    saveUserData();
  }, [user, token]);

  useProtectedRoute(user, token);

  const authContext = {
    user,
    token,
    setUser,
    setToken,
  };

  return <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>;
}
