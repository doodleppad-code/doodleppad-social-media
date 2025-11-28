import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from './AuthContext';

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("Saved");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const username = user?.username || user?.id || ""; // logged-in username (fallback empty)

  // 🔥 Fetch user posts
 const fetchPosts = async (uname) => {
  const unameToUse = uname || username;
  try {
    setLoading(true);

    if (!unameToUse) {
      // No user available yet
      setPosts([]);
      setLoading(false);
      return;
    }

    const URL = `https://mobserv-0din.onrender.com/api/posts/user/${encodeURIComponent(unameToUse)}`;
    console.log("🔗 Fetching:", URL);

    const response = await fetch(URL);
    const raw = await response.text();
    console.log("🧾 Raw:", raw);

    if (!response.ok) throw new Error("Failed to load posts");

    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      console.warn('Non-JSON response for posts:', raw);
      throw e;
    }

    setPosts(data.posts || []);

  } catch (error) {
    console.error("❌ Fetch error:", error);
    Alert.alert("Error", error.message);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    // fetch when component mounts and whenever the user changes
    fetchPosts();
  }, []);

  useEffect(() => {
    if (user) fetchPosts(user.username || user.id);
  }, [user]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.url }}
        style={styles.cardImage}
        resizeMode="cover"
      />
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{item.caption || "Untitled"}</Text>
        <Text style={styles.cardSubtitle}>
          {item.type?.toUpperCase() || "POST"} · {item.createdAt?.slice(0, 10)}
        </Text>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View>
      {/* Profile Header */}
      <View style={styles.profileSection}>
        <Image
          source={require("../assets/images.jpeg")} // Replace with dynamic user image
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user?.username || 'User'}</Text>
        <Text style={styles.username}>@{(username || 'guest').toLowerCase()}</Text>
        <Text style={styles.followText}>10 followers · 50 following</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab("Created")}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "Created" && styles.activeTab,
            ]}
          >
            Created
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab("Saved")}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "Saved" && styles.activeTab,
            ]}
          >
            Saved
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search your Pins"
          placeholderTextColor="#888"
          style={styles.searchInput}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderItem}
          keyExtractor={(item) => item.postId || item._id}
          numColumns={2}
          ListHeaderComponent={ListHeader}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#555", marginTop: 20 }}>
              No posts yet.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginBottom: 8,
  },
  profileName: {
    color: "#000",
    fontSize: 20,
    fontWeight: "600",
  },
  username: {
    color: "#000",
    fontSize: 14,
  },
  followText: {
    color: "#000",
    marginTop: 4,
    fontSize: 13,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 10,
  },
  tabText: {
    color: "#2c2c2c",
    fontSize: 16,
    marginHorizontal: 20,
    paddingBottom: 4,
  },
  activeTab: {
    color: "#2c2c2c",
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: "#000",
    padding: 8,
  },
  grid: {
    paddingBottom: 60,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    flex: 0.48,
  },
  cardImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardDetails: {
    padding: 10,
  },
  cardTitle: {
    color: "#161616",
    fontWeight: "600",
    fontSize: 15,
  },
  cardSubtitle: {
    color: "#555",
    fontSize: 12,
    marginTop: 3,
  },
});

export default Profile;
