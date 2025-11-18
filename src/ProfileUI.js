// ProfileUI.js
import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons, FontAwesome, Feather } from "@expo/vector-icons";

export default function ProfileUI() {
  const posts = [
    { id: "1", image: "https://picsum.photos/200/300", text: "Lorem Ipsum is simply a dummy text..." },
    { id: "2", image: "https://picsum.photos/200/301", text: "Lorem Ipsum is simply a dummy text..." },
    { id: "3", image: "https://picsum.photos/200/302", text: "Lorem Ipsum is simply a dummy text..." },
    { id: "4", image: "https://picsum.photos/200/303", text: "Lorem Ipsum is simply a dummy text..." },
    { id: "5", image: "https://picsum.photos/200/304", text: "Lorem Ipsum is simply a dummy text..." },
    { id: "6", image: "https://picsum.photos/200/305", text: "Lorem Ipsum is simply a dummy text..." },
    { id: "7", image: "https://picsum.photos/200/306", text: "Lorem Ipsum is simply a dummy text..." },
    { id: "8", image: "https://picsum.photos/200/307", text: "Lorem Ipsum is simply a dummy text..." },
  ];

  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
      <Text style={styles.postText}>{item.text}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/women/68.jpg" }}
          style={styles.profileImage}
        />
        <View style={styles.nameSection}>
          <View style={styles.row}>
            <Text style={styles.name}>John Doe </Text>
            {/* <Ionicons name="crown" size={16} color="#FFD700" /> */}
          </View>
          <Text style={styles.username}>Username</Text>
          <Text style={styles.bio}>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum is simply dummy text of
          </Text>
        </View>

        <View style={styles.topIcons}>
          <TouchableOpacity>
            <Feather name="edit-3" size={20} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Likes Section */}
      <View style={styles.likesRow}>
        <FontAwesome name="heart" size={18} color="red" />
        <Text style={styles.likeCount}>12</Text>
      </View>

      {/* Edit Profile Button */}
      <TouchableOpacity style={styles.editBtn}>
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Ionicons name="images-outline" size={22} color="black" />
          <Text style={styles.statNumber}>256</Text>
        </View>
        <View style={styles.statBox}>
          <Ionicons name="bicycle-outline" size={22} color="black" />
          <Text style={styles.statNumber}>3.5 M</Text>
        </View>
      </View>

      {/* Posts Grid */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  nameSection: {
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
  },
  username: {
    fontSize: 14,
    color: "#777",
    marginBottom: 6,
  },
  bio: {
    fontSize: 13,
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  topIcons: {
    position: "absolute",
    top: 10,
    right: 20,
  },
  likesRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  likeCount: {
    marginLeft: 5,
    color: "#000",
    fontWeight: "bold",
  },
  editBtn: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: "center",
    marginVertical: 10,
  },
  editText: {
    fontWeight: "500",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  statBox: {
    alignItems: "center",
  },
  statNumber: {
    fontWeight: "bold",
    marginTop: 4,
  },
  postCard: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 3,
    overflow: "hidden",
  },
  postImage: {
    width: "100%",
    height: 150,
  },
  postText: {
    fontSize: 12,
    padding: 5,
  },
});
