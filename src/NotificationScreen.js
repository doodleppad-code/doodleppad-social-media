import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "./AuthContext";

const FRIEND_API = "https://mobserv-0din.onrender.com/api/friends";

export default function NotificationScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("Notifications");
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
console.log("AUTH USER:", user);

  // ======================================================
  // LOAD INCOMING FRIEND REQUESTS
  // ======================================================
  const fetchRequests = async () => {
    try {
      if (!user?.userId) return;

      setLoading(true);

      const res = await fetch(`${FRIEND_API}/incoming/${user.userId}`);
      const data = await res.json();

      if (data.requests) {
        setRequests(data.requests);
      }

      setLoading(false);
    } catch (err) {
      console.log("Error fetching requests:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [selectedTab]); // reload when switching tabs

  // ======================================================
  // ACCEPT FRIEND REQUEST
  // ======================================================
  const acceptRequest = async (fromUserId) => {
    try {
      const res = await fetch(`${FRIEND_API}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: user.userId,
          fromUserId,
        }),
      });

      const data = await res.json();

      if (data.message) {
        setRequests(requests.filter((r) => r.userId !== fromUserId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ======================================================
  // REJECT FRIEND REQUEST
  // ======================================================
  const rejectRequest = async (fromUserId) => {
    try {
      const res = await fetch(`${FRIEND_API}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: user.userId,
          fromUserId,
        }),
      });

      const data = await res.json();

      if (data.message) {
        setRequests(requests.filter((r) => r.userId !== fromUserId));
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Notifications</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab("Notifications")}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "Notifications" && styles.activeTab,
            ]}
          >
            Notifications
          </Text>
        </TouchableOpacity>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>{requests.length}</Text>
        </View>

        <TouchableOpacity onPress={() => setSelectedTab("Request")}>
          <Text
            style={[
              styles.tabText,
              selectedTab === "Request" && styles.activeTab,
            ]}
          >
            Request
          </Text>
        </TouchableOpacity>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* =======================================================
            NOTIFICATIONS TAB (STATIC)
        ======================================================= */}
        {selectedTab === "Notifications" && (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
            No notifications yet.
          </Text>
        )}

        {/* =======================================================
           REQUEST TAB → SHOW FRIEND REQUESTS
        ======================================================= */}
        {selectedTab === "Request" && (
          <View>
            {loading ? (
              <ActivityIndicator size="large" color="black" />
            ) : requests.length === 0 ? (
              <Text style={{ textAlign: "center", marginTop: 20, color: "#888" }}>
                No friend requests
              </Text>
            ) : (
              requests.map((item) => (
                <View key={item.userId} style={styles.card}>
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/1.jpg",
                    }}
                    style={styles.avatar}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.username}</Text>
                    <Text style={styles.message}>
                      sent you a friend request
                    </Text>
                  </View>

                  {/* ACTION BUTTONS */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      onPress={() => acceptRequest(item.userId)}
                    >
                      <Text style={styles.acceptBtn}>Accept</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => rejectRequest(item.userId)}
                    >
                      <Text style={styles.rejectBtn}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// ====================== STYLES ======================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  tabContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderColor: "#ccc",
    paddingBottom: 5,
    marginBottom: 10,
  },
  tabText: {
    fontSize: 15,
    color: "#999",
    marginHorizontal: 10,
  },
  activeTab: {
    color: "#000",
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "#ff2d55",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginHorizontal: 5,
  },
  badgeText: {
    color: "#fff",
    fontSize: 12,
  },
  scrollContainer: {
    paddingBottom: 80,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  name: {
    fontWeight: "600",
  },
  message: {
    color: "#444",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  acceptBtn: {
    color: "#007AFF",
    marginRight: 15,
    fontWeight: "600",
  },
  rejectBtn: {
    color: "#FF3B30",
    fontWeight: "600",
  },
});
