import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import io from "socket.io-client";

const API_URL = "http://192.168.1.2:5000"; // Change to your server IP

const socket = io(API_URL, {
  transports: ["websocket"],
  reconnectionAttempts: 5, 
});

// Connection logs
socket.on("connect", () => console.log("✅ Connected:", socket.id));
socket.on("connect_error", (err) =>
  console.log("❌ Connection error:", err.message)
);
socket.on("disconnect", (reason) =>
  console.log("⚠️ Disconnected:", reason)
);

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const userId = "user1"; // your logged-in user
  const receiverId = "user2"; // chat partner

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      const res = await fetch(
        `${API_URL}/messages?user1=${userId}&user2=${receiverId}`
      );
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.log("❌ Failed to fetch messages:", err);
    }
  };

  useEffect(() => {
    // Fetch previous messages
    fetchMessages();

    // Join room/user
    socket.emit("join", userId);

    // Listen for incoming messages
    socket.on("receiveMessage", (message) => {
      if (
        (message.senderId === userId && message.receiverId === receiverId) ||
        (message.senderId === receiverId && message.receiverId === userId)
      ) {
        setMessages((prev) => [...prev, message]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // Send message (via Socket.IO and save in MongoDB)
  const sendMessage = () => {
    if (text.trim() === "") return;

    const newMessage = { senderId: userId, receiverId, text };
    socket.emit("sendMessage", newMessage);
    setMessages((prev) => [...prev, newMessage]); // Optimistic UI update
    setText("");
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === userId;
    return (
      <View
        style={[
          styles.messageContainer,
          isMe ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={isMe ? styles.myMessageText : styles.otherMessageText}>
          {item.text}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} />
        <Text style={styles.headerTitle}>{receiverId}</Text>
      </View>

      {/* Chat Messages */}
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* Input Bar */}
      <View style={styles.bottomBar}>
        <TextInput
          style={styles.textInput}
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: { flex: 1, textAlign: "center", fontSize: 18 },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  myMessage: { alignSelf: "flex-end", backgroundColor: "red" },
  myMessageText: { color: "#fff" },
  otherMessage: { alignSelf: "flex-start", backgroundColor: "#eee" },
  otherMessageText: { color: "#000" },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
  },
});
   

// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
// } from "react-native";
// import { Ionicons } from "@expo/vector-icons";
// import io from "socket.io-client";
// const socket = io("http://192.168.1.4:5000", {
//   transports: ["websocket"],  // skip polling
//   reconnectionAttempts: 5,
// });
// // Connection success message

// socket.on("connect", () => console.log("✅ Connected:", socket.id));
// socket.on("connect_error", (err) => console.log("❌ Connection error:", err.message));
// socket.on("disconnect", (reason) => console.log("⚠️ Disconnected:", reason));
// //usb
// // const socket = io("http://10.0.2.2:5000"); // use localhost for web / 10.0.2.2 for Android emulator
// // Replace with your PC's local IP



// // Handle connection errors
// socket.on("connect_error", (err) => {
//   console.log("❌ Connection failed:", err.message);
// });

// export default function ChatScreen() {
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState("");
//   const userId = "user1"; // dynamic user
//   const receiverId = "user2"; // can change for multiple users

//   useEffect(() => {
//     socket.emit("join", userId);

//     socket.on("receiveMessage", (message) => {
//       setMessages((prev) => [...prev, message]);
//     });

//     return () => {
//       socket.off("receiveMessage");
//     };
//   }, []);

//   const sendMessage = () => {
//     if (text.trim() === "") return;

//     const newMessage = { senderId: userId, receiverId, text };
//     socket.emit("sendMessage", newMessage);
//     setMessages((prev) => [...prev, newMessage]); // Optimistic UI
//     setText("");
//   };

//   const renderMessage = ({ item }) => {
//     const isMe = item.senderId === userId;
//     return (
//       <View
//         style={[
//           styles.messageContainer,
//           isMe ? styles.myMessage : styles.otherMessage,
//         ]}
//       >
//         <Text style={isMe ? styles.myMessageText : styles.otherMessageText}>
//           {item.text}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header */}
//       <View style={styles.header}>
//         <Ionicons name="arrow-back" size={24} />
//         <Text style={styles.headerTitle}>username</Text>
//       </View>

//       {/* Chat Messages */}
//       <FlatList
//         data={messages}
//         renderItem={renderMessage}
//         keyExtractor={(item, index) => index.toString()}
//         contentContainerStyle={{ padding: 10 }}
//       />

//       {/* Input Bar */}
//       <View style={styles.bottomBar}>
//         <TextInput
//           style={styles.textInput}
//           placeholder="Type a message"
//           value={text}
//           onChangeText={setText}
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
//           <Ionicons name="send" size={22} color="#fff" />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff" },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//   },
//   headerTitle: { flex: 1, textAlign: "center", fontSize: 18 },
//   messageContainer: {
//     padding: 10,
//     marginVertical: 5,
//     borderRadius: 10,
//     maxWidth: "80%",
//   },
//   myMessage: { alignSelf: "flex-end", backgroundColor: "red" },
//   myMessageText: { color: "#fff" },
//   otherMessage: { alignSelf: "flex-start", backgroundColor: "#eee" },
//   otherMessageText: { color: "#000" },
//   bottomBar: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#ddd",
//   },
//   textInput: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: "#ddd",
//     borderRadius: 20,
//     paddingHorizontal: 12,
//   },
//   sendButton: {
//     marginLeft: 8,
//     backgroundColor: "red",
//     padding: 10,
//     borderRadius: 20,
//   },
// });
