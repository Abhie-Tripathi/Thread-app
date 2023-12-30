import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useContext, useState } from "react";
import { UserType } from "../UserContext";
import axios from "axios";

const ThreadsScreen = () => {
  const [content, setContent] = useState("");
  const { userId } = useContext(UserType);

  const handlePostSubmit = () => {
    const postData = {
      userId: userId,
    };

    if (content) {
      postData.content = content;
    }

    axios
      .post("http://10.0.2.2:3000/create-post", postData)
      .then((response) => {
        setContent("");
      })
      .catch((error) => {
        console.log("Error Creating Post", error);
      });
  };
  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          padding: 10,
        }}
      >
        <Image
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            resizeMode: "contain",
          }}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
          }}
        />

        <Text>Abhinav_Tripathi</Text>
      </View>
      <View style={{ flexDirection: "row", marginLeft: 10 }}>
        <TextInput
          value={content}
          onChangeText={(text) => setContent(text)}
          placeholderTextColor="black"
          placeholder="Type your message..."
          multiline
        />
      </View>
      <Pressable style={{ marginTop: 20 }} onPress={handlePostSubmit}>
        <Text
          style={{
            fontWeight: "500",
            color: "#1B75C0",
            textAlign: "center",
            fontSize: 17,
          }}
        >
          Share Post
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default ThreadsScreen;

const styles = StyleSheet.create({});
