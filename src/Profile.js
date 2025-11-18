import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("Saved");

  const pins = [
    { id: "1", title: "All Pins", img: require("../assets/cat.jpeg"), count: "5 Pins", time: "2d ago" },
    { id: "2", title: "Day", img: require("../assets/Happy-Monday.webp"), count: "14 Pins", time: "2mo" },
    { id: "3", title: "Nature", img: require("../assets/photo-nature.jpeg"), count: "3 Pins", time: "3mo" },
    { id: "4", title: "Men", img: require("../assets/Stylish-Boy.webp"), count: "1 Pin", time: "2d ago" },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={item.img} style={styles.cardImage} />
      <View style={styles.cardDetails}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>
          {item.count} · {item.time}
        </Text>
      </View>
    </View>
  );

  const ListHeader = () => (
    <View>
      {/* Profile Header */}
      <View style={styles.profileSection}>
        <Image
          source={require("../assets/images.jpeg")} // Replace with your profile image
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Vru Thakare</Text>
        <Text style={styles.username}>@aeru</Text>
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
      <FlatList
        data={pins}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
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
    color: "#000000ff",
    fontSize: 20,
    fontWeight: "600",
  },
  username: {
    color: "#000000ff",
    fontSize: 14,
  },
  followText: {
    color: "#000000ff",
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
    borderBottomColor: "#000000ff",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#aaa",
    borderRadius: 12,
    paddingHorizontal: 10,
    marginVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: "#000000ff",
    padding: 8,
  },
  grid: {
    paddingBottom: 60,
  },
  row: {
    justifyContent: "space-between",
  },
  card: {
    backgroundColor: "#9e9d9dff",
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 16,
    flex: 0.48,
  },
  cardImage: {
    width: "100%",
    height: 100,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  cardDetails: {
    padding: 10,
  },
  cardTitle: {
    color: "#161616ff",
    fontWeight: "600",
    fontSize: 15,
  },
  cardSubtitle: {
    color: "#161616ff",
    fontSize: 12,
    marginTop: 3,
  },
});

export default Profile;
