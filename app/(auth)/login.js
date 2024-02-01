import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { useAuth } from "../../context/AuthProvider";
import axios from "../../axios/axios";

const login = () => {
  const [email, setEmail] = useState("");
  const { setUser, setToken } = useAuth();
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [failed, setFailed] = useState(null);

  const handleLogin = async () => {
    axios
      .post(
        "/login",
        { email, password },
        {
          withCredentials: true,
        }
      )
      .then(async (res) => {
        console.log(res.data.user);
        if (!res.data.success) {
          Toast.show({
            position: "top",
            type: "error",
            text1: "Uh oh...",
            text2: res.data.msg,
          });
          setFailed("border-b-red-500 bg-red-100 bg-opacity-30 rounded-lg");
          return;
        }
        setUser(res.data.user);
        setToken(res.data.token);
        Toast.show({
          position: "top",
          type: "success",
          text1: "LoggedIn",
          text2: res.data.msg,
        });
      });
  };

  return (
    <View className="flex-1 bg-white p-10 items-center pt-24">
      <KeyboardAvoidingView>
        <View className="items-center">
          <Image
            className="rounded-full"
            source={require("../../assets/images/tapclone.png")}
            className="w-20 h-20 items-center"
          />
          <Text className="font-bold text-xl text-center mb-1 text-purple-600">
            Sign In
          </Text>
          <Text>Sign In to your Account</Text>
        </View>
        <View className="mt-16">
          <View>
            <Text className="font-bold text-gray-800 text-xl">Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholderTextColor={"purple"}
              placeholder="Enter your Email"
              className={`border-b mb-3 py-3 w-80 ${failed}`}
            />
          </View>
          <View>
            <Text className="font-bold text-gray-800 text-xl">Password</Text>
            <TextInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
              }}
              placeholderTextColor={"purple"}
              placeholder="Enter your Password"
              className={`border-b py-3 w-80 ${failed}`}
            />
          </View>
          <Pressable
            className="w-24 bg-purple-600 mx-auto mt-5 px-5 py-2 rounded-lg"
            onPress={handleLogin}
          >
            <Text className="text-white font-bold">Login</Text>
          </Pressable>
          <View className="flex-row mt-3">
            <Text>Don't have an account?</Text>
            <Pressable
              className="ml-1"
              onPress={() => navigation.navigate("register")}
            >
              <Text className="font-bold underline text-purple-600">
                Signup
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({});
 