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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./AuthContext";
const API_URL = "https://mobserv-0din.onrender.com/api/users";
const FRIEND_API = "https://mobserv-0din.onrender.com/api/friends";

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(false);

  // Temp state: which users have been requested
  const [requestedUsers, setRequestedUsers] = useState([]);
  const { user } = useAuth();

  // ---------- SEARCH USER ----------
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
        setPeople([data.user]);
      } else {
        setPeople([]);
      }
    } catch (err) {
      console.log(err);
    }

    setLoading(false);
  };

  // ---------- SEND FRIEND REQUEST ----------
 const sendFriendRequest = async (toUserId) => {
  try {
const fromUserId = user?.id || user?._id || user?.userid || user?.userId;

    if (!fromUserId) {
      Alert.alert("Not signed in", "Please sign in to send friend requests.");
      return;
    }
console.log("FROM:", fromUserId, "TO:", toUserId);
    const res = await fetch(`${FRIEND_API}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId, toUserId }),
    });

    const data = await res.json();

    if (data.message) {
      setRequestedUsers([...requestedUsers, toUserId]);  // update UI
    } else {
      console.log("Failed:", data.error);
    }
  } catch (error) {
    console.log(error);
  }
};


  // ---------- CANCEL FRIEND REQUEST ----------
const cancelFriendRequest = async (toUserId) => {
  try {
    const fromUserId = user?.id || user?._id || user?.userid || user?.userId;
    if (!fromUserId) {
      Alert.alert("Not signed in", "Please sign in to cancel friend requests.");
      return;
    }

    const res = await fetch(`${FRIEND_API}/cancel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fromUserId, toUserId }),
    });

    const data = await res.json();

    if (data.message) {
      setRequestedUsers(requestedUsers.filter((uid) => uid !== toUserId));  
    } else {
      console.log("Failed:", data.error);
    }
  } catch (error) {
    console.log(error);
  }
};

  return (
    <ScrollView style={styles.container}>
      
      {/* Header */}
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
          renderItem={({ item }) => {
            const isRequested = requestedUsers.includes(item.userId);

            return (
              <View style={styles.card}>
                {/* Avatar */}
                <Image
                  source={require("../assets/Stylish-Boy.webp")}
                  style={styles.avatar}
                />

                {/* Username + Email */}
                <Text style={styles.name}>{item.username}</Text>
                <Text style={styles.username}>{item.email}</Text>

                {/* SEND / CANCEL FRIEND REQUEST BUTTON */}
                {!isRequested ? (
                  <TouchableOpacity
                    style={styles.addBtn}
                    onPress={() => sendFriendRequest(item.userId)}
                  >
                    <Text style={styles.addBtnText}>Add Friend</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => cancelFriendRequest(item.userId)}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                )}

                {/* GO TO PROFILE */}
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() =>
                    navigation.navigate("UserProfile", { userId: item.userId })
                  }
                >
                  <Text style={styles.viewBtnText}>View</Text>
                </TouchableOpacity>
              </View>
            );
          }}
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
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },

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
    color: "#000",
  },

  horizontalList: { paddingHorizontal: 10, paddingVertical: 10 },

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
    width: 130,
  },

  avatar: { width: 50, height: 50, borderRadius: 25 },

  name: { fontWeight: "600", fontSize: 14, marginTop: 5, color: "#000" },

  username: { color: "#555", fontSize: 12, marginBottom: 10 },

  /* Add Friend Button */
  addBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 5,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  /* Cancel Request Button */
  cancelBtn: {
    backgroundColor: "#FF3B30",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginTop: 5,
  },
  cancelBtnText: { color: "#fff", fontWeight: "600", fontSize: 12 },

  /* View Profile Button */
  viewBtn: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderColor: "#333",
  },
  viewBtnText: { color: "#000", fontSize: 12, fontWeight: "600" },
});

export default SearchScreen;
