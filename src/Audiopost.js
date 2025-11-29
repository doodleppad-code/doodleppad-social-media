import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  Linking,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";
import { useAuth } from './AuthContext';
import { InteractionManager } from "react-native";
// Supabase setup
const supabaseUrl = "https://rnivpbqqihdwtunlihnp.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXZwYnFxaWhkd3R1bmxpaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjEzMDksImV4cCI6MjA3NzkzNzMwOX0.5csZgmeQRRPcfrHPUQhmF26K7xy489oi8mCVtbp-v4w";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AudioPost() {
  const { user } = useAuth();
  const [recording, setRecording] = useState(null);
  const [recordingUri, setRecordingUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);
  const [sound, setSound] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pickedAudioUri, setPickedAudioUri] = useState(null);
  const pulseAnim = useState(new Animated.Value(1))[0];


useEffect(() => {
  return sound
    ? () => {
        sound.unloadAsync().catch(() => {});
      }
    : undefined;
}, [sound]);
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Microphone Access Needed",
          "Please enable microphone access to record audio.",
          [
            { text: "OK" },
            { text: "Open Settings", onPress: () => Linking.openSettings() },
          ]
        );
      }
    })();
  }, []);

  // Animated pulsing effect while recording
  useEffect(() => {
    if (isRecording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording]);

  // Recording controls
  const startRecording = async () => {
    try {
      const permission = await Audio.requestPermissionsAsync();
      if (permission.status !== "granted") {
        Alert.alert("Permission required", "Microphone access is needed.");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      console.log("Recording started...");
    } catch (err) {
      console.error("Failed to start recording:", err);
    }
  };

  const stopRecording = async () => {
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecordingUri(uri);
      setRecording(null);
      setIsRecording(false);
      console.log("Recording stopped:", uri);
    } catch (err) {
      console.error("Failed to stop recording:", err);
    }
  };

  // File picker
  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "audio/*" });
      if (result.assets && result.assets.length > 0) {
        setPickedAudioUri(result.assets[0].uri);
        Alert.alert("✅ Selected", result.assets[0].name);
      }
    } catch (err) {
      console.error(err);
      Alert.alert("❌ Error picking audio");
    }
  };

  // Upload as MP3
  const uploadAudio = async () => {
    const audioUri = recordingUri || pickedAudioUri;
    if (!audioUri) {
      Alert.alert("No audio to upload!");
      return;
    }

    try {
      setUploading(true);
      const fileName = audioUri
        .substring(audioUri.lastIndexOf("/") + 1)
        .replace(/\.[^/.]+$/, ".mp3");

      const base64Data = await FileSystem.readAsStringAsync(audioUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const binaryData = Uint8Array.from(atob(base64Data), (c) =>
        c.charCodeAt(0)
      );

      const { data, error } = await supabase.storage
        .from("doodleppad")
        .upload(`post/${fileName}`, binaryData, {
          contentType: "audio/mpeg",
          upsert: true,
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("doodleppad")
        .getPublicUrl(`post/${fileName}`);

      setDownloadURL(publicData.publicUrl);
      Alert.alert("✅ Upload Complete!", "Audio uploaded successfully as MP3.");
      const apiResponse = await fetch("https://mobserv-0din.onrender.com/api/posts/upload-post", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
              body: JSON.stringify({
                userid: user?.id || user?._id || user?.userid || 'anonymous',
                caption: caption?.trim ? caption.trim() : '',
                url: downloadURL || publicUrl,
                type: "audio_post",
              }),
        });
    
        if (!apiResponse.ok) {
          throw new Error(`API Error: ${apiResponse.status}`);
        }
    
        const result = await apiResponse.json();
        console.log("Post saved to DB:", result);
    
        Alert.alert("✅ Post Created!", "Your post has been published.");
        setCaption("");
        setImageUri(null);
        setVideoUri(null);
      } catch (error) {
        console.error("Upload failed:", error);
        Alert.alert("❌ Upload failed", error.message);
      } finally {
        setUploading(false);
      }
    };

  // Playback
const playAudio = (uri) => {
  InteractionManager.runAfterInteractions(async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      setSound(sound);
    } catch (err) {
      console.error("Playback error:", err);
      Alert.alert("⚠️ Playback failed", "Please try again.");
    }
  });
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎧 Create Audio Post</Text>

      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[styles.recordCircle, isRecording && styles.recordActive]}
          onPress={isRecording ? stopRecording : startRecording}
        >
          <Ionicons
            name={isRecording ? "stop-circle" : "mic-outline"}
            size={60}
            color="#fff"
          />
        </TouchableOpacity>
      </Animated.View>

      <Text style={styles.statusText}>
        {isRecording
          ? "Recording... Tap to stop"
          : recordingUri
          ? "Recorded audio ready!"
          : "Tap mic to start recording"}
      </Text>

      {/* Pick from files */}
      <TouchableOpacity style={styles.fileButton} onPress={pickAudio}>
        <Ionicons name="musical-notes-outline" size={22} color="#fff" />
        <Text style={styles.fileButtonText}>Select Audio File</Text>
      </TouchableOpacity>

      {/* Playback */}
      {(recordingUri || pickedAudioUri) && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => playAudio(recordingUri || pickedAudioUri)}
        >
          <Ionicons name="play-circle" size={26} color="#3b82f6" />
          <Text style={styles.playText}>Play Audio</Text>
        </TouchableOpacity>
      )}

      {/* Upload */}
      {uploading ? (
        <ActivityIndicator
          size="large"
          color="#3b82f6"
          style={{ marginTop: 30 }}
        />
      ) : (
        (recordingUri || pickedAudioUri) && (
          <TouchableOpacity style={styles.uploadButton} onPress={uploadAudio}>
            <Ionicons name="cloud-upload-outline" size={24} color="#fff" />
            <Text style={styles.uploadText}>Upload as MP3</Text>
          </TouchableOpacity>
        )
      )}

      {downloadURL && (
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => playAudio(downloadURL)}
        >
          <Ionicons name="musical-note-outline" size={24} color="#10b981" />
          <Text style={styles.playText}>Play Uploaded Audio</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 30,
  },
  recordCircle: {
    width: 120,
    height: 120,
    backgroundColor: "#ef4444",
    borderRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },
  recordActive: {
    backgroundColor: "#dc2626",
    shadowColor: "#f87171",
    shadowOpacity: 0.8,
    shadowRadius: 20,
  },
  statusText: {
    fontSize: 16,
    color: "#374151",
    marginTop: 20,
  },
  fileButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3b82f6",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 30,
  },
  fileButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "600",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 25,
  },
  playText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 30,
    elevation: 5,
  },
  uploadText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
    fontWeight: "600",
  },
});
