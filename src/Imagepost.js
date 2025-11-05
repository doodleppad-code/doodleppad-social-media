import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import React, {useState} from 'react';
import {View, Button, Image, ActivityIndicator, Alert} from 'react-native';
export default function ImagePost() {
  const [imageUri, setImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [downloadURL, setDownloadURL] = useState(null);

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (result.assets && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert('No image selected!');
      return;
    }

    const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
    const reference = storage().ref(`uploads/${filename}`);

    setUploading(true);

    const task = reference.putFile(imageUri);

    task.on('state_changed', (taskSnapshot) => {
      console.log(
        `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
      );
    });

    try {
      await task;
      const url = await reference.getDownloadURL();
      setDownloadURL(url);
      Alert.alert('✅ Upload Complete!', 'Image uploaded successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Upload failed', error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button title="Pick Image" onPress={pickImage} />
      {imageUri && (
        <Image
          source={{uri: imageUri}}
          style={{width: 200, height: 200, marginVertical: 10}}
        />
      )}
      {uploading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : (
        <Button title="Upload Image" onPress={uploadImage} />
      )}
      {downloadURL && (
        <View style={{marginTop: 20}}>
          <Image
            source={{uri: downloadURL}}
            style={{width: 200, height: 200}}
          />
        </View>
      )}
    </View>
  );
}
