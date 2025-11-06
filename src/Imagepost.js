import React, { useState } from 'react';
import {
  View,
  Button,
  Image,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  Text,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { createClient } from '@supabase/supabase-js';
import * as FileSystem from 'expo-file-system';
import 'react-native-url-polyfill/auto';

// 🔐 Your Supabase credentials
const supabaseUrl = 'https://rnivpbqqihdwtunlihnp.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJuaXZwYnFxaWhkd3R1bmxpaG5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNjEzMDksImV4cCI6MjA3NzkzNzMwOX0.5csZgmeQRRPcfrHPUQhmF26K7xy489oi8mCVtbp-v4w';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function ImagePost() {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  // 📸 Pick image from gallery
  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  // ☁️ Upload image to Supabase Storage (bucket: doodleppad)
const uploadImage = async () => {
  if (!imageUri) {
    Alert.alert('No image selected!');
    return;
  }

  try {
    setUploading(true);
    const fileName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    console.log('Uploading:', fileName);

    // 1️⃣ Read file as base64
    const base64Data = await FileSystem.readAsStringAsync(imageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // 2️⃣ Convert base64 → binary Uint8Array
    const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

    // 3️⃣ Upload directly to Supabase
    const { data, error } = await supabase.storage
      .from('doodleppad')
      .upload(`public/${fileName}`, binaryData, {
        contentType: 'image/jpeg',
        upsert: true,
      });

    if (error) throw error;

    // 4️⃣ Get public URL
    const { data: publicData } = supabase.storage
      .from('doodleppad')
      .getPublicUrl(`post/${fileName}`);

    setDownloadURL(publicData.publicUrl);
    Alert.alert('✅ Upload Complete!', 'Image uploaded successfully');
  } catch (error) {
    console.error('Upload failed:', error);
    Alert.alert('❌ Upload failed', error.message);
  } finally {
    setUploading(false);
  }
};
const testSupabase = async () => {
  try {
    const res = await fetch('https://rnivpbqqihdwtunlihnp.supabase.co');
    console.log('✅ Supabase reachable:', res.status);
  } catch (e) {
    console.error('❌ Supabase not reachable:', e);
  }
};
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📤 Upload Image to Supabase</Text>

      <Button title="Pick Image" onPress={pickImage} />

      {imageUri && (
        <>
          <Text style={styles.label}>Preview:</Text>
          <Image
            source={{ uri: imageUri }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
        </>
      )}

      {uploading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        imageUri && (
          <Button title="Upload Image" onPress={uploadImage} color="#4CAF50" />
        )
      )}
<Button title="Test Supabase Connection" onPress={testSupabase} />

      {downloadURL && (
        <>
          <Text style={styles.label}>Uploaded Image:</Text>
          <Image
            source={{ uri: downloadURL }}
            style={styles.imagePreview}
            resizeMode="cover"
          />
          <Text selectable style={styles.urlText}>
            {downloadURL}
          </Text>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
  },
  imagePreview: {
    width: 250,
    height: 250,
    marginTop: 10,
    borderRadius: 12,
  },
  urlText: {
    marginTop: 10,
    fontSize: 12,
    color: 'blue',
    textAlign: 'center',
  },
});
