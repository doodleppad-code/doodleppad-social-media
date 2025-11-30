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
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const API_URL = "https://mobserv-0din.onrender.com/api/users"; 
// CHANGE THIS ↑ to your backend URL

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [people, setPeople] = useState([]); // fetched users
  const [loading, setLoading] = useState(false);

  // ---------- SEARCH FUNCTION ----------
  const searchUser = async (text) => {
    setSearchText(text);
    if (text.length < 1) {
      setPeople([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/username/${text}`);
      const data = await res.json();

      if (data.user) {
        setPeople([data.user]); // backend returns ONE user
      } else {
        setPeople([]);
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>

        <TextInput
          style={styles.searchInput}
          placeholder="Search username..."
          placeholderTextColor="#555"
          value={searchText}
          onChangeText={searchUser}
        />
      </View>

      {/* People Section */}
      <Text style={styles.sectionTitle}>People</Text>

      {loading ? (
        <ActivityIndicator size="large" color="black" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          horizontal
          data={people}
          keyExtractor={(item) => item.userId}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate("UserProfile", { userId: item.userId })}
              style={styles.card}
            >
              <Image
                source={require("../assets/Stylish-Boy.webp")}
                style={styles.avatar}
              />
              <Text style={styles.name}>{item.username}</Text>
              <Text style={styles.username}>{item.email}</Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            searchText.length > 0 ? (
              <Text style={{ marginLeft: 15, marginTop: 10 }}>No user found</Text>
            ) : null
          }
        />
      )}
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
});

export default SearchScreen;
