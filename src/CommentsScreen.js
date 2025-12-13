import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./AuthContext";

const CommentsScreen = ({ route }) => {
  const { postId } = route.params;
  const { user } = useAuth();

  const USER_ID = user?.id || user?._id || user?.userid || "Guest";

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Comments
  const fetchComments = async () => {
    try {
      const res = await fetch(
        `https://mobserv-0din.onrender.com/api/posts/${postId}/comments`
      );

      const raw = await res.text();
      const data = JSON.parse(raw);

      setComments(data.comments || []);
    } catch (e) {
      console.log("Fetch comment error:", e);
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Add Comment
  const addComment = async () => {
    if (!text.trim()) return;

    try {
      const res = await fetch(
        `https://mobserv-0din.onrender.com/api/posts/${postId}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userid: USER_ID, text }),
        }
      );

      const raw = await res.text();
      const data = JSON.parse(raw);

      setComments(data.comments); // update UI instantly
      setText("");
    } catch (error) {
      console.log("Add comment error:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Comments</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.commentBox}>
              <View style={styles.userCircle}>
                <Text style={styles.userLetter}>
                  {item.userid?.[0] || "U"}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.commentUser}>{item.userid}</Text>
                <Text style={styles.commentText}>{item.text}</Text>
                <Text style={styles.commentDate}>
                  {item.date?.slice(0, 10)}
                </Text>
              </View>
            </View>
          )}
        />
      )}

      {/* 🟢 Add Comment Box */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add a comment..."
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity onPress={addComment}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 60,
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
  },
  commentBox: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: "#ddd",
  },
  userCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  userLetter: { fontWeight: "700", fontSize: 16 },
  commentUser: { fontWeight: "600", fontSize: 14 },
  commentText: { fontSize: 14, marginTop: 3 },
  commentDate: { fontSize: 11, color: "#777", marginTop: 2 },

  inputRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingTop: 10,
    marginTop: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
});
