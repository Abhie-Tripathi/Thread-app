import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { userId } = useContext(UserType);
  const [user, setUser] = useState("");
  const navigation = useNavigation();

  const logout = () => {
    clearAuthToken();
  };

  const clearAuthToken = async () => {
    await AsyncStorage.removeItem("authToken");
    console.log("Cleared auth token");
    navigation.navigate("Login");
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      const response = await axios.get(
        `http://10.0.2.2:3000/profile/${userId}`
      );
      const { user } = response.data;
      setUser(user);
    } catch (error) {
      console.log("Error while Fetching user details", error);
    }
  };

  return (
    <View style={{ marginTop: 55, padding: 15 }}>
      <View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>{user.name}</Text>
          <View
            style={{
              paddingHorizontal: 7,
              paddingVertical: 5,
              borderRadius: 8,
              backgroundColor: "#D0D0D0",
            }}
          >
            <Text>Threads.net</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 20,
            marginTop: 15,
          }}
        >
          <View>
            <Image
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                resizeMode: "contain",
              }}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
            />
          </View>
          <View>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>Foodie</Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Tech Enthusiast
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "400" }}>
              Frontend Developer
            </Text>
          </View>
        </View>
        <Text style={{ color: "gray", fontSize: 15, marginTop: 10 }}>
          {user?.followers?.length} Followers
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            marginTop: 20,
          }}
        >
          <Pressable
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#D0D0D0",
              padding: 10,
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Edit Profile</Text>
          </Pressable>

          <Pressable
            onPress={logout}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              borderColor: "#D0D0D0",
              padding: 10,
              borderWidth: 1,
              borderRadius: 5,
            }}
          >
            <Text>Logout</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({});
