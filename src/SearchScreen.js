import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");

  const people = [
    { id: "1", name: "John Doe", username: "username", img: require("../assets/Stylish-Boy.webp") },
    { id: "2", name: "John Doe", username: "username", img: require("../assets/Happy-Monday.webp") },
    { id: "3", name: "John Doe", username: "username", img: require("../assets/cat.jpeg") },
  ];

  const posts = [
    { id: "1", img: require("../assets/photo-nature.jpeg") },
    { id: "2", img: require("../assets/Stylish-Boy.webp") },
    { id: "3", img: require("../assets/cat.jpeg") },
  ];

  const hashtags = ["#fitness", "#lifestyle", "#fashion", "#food", "#art", "#coding"];

  return (
    <ScrollView style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          placeholderTextColor="#555"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      {/* People Section */}
      <Text style={styles.sectionTitle}>People</Text>
      <FlatList
        horizontal
        data={people}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={item.img} style={styles.avatar} />
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.username}>{item.username}</Text>
          </View>
        )}
      />

      {/* Post Section */}
      <Text style={styles.sectionTitle}>Post</Text>
      <View style={styles.postRow}>
        {posts.map((p) => (
          <Image key={p.id} source={p.img} style={styles.postImage} />
        ))}
      </View>

      {/* Hashtag Section */}
      <Text style={styles.sectionTitle}>#hash_tags</Text>
      <FlatList
        horizontal
        data={hashtags}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalList}
        renderItem={({ item }) => (
          <View style={styles.tagCard}>
            <Text style={styles.tagText}>{item}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingHorizontal: 15,
    paddingBottom: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#000",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginLeft: 15,
    color: "#000000ff",
  },
  horizontalList: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  card: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    padding: 10,
    marginHorizontal: 8,
    width: 100,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  name: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 5,
    color: "#000",
  },
  username: {
    color: "#000000ff",
    fontSize: 12,
  },
  postRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginTop: 10,
  },
  postImage: {
    width: 100,
    height: 120,
    borderRadius: 10,
  },
  tagCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tagText: {
    fontWeight: "500",
    color: "#000",
  },
});

export default SearchScreen;
