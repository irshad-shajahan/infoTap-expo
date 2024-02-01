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
import { Easing } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import Toast from "react-native-toast-message";
import axios from "../../axios/axios";
import { useAuth } from "../../context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Stars from "../../components/Stars";
import dayjs from "dayjs";
import { useFonts } from "expo-font";

const Home = () => {
  const { user, setUser, token } = useAuth();
  const [scaleValue] = useState(new Animated.Value(1));
  const checkInTime = new Date();

  //logic handling cusotm font import
  const [fonLtoaded] = useFonts({
    digital: require("../../assets/fonts/digital-7.ttf"),
  });

  //logic related to the digital clock
  const [time, setTime] = useState(dayjs().format("hh:mm:ss A"));
  const [isPastt, setIsPast] = useState(false);

  function isPast() {
    const currentTime = new Date();
    const targetTime = new Date();
    targetTime.setHours(16, 21, 0, 0);
    return currentTime.getTime() > targetTime.getTime();
  }

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = dayjs();
      setTime(currentTime.format("hh:mm:ss A"));
      if (isPast()) {
        setIsPast(true);
      }else{
        setIsPast(false)
      }
      // console.log(dayjs().isAfter(dayjs('2024-02-01T10:17:07.214Z').))
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(dayjs().format("hh:mm:ss A"));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  //logic related
  const [currentDate, setCurrentDate] = useState(null);
  useEffect(() => {
    // Get the current date
    const today = new Date();

    // Format day, month, and year
    const day = today.getDate();
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[today.getMonth()];
    const year = today.getFullYear();

    // Get day of the week
    const dayOfWeekNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayOfWeek = dayOfWeekNames[today.getDay()];

    // Set the formatted date to the state
    setCurrentDate({ day, dayOfWeek, month, year });
  }, []);

  //animation logic to rotate the colored planet
  const rotation = useState(new Animated.Value(0))[0];
  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 5000, // 5 seconds
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotation]);

  const rotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  //time formatting to display the checked in time
  function formatTime(dateString) {
    const formattedTime = new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
    return formattedTime;
  }

  //function that handles checkin while a user clicks on the check in button
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
          .then((res) => {
            Toast.show({
              position: "top",
              type: "success",
              text1: "Checked In",
              text2: "You have succesfully checked in",
            });
            if (res.data.success) {
              setUser(res.data.user);
            }
          });
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

  //funciton that creates the animation when the reacheed button is clicked
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

  //function that fetches the userdata so that the button can be rendered conditionally
  useEffect(() => {
    const fetchData = async () => {
      try {
        axios
          .get("/getUserData", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          })
          .then((res) => {
            if (res.data.success) {
              setUser(res.data.user);
            }
          });

        // Handle the response here
      } catch (error) {
        // Handle errors here
      }
    };

    fetchData();
  }, []);

  return (
    <View className="flex items-center overflow-hidden h-full bg-black relative">
      <Animated.Image
        className="absolute -right[20%] -bottom-[20%]"
        style={{ width: 300, height: 300, transform: [{ rotate }] }}
        source={require("../../assets/images/Asset-2_300x-1X.png")}
      />
      <View className="h-28 border-b-2 border-white bg-white/20 items-center justify-between backdrop-blur-xl w-full flex-row">
        <View className="border-r-2 h-full flex justify-center w-[33%] items-center border-white">
          <View className="border-b-2 border-white w-full ">
            <Text className="text-orange-500 font-bold w-full mb-3 text-center">
              Leaves
            </Text>
          </View>
          <View className="flex justify-center items-center h-[40%]">
            <Text className="text-white font-bold text-2xl">0</Text>
          </View>
        </View>
        <View className="border-r-2 h-full flex justify-between pb-3 relative w-[33%] items-center border-white">
          <Text className="text-white text-xl mt-3 font-bold">
            {currentDate?.month}
          </Text>
          <View className="flex flex-row justify-between w-full px-2 bottom-3 absolute">
            <Text className="text-white text-tiny uppercase">
              {currentDate?.dayOfWeek}
            </Text>
            <Text className="text-white text-sm font-bol uppercase">
              {currentDate?.year}
            </Text>
          </View>
          <Text className="text-white font-bold">{currentDate?.day}</Text>
          <FontAwesome
            name="calendar-o"
            className="absolute bottom-2 opacity-20"
            size={40}
            color="white"
          />
        </View>
        <View className=" h-full flex justify-center w-[33%] items-center">
          <View className="border-b-2 border-white w-full ">
            <Text className="text-red-500 font-bold w-full mb-3 text-center">
              Late
            </Text>
          </View>
          <View className="flex justify-center items-center h-[40%]">
            <Text className="text-white font-bold text-2xl">0</Text>
          </View>
        </View>
      </View>
      <Stars />
      <View className="h-[70%] flex justify-center gap-10 items-center">
        <View className="w-full">
          <Text
            className="text-white text-6xl w-full text-left"
            style={{ fontFamily: "digital" }}
          >
            {time}
          </Text>
        </View>
        <Animated.View
          style={[
            {
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {user?.isCheckedIn ? (
            // <View className='flex justify-center gap-10 items-center'>

            <View className="border-3 border-black p-5 bg-white/30 rounded-xl">
              <Text className="text-white" style={{}}>
                CheckIn : {formatTime(user?.lastCheckInTime)}
              </Text>
            </View>
          ) : (
            // </View>
            <Pressable
              className={`w-60 h-60 ${
                isPastt ? "bg-red-700" : "bg-green-700"
              } rounded-full mx-auto mt-5 px-5 py-2 flex items-center justify-center`}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={checkIn}
            >
              <Text className="text-white font-bold text-xl">Reached</Text>
            </Pressable>
          )}
        </Animated.View>
      </View>
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
