import {
  Text,
  StyleSheet,
  View,
  ToastAndroid,
  Pressable,
  Animated,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { PermissionsAndroid } from "react-native";
import React, { useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import axios from "../../axios/axios";
import { useAuth } from "../../context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Home = () => {
  const { user, setUser } = useAuth();
  const [scaleValue] = useState(new Animated.Value(1));
  const checkInTime = new Date();

  function formatTime(dateString) {
    const formattedTime = new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit',hour12:true });
    return formattedTime;
  }

  async function checkIn() {
    await Location.requestForegroundPermissionsAsync().then((res) => {
      if (res.status !== "granted") {
        Toast.show({
          position: "top",
          type: "error",
          text1: "Permission denied",
          text2: "Please enable location permission",
        });
        return;
      }
    });
    let token = await AsyncStorage.getItem("token");
    NetInfo.fetch().then((state) => {
      if (state.details.ssid === "Tapclone 5G") {
        axios
          .post(
            "/check-in",
            { checkInTime },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          )
          .then(() => {});
      } else {
        Toast.show({
          position: "bottom",
          type: "error",
          text1: "Verification error",
          text2: "Please connect to an office WIFI",
        });
      }
    });
  }

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.9,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  function formatTime(dateString) {
    const formattedTime = new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
  }
  return (
    <View className="flex items-center h-full justify-center">
      {/* <StatusBar />  */}
      {/* <View className="w-full flex-1 h-10 bg-hite">
      </View> */}
      <Image
        className="w-16 h-16 m-1 absolute top-0 left-0"
        source={require("../../assets/images/tapclone.png")}
      />
      <Animated.View
        style={[
          {
            transform: [{ scale: scaleValue }],
          },
        ]}
      >
        <Pressable
          className="w-40 h-40 bg-red-900 rounded-full mx-auto mt-5 px-5 py-2 flex items-center justify-center"
          // style={({ pressed }) => ({ backgroundColor: pressed ? 'purple' : 'red', width: 200, height: 40, borderRadius: 20, marginHorizontal: 'auto', marginTop: 5, alignItems: 'center', justifyContent: 'center' })}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={checkIn}
        >
          <Text className="text-white font-bold text-lg">Reached</Text>
        </Pressable>
        <Pressable onPress={() => setUser(null)}>
          <Text>Logout</Text>
        </Pressable>
      </Animated.View>
      <Toast />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  text: {
    color: "blue",
  },
});
