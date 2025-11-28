import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { useAuth } from './AuthContext';

const Dashboard = ({ navigation }) => {
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const USER_ID = user?.id || user?._id || user?.userid || "Aditya";

const handleLike = async (postId) => {
  try {
    console.log("➡ Sending Like Request for:", postId);

    const response = await fetch(
      `https://mobserv-0din.onrender.com/api/posts/${postId}/like`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid: USER_ID }),
      }
    );

    const raw = await response.text();
    console.log("⬅ Response Raw:", raw);

    if (!response.ok) {
      console.log("❌ Server Error:", response.status);
      return;
    }

    const data = JSON.parse(raw);
    console.log("🔥 Parsed Data:", data);

    // UI update
    setPosts((prev) =>
      prev.map((post) =>
        (post.postId || post._id) === postId
          ? { ...post, likes: data.likedBy }
          : post
      )
    );
  } catch (error) {
    console.log("❌ Like Error:", error);
  }
};

  const fetchAllPosts = async () => {
    try {
      const response = await fetch("https://mobserv-0din.onrender.com/api/posts");
      const raw = await response.text();
      const data = JSON.parse(raw);

      // because backend returns { message, count, posts: [...] }
      setPosts(data.posts || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPosts();
  }, []);

  const handleMailPress = () => {
    // navigate to a mail/compose screen if exists, otherwise log
    if (navigation && navigation.navigate) navigation.navigate("Mail");
    else console.log("Mail pressed");
  };

  const renderPost = ({ item }) => {
    if (!item) return null;

    const postId = item.postId || item._id;

    return (
      <View style={styles.postCard}>

        {/* Username Row */}
        <View style={styles.userRow}>
          <View style={styles.userCircle}>
            {/* Safe username first letter */}
            <Text style={styles.userLetter}>
              {item?.username?.[0] || "U"}
            </Text>
          </View>

          {/* Safe full username */}
          <Text style={styles.usernameText}>
            {item?.username || "Unknown User"}
          </Text>
        </View>

        {/* Media */}
        {item?.type === "image_post" && (
          <Image source={{ uri: item?.url }} style={styles.postImage} />
        )}

        {item?.type === "video_post" && (
          <Video
            source={{ uri: item?.url }}
            style={styles.postImage}
            useNativeControls
            resizeMode="contain"
          />
        )}

        {item?.type === "audio_post" && (
          <View style={styles.audioBox}>
            <Ionicons name="musical-notes-outline" size={22} color="#000" />
            <Text>Audio Post</Text>
          </View>
        )}

        {/* Caption */}
        {!!item?.caption && (
          <Text style={styles.caption}>{item.caption}</Text>
        )}

        <View style={styles.bottomActions}>

          {/* ❤️ Like Button */}
          <TouchableOpacity
            style={styles.likeRow}
            onPress={() => handleLike(postId)}
          >
            <Ionicons
              name={(item?.likes || []).includes(USER_ID) ? "heart" : "heart-outline"}
              size={26}
              color={(item?.likes || []).includes(USER_ID) ? "red" : "#333"}
            />
            <Text style={styles.actionText}>
              {item?.likes?.length || 0}
            </Text>
          </TouchableOpacity>

          {/* 💬 Comment Button */}
          <TouchableOpacity
            style={styles.commentRow}
            onPress={() =>
              navigation.navigate("CommentsScreen", { postId })
            }
          >
            <Ionicons name="chatbubble-outline" size={24} color="#333" />
            <Text style={styles.actionText}>Comments</Text>
          </TouchableOpacity>

        </View>
      </View>
    );
  };


  return (
    <View style={styles.screen}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>
          <TouchableOpacity
            style={styles.circle}
            onPress={() => navigation.navigate("ProfileUI")}
          >
            <Text style={styles.circleText}>A</Text>
          </TouchableOpacity>

         
        </View>

        <Text style={styles.title}>Doodle Pad</Text>

        <View style={styles.rightSection}>
          <TouchableOpacity
            onPress={() => navigation.navigate("SearchScreen")}
          >
            <Feather name="search" size={23} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("NotificationScreen")}
          >
            <Ionicons name="notifications-outline" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMailPress}>
            <MaterialIcons name="mail-outline" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* -------- POSTS FEED (Single Column) -------- */}
      {loading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item.postId || item._id}
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        {open && (
          <View style={styles.optionContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => navigation.navigate("ImagePost")}
            >
              <Ionicons name="image-outline" size={22} color="#fff" />
              <Text style={styles.optionText}>Image</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => navigation.navigate("AudioPost")}
            >
              <Ionicons name="mic-outline" size={20} color="#fff" />
              <Text style={styles.optionText}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => navigation.navigate("Doodlepad")}
            >
              <Ionicons name="brush-outline" size={20} color="#fff" />
              <Text style={styles.optionText}>Canvas</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => setOpen((prev) => !prev)}
        >
          <Ionicons name={open ? "close" : "add"} size={28} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
  },

  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    justifyContent: "center",
    alignItems: "center",
  },

  circleText: {
    fontWeight: "bold",
  },

  // ---------------- POST FEED ----------------
  postCard: {
    backgroundColor: "#fff",
    marginVertical: 12,
    marginHorizontal: 12,
    borderRadius: 14,
    padding: 12,
    elevation: 1,
    borderWidth: 0.5,
    borderColor: "#eee",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  userCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },

  userLetter: { fontSize: 16, fontWeight: "600" },

  usernameText: { fontSize: 15, fontWeight: "600" },

  postImage: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginTop: 10,
    backgroundColor: "#000",
  },

  audioBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e5e5e5",
    padding: 12,
    borderRadius: 10,
    marginVertical: 10,
  },

  caption: {
    marginTop: 10,
    fontSize: 15,
    color: "#333",
  },

  date: {
    marginTop: 6,
    fontSize: 12,
    color: "#777",
  },

  // Floating Action Button
  fabContainer: {
    position: "absolute",
    bottom: 30,
    right: 25,
    alignItems: "flex-end",
  },

  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },

  optionContainer: {
    marginBottom: 10,
  },

  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginBottom: 10,
  },

  optionText: {
    color: "#fff",
    marginLeft: 8,
    fontWeight: "600",
  },
});

export default Dashboard;
