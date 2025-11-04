import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { Ionicons, Feather, MaterialIcons, FontAwesome } from "@expo/vector-icons";

const Dashboard = ({ navigation }) => {
  const [open, setOpen] = useState(false);

  const handleMailPress = () => {
    if (typeof navigation !== "undefined") {
      navigation.navigate("ChatList");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View style={styles.container}>
        <View style={styles.leftSection}>
          <TouchableOpacity style={styles.circle}>
            <Text style={styles.circleText}>A</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="home" size={26} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.title}>Doodle Pad</Text>

        <View style={styles.rightSection}>
          <TouchableOpacity>
            <Feather name="search" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={26} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMailPress}>
            <MaterialIcons name="mail-outline" size={26} color="black" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Action Button + Options */}
      <View style={styles.fabContainer}>
        {open && (
          <View style={styles.optionContainer}>
            <TouchableOpacity style={styles.optionButton}>
              <Ionicons name="image-outline" size={22} color="#fff" />
              <Text style={styles.optionText}>Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.optionButton}>
              <Ionicons name="mic-outline" size={22} color="#fff" />
              <Text style={styles.optionText}>Audio</Text>
            </TouchableOpacity>
             <TouchableOpacity style={styles.optionButton}>
              <Ionicons name="mic-outline" size={22} color="#fff" />
              <Text style={styles.optionText} onPress={() => navigation.navigate('Doodlepad')}>canvas</Text>
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
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: "#fff",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontFamily: "serif",
    fontWeight: "600",
  },
  circle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  circleText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "black",
  },

  // Floating Button Styles
  fabContainer: {
    position: "absolute",
    bottom: 20,
    right: 20,
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
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 10,
  },
  optionText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },
});

export default Dashboard;
