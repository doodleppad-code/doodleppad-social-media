import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";

const Profile = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState(""); // empty bio

  const USER_ID = "YOUR_USER_ID_HERE"; // 🔴 replace from AuthContext

  // 🔹 FETCH REAL POSTS
  const fetchPosts = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `https://mobserv-0din.onrender.com/api/posts/user/${USER_ID}`
      );

      const data = await res.json();

      setPosts(data.posts || data || []);
    } catch (err) {
      console.log("Post fetch error:", err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.url }} style={styles.cardImage} />

      {item.type === "video" && (
        <Ionicons name="play" size={30} color="#fff" style={styles.playIcon} />
      )}

      {item.type === "audio" && (
        <View style={styles.audioCircle}>
          <Text style={styles.audioText}>Audio</Text>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No posts yet</Text>
        }
        ListHeaderComponent={
          <View>
            {/* HEADER */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>← Profile</Text>
              <Ionicons name="settings-outline" size={22} />
            </View>

            {/* COVER */}
            <View style={styles.cover}>
              <Feather name="edit-2" size={18} style={styles.coverEdit} />
            </View>

            {/* PROFILE ROW */}
            <View style={styles.profileRow}>
              <Image
                source={{ uri: "https://randomuser.me/api/portraits/women/44.jpg" }}
                style={styles.avatar}
              />

              <View style={{ flex: 1 }}>
                <Text style={styles.name}>
                  John Doe <Text style={{ color: "#facc15" }}>👑</Text>
                </Text>
                <Text style={styles.username}>@username</Text>
              </View>

              <Ionicons name="mail-outline" size={22} />
            </View>

            {/* BIO + ACTIONS */}
            <View style={styles.profileContent}>
              <View style={styles.bioBox}>
                {bio ? (
                  <Text style={styles.bioText}>{bio}</Text>
                ) : (
                  <Text style={styles.bioPlaceholder}>
                    Add a bio to let people know about you
                  </Text>
                )}
              </View>

              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editText}>
                  {bio ? "Edit Profile" : "Add Bio"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* STATS */}
            <View style={styles.stats}>
              <View style={styles.statBox}>
                <Ionicons name="image-outline" size={22} />
                <Text>{posts.length}</Text>
              </View>

              <View style={styles.statBox}>
                <Ionicons name="people-outline" size={22} />
                <Text>Followers</Text>
              </View>
            </View>
          </View>
        }
      />
    </View>
  );
};

export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 14,
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    textAlign: "center",
    color: "#777",
    marginTop: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    marginBottom: 12,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "500",
  },

  cover: {
    height: 160,
    backgroundColor: "#fff",
    borderRadius: 16,
    elevation: 3,
    marginBottom: 30,
  },

  coverEdit: {
    position: "absolute",
    right: 14,
    bottom: 14,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -30,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#fff",
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
  },

  username: {
    color: "red",
    fontSize: 13,
  },

  profileContent: {
    marginTop: 16,
  },

  bioBox: {
    backgroundColor: "#ededed",
    padding: 14,
    borderRadius: 12,
  },

  bioText: {
    fontSize: 14,
    color: "#111",
    lineHeight: 20,
  },

  bioPlaceholder: {
    fontSize: 14,
    color: "#777",
    fontStyle: "italic",
  },

  editBtn: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginVertical: 14,
  },

  editText: {
    fontWeight: "500",
    fontSize: 15,
  },

  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },

  statBox: {
    alignItems: "center",
  },

  card: {
    width: "48%",
    marginBottom: 16,
  },

  cardImage: {
    height: 180,
    borderRadius: 12,
  },

  playIcon: {
    position: "absolute",
    top: "40%",
    left: "42%",
  },

  audioCircle: {
    position: "absolute",
    top: "35%",
    left: "30%",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  audioText: {
    color: "#fff",
    fontWeight: "600",
  },
});

