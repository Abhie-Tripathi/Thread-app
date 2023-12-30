import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { UserType } from "../UserContext";

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const { userId } = useContext(UserType);

  useEffect(() => {
    fetchPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const handleLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://10.0.2.2:3000/posts/${postId}/${userId}/like`
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) =>
        post._id == updatedPost._id ? updatedPost : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error liking a post", error);
    }
  };

  const handleUnLike = async (postId) => {
    try {
      const response = await axios.put(
        `http://10.0.2.2:3000/posts/${postId}/${userId}/unlike`
      );
      const updatedPost = response.data;
      const updatedPosts = posts.map((post) =>
        post._id == updatedPost._id ? updatedPost : post
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.log("Error Unliking a user");
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://10.0.2.2:3000/get-posts");
      setPosts(response.data);
    } catch (error) {
      console.log("Error Fetching the posts", error);
    }
  };

  return (
    <ScrollView style={{ marginTop: 50, flex: 1, backgroundColor: "white" }}>
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image
          style={{ width: 60, height: 40, resizeMode: "contain" }}
          source={{
            uri: "https://freelogopng.com/images/all_img/1688663386threads-logo-transparent.png",
          }}
        />
      </View>

      <View style={{ marginTop: 20 }}>
        {posts?.map((post, index) => (
          <View
            key={index}
            style={{
              padding: 15,
              borderColor: "#D0D0D0",
              borderTopWidth: 1,
              flexDirection: "row",
              gap: 10,
              marginVertical: 10,
            }}
          >
            <View>
              <Image
                key={index}
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
            </View>
            <View>
              <Text
                style={{ fontSize: 15, fontWeight: "bold", marginBottom: 4 }}
              >
                {post.user.name}
              </Text>
              <Text>{post.content}</Text>
              <View
                style={{
                  flexDirection: "row",
                  gap: 10,
                  alignItems: "center",
                  marginTop: 12,
                }}
              >
                {post.likes.includes(userId) ? (
                  <AntDesign
                    onPress={() => handleUnLike(post._id)}
                    name="heart"
                    size={18}
                    color="red"
                  />
                ) : (
                  <AntDesign
                    onPress={() => handleLike(post._id)}
                    name="hearto"
                    size={18}
                    color="black"
                  />
                )}

                <FontAwesome name="comment-o" size={18} color="black" />
                <Ionicons name="share-social-outline" size={18} color="black" />
              </View>

              <Text style={{ marginTop: 7, color: "gray" }}>
                {post?.likes?.length} likes - {post.replies.length} reply
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({});
