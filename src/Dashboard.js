import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather, MaterialIcons } from "@expo/vector-icons";

const Dashboard = ({ navigation }) => {
  const [open, setOpen] = useState(false);

  const handleMailPress = () => {
    if (navigation) {
      navigation.navigate("ChatList");
    }
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftSection}>         
          <TouchableOpacity style={styles.circle}
           onPress={() => navigation.navigate("ProfileUI")}>
            <Text style={styles.circleText}>A</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Ionicons name="home" size={26} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Doodle Pad</Text>

        <View style={styles.rightSection}>
          <TouchableOpacity
           onPress={() => navigation.navigate("SearchScreen")}>
            <Feather name="search" size={23} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
          onPress={() => navigation.navigate("NotificationScreen")}>
            <Ionicons name="notifications-outline" size={25} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMailPress}>
            <MaterialIcons name="mail-outline" size={25} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Action Button */}
      <View style={styles.fabContainer}>
        {open && (
          <View style={styles.optionContainer}>
             <TouchableOpacity
      style={styles.optionButton}
      onPress={() => navigation.navigate('ImagePost')}
    >
      <Ionicons name="image-outline" size={22} color="#fff" />
      <Text style={styles.optionText}>Image</Text>
    </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
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
    marginVertical:"10",
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
    elevation: 3,
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
    color: "#000",
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.2,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "black",
  },

  // Floating button
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
    alignItems: "center",
    justifyContent: "center",
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
