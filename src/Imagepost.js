import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Video } from "expo-av";
import { launchImageLibrary } from "react-native-image-picker";
import { createClient } from "@supabase/supabase-js";
import * as FileSystem from "expo-file-system";
import "react-native-url-polyfill/auto";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from './AuthContext';

// 📦 Supabase credentials
const supabaseUrl = "https://rnivpbqqihdwtunlihnp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXZwYnFxaWhkd3R1bmxpaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjEzMDksImV4cCI6MjA3NzkzNzMwOX0.5csZgmeQRRPcfrHPUQhmF26K7xy489oi8mCVtbp-v4w";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const { width } = Dimensions.get("window");

export default function ImagePost() {
  const { user } = useAuth();
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] = useState(null);
  const [videoUri, setVideoUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.8,
    });
    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
      setVideoUri(null);
    }
  };

  const pickVideo = async () => {
    const result = await launchImageLibrary({
      mediaType: "video",
      videoQuality: "high",
    });
    if (result.assets && result.assets.length > 0) {
      setVideoUri(result.assets[0].uri);
      setImageUri(null);
    }
  };

const uploadPost = async () => {
    if (!user?.userId) {
    Alert.alert("Login required", "Please log in to create a post.");
    return;
  }

  if (!imageUri && !videoUri && caption.trim() === "") {
    Alert.alert("Nothing to post", "Write something or select media first.");
    return;
  }

  try {
    setUploading(true);

    const fileUri = imageUri || videoUri;
    const isVideo = !!videoUri;

    const fileName = `${Date.now()}-${fileUri.split("/").pop()}`;
    const contentType = isVideo ? "video/mp4" : "image/jpeg";
    const postType = isVideo ? "video_post" : "image_post";

    // ✅ ANDROID-SAFE FormData upload
    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: fileName,
      type: contentType,
    });

    const uploadRes = await fetch(
      `${supabaseUrl}/storage/v1/object/doodleppad/post/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${supabaseAnonKey}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(errText);
    }

    // ✅ Public URL
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/doodleppad/post/${fileName}`;

    // ✅ Save metadata to backend
    const apiResponse = await fetch(
      "https://mobserv-0din.onrender.com/api/posts/upload-post",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userid: user?.userId || "anonymous",
          caption: caption.trim(),
          url: publicUrl,
          type: postType,
        }),
      }
    );

    if (!apiResponse.ok) {
      throw new Error(`API Error: ${apiResponse.status}`);
    }

    Alert.alert("✅ Post Created!", "Your post has been published.");

    setCaption("");
    setImageUri(null);
    setVideoUri(null);
    setDownloadURL(publicUrl);

  } catch (error) {
    console.error("❌ Upload failed:", error);
    Alert.alert("Upload failed", error.message);
  } finally {
    setUploading(false);
  }
};


  return (

    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#fff" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            }}
            style={styles.avatar}
          />
          <TextInput
            style={styles.captionInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#888"
            value={caption}
            onChangeText={setCaption}
            multiline
          />
        </View>

        {/* Media Preview */}
        {imageUri && (
          <Image
            source={{ uri: imageUri }}
            style={styles.mediaPreview}
            resizeMode="cover"
          />
        )}

        {videoUri && (
          <Video
            source={{ uri: videoUri }}
            style={styles.mediaPreview}
            useNativeControls
            resizeMode="contain"
          />
        )}

        {/* Action Buttons */}
        <View style={styles.actionBar}>
          <TouchableOpacity style={styles.iconButton} onPress={pickImage}>
            <Ionicons name="image-outline" size={24} color="#3b82f6" />
            <Text style={styles.iconText}>Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton} onPress={pickVideo}>
            <Ionicons name="videocam-outline" size={24} color="#10b981" />
            <Text style={styles.iconText}>Video</Text>
          </TouchableOpacity>
        </View>

        {/* Post Button */}
        <TouchableOpacity
          style={styles.postButton}
          onPress={uploadPost}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>

        {/* Uploaded Post Preview */}
        {downloadURL && (
          <View style={styles.postPreview}>
            <Text style={styles.previewTitle}>Your Uploaded Post</Text>

            {downloadURL.endsWith(".mp4") ? (
              <Video
                source={{ uri: downloadURL }}
                style={styles.mediaPreview}
                useNativeControls
                resizeMode="contain"
              />
            ) : (
              <Image
                source={{ uri: downloadURL }}
                style={styles.mediaPreview}
                resizeMode="cover"
              />
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView></SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  captionInput: {
    flex: 1,
    minHeight: 60,
    fontSize: 16,
    color: "#222",
    textAlignVertical: "top",
  },
  mediaPreview: {
    width: "100%",
    height: width * 0.7,
    borderRadius: 12,
    marginVertical: 12,
    backgroundColor: "#000",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
    paddingVertical: 10,
    borderTopWidth: 0.6,
    borderColor: "#eee",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 6,
  },
  iconText: {
    marginLeft: 6,
    fontSize: 15,
    color: "#444",
  },
  postButton: {
    backgroundColor: "#3b82f6",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 20,
  },
  postButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 17,
  },
  postPreview: {
    marginTop: 25,
    borderTopWidth: 0.6,
    borderColor: "#eee",
    paddingTop: 20,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
});
