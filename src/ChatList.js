import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import socketService from './services/socketService';

export default function ChatList({ navigation }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser] = useState({
    userId: 'user1',
    username: 'You',
    email: 'you@example.com',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
  });

  useEffect(() => {
    // Mock users for demonstration
    const mockUsers = [
      {
        userId: 'user2',
        username: 'John Doe',
        email: 'john@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        isOnline: true,
        lastMessage: 'Hey, how are you?',
        lastMessageTime: new Date(),
        unreadCount: 2
      },
      {
        userId: 'user3',
        username: 'Jane Smith',
        email: 'jane@example.com',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
        isOnline: false,
        lastMessage: 'See you tomorrow!',
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 0
      },
      {
        userId: 'user4',
        username: 'Mike Johnson',
        email: 'mike@example.com',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        isOnline: true,
        lastMessage: 'Thanks for the help!',
        lastMessageTime: new Date(Date.now() - 7200000),
        unreadCount: 1
      }
    ];

    setUsers(mockUsers);
    setLoading(false);

    // Connect to socket
    socketService.connect(currentUser);

    // Set up event listeners
    socketService.onUserOnline(handleUserOnline);
    socketService.onUserOffline(handleUserOffline);

    return () => {
      socketService.removeAllListeners();
    };
  }, []);

  const handleUserOnline = (data) => {
    setUsers(prev => prev.map(user => 
      user.userId === data.userId 
        ? { ...user, isOnline: true }
        : user
    ));
  };

  const handleUserOffline = (data) => {
    setUsers(prev => prev.map(user => 
      user.userId === data.userId 
        ? { ...user, isOnline: false }
        : user
    ));
  };

  const startChat = (user) => {
    navigation.navigate('ChatScreen', {
      chatUser: user,
      currentUser: currentUser
    });
  };

  const formatTime = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const renderUser = ({ item }) => (
    <TouchableOpacity 
      style={styles.userItem}
      onPress={() => startChat(item)}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.isOnline && <View style={styles.onlineIndicator} />}
      </View>
      
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.username}>{item.username}</Text>
          <Text style={styles.timeText}>{formatTime(item.lastMessageTime)}</Text>
        </View>
        <View style={styles.messagePreview}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading chats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Chats</Text>
        <TouchableOpacity>
          <Ionicons name="search" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.userId}
        style={styles.chatList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  chatList: {
    flex: 1,
  },
  userItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  timeText: {
    fontSize: 12,
    color: '#666',
  },
  messagePreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 8,
  },
  unreadBadge: {
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
