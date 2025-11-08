import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const notifications = [
  {
    id: 1,
    name: "Stephen",
    message: "has like your video",
    time: "2h ago",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    highlight: true,
  },
  {
    id: 2,
    name: "Stephen",
    message: "has like your video",
    time: "2h ago",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 3,
    name: "Stephen",
    message: "has like your video",
    time: "2h ago",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 4,
    name: "Stephen",
    message: "post will disappear in 1 hour",
    extra: "Would you like to pin it?",
    time: "2h ago",
    image: "https://randomuser.me/api/portraits/men/1.jpg",
    actions: true,
  },
];

export default function NotificationScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState("Notifications");

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>username</Text>
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
          <Text style={styles.badgeText}>2</Text>
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

      {/* Notifications List */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {notifications.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              item.highlight && { backgroundColor: "#ffecec" },
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.message}>{item.message}</Text>

              {item.extra && (
                <>
                  <Text style={styles.message}>{item.extra}</Text>
                  <View style={styles.actionRow}>
                    <Text style={styles.time}>{item.time}</Text>
                    <View style={styles.buttons}>
                      <Text style={styles.yes}>Yes</Text>
                      <Text style={styles.no}>No</Text>
                    </View>
                  </View>
                </>
              )}

              {!item.extra && <Text style={styles.time}>{item.time}</Text>}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

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
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
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
  time: {
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttons: {
    flexDirection: "row",
  },
  yes: {
    color: "red",
    marginRight: 10,
    fontWeight: "600",
  },
  no: {
    color: "#000",
    fontWeight: "600",
  },
});
