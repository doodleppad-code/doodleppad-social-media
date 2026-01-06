import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Modal,
  PanResponder,
   Alert,
  
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from "react-native-reanimated";
import * as FileSystem from "expo-file-system";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
export default function DoodlePad({ navigation }) {
  /* ================= STATE ================= */
  const { user } = useAuth();
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [caption, setCaption] = useState("");
  const canvasRef = useRef(null);
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(5);

  const [showColors, setShowColors] = useState(false);
  const [showStrokeSlider, setShowStrokeSlider] = useState(false);
  const [uploading, setUploading] = useState(false);
  /* ================= CONSTANTS ================= */
  const COLORS = [
    "#000000",
    "#FF0000",
    "#00C853",
    "#2962FF",
    "#FF6D00",
    "#9C27B0",
    "#795548",
    "#FFFFFF",
  ];

  const SLIDER_WIDTH = 260;
  const MIN_STROKE = 1;
  const MAX_STROKE = 20;

  /* ================= SLIDER ================= */
  const [sliderX, setSliderX] = useState(
    (strokeWidth / MAX_STROKE) * SLIDER_WIDTH
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        let x = Math.max(0, Math.min(SLIDER_WIDTH, gesture.dx + sliderX));
        setSliderX(x);

        const value =
          MIN_STROKE +
          (x / SLIDER_WIDTH) * (MAX_STROKE - MIN_STROKE);

        setStrokeWidth(Math.round(value));
      },
    })
  ).current;

  /* ================= DRAWING ================= */
  const createPath = (x, y) => {
    const p = Skia.Path.Make();
    p.moveTo(x, y);
    setCurrentPath({ path: p, color, strokeWidth });
  };

  const updatePath = (x, y) => {
    if (!currentPath) return;
    currentPath.path.lineTo(x, y);
    setCurrentPath({ ...currentPath });
  };

  const endPath = () => {
    if (!currentPath) return;
    setPaths((prev) => [...prev, currentPath]);
    setCurrentPath(null);
  };

  const panGesture = Gesture.Pan()
    .onBegin((e) => runOnJS(createPath)(e.x, e.y))
    .onUpdate((e) => runOnJS(updatePath)(e.x, e.y))
    .onEnd(() => runOnJS(endPath)());

  /* ================= ACTIONS ================= */
  const undo = () => setPaths((prev) => prev.slice(0, -1));
  const clear = () => setPaths([]);
  
 /* ================= UPLOAD ================= */

  const uploadPost = async () => {
    if (paths.length === 0 && caption.trim() === "") {
      Alert.alert("Nothing to post", "Draw something or add a caption.");
      return;
    }

    try {
      setUploading(true);

      /* 1️⃣ Snapshot canvas */
      const image = canvasRef.current.makeImageSnapshot();
      const base64 = image.encodeToBase64();

      const fileUri = FileSystem.cacheDirectory + `doodle_${Date.now()}.png`;

      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });

      /* 2️⃣ Upload to Supabase */
      const fileName = `post/${Date.now()}_doodle.png`;
      const fileBase64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const binary = Uint8Array.from(atob(fileBase64), (c) =>
        c.charCodeAt(0)
      );

      const { error } = await supabase.storage
        .from("doodleppad")
        .upload(fileName, binary, {
          contentType: "image/png",
          upsert: true,
        });

      if (error) throw error;

      const { data: publicData } = supabase.storage
        .from("doodleppad")
        .getPublicUrl(fileName);

      const publicUrl = publicData.publicUrl;

      /* 3️⃣ Save to backend DB */
      const apiRes = await fetch(
        "https://mobserv-0din.onrender.com/api/posts/upload-post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userid: user?.userId || "anonymous",
            caption: caption.trim(),
            url: publicUrl,
            type: "doodle_post",
            
          }),
        }
      );

      if (!apiRes.ok) {
        throw new Error("Backend error");
      }

      Alert.alert("✅ Posted", "Your doodle has been shared!");
      setPaths([]);
      setCaption("");
      navigation.goBack();
    } catch (err) {
      console.error("Upload failed:", err);
      Alert.alert("❌ Upload failed", err.message);
    } finally {
      setUploading(false);
    }
  };



 






  /* ================= UI ================= */
  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doodle</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* TOOLBAR */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={undo}>
          <Ionicons name="arrow-undo-outline" size={22} />
        </TouchableOpacity>

        <TouchableOpacity onPress={clear}>
          <Ionicons name="trash-outline" size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowStrokeSlider((p) => !p)}
        >
          <Ionicons name="pencil-outline" size={22} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowColors(true)}>
          <Ionicons name="color-palette-outline" size={22} />
        </TouchableOpacity>
      </View>

      {/* STROKE SLIDER POPUP */}
 

      {/* CANVAS */}
      <View style={styles.canvasCard}>
        <GestureDetector gesture={panGesture}>
          <Canvas ref={canvasRef}  style={styles.canvas}>
            {paths.map((p, i) => (
              <Path
                key={i}
                path={p.path}
                color={p.color}
                style="stroke"
                strokeWidth={p.strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            ))}

            {currentPath && (
              <Path
                path={currentPath.path}
                color={currentPath.color}
                style="stroke"
                strokeWidth={currentPath.strokeWidth}
                strokeCap="round"
                strokeJoin="round"
              />
            )}
          </Canvas>
        </GestureDetector>
      </View>
           {showStrokeSlider && (
        <View style={styles.strokePopup}>
          <Text style={styles.sliderLabel}>
            Stroke Size: {strokeWidth}
          </Text>

          <View style={styles.sliderTrack}>
            <View
              style={[
                styles.sliderThumb,
                { transform: [{ translateX: sliderX }] },
              ]}
              {...panResponder.panHandlers}
            />
          </View>
        </View>
      )}

      {/* CAPTION */}
      <View style={styles.bottomBar}>
        <TextInput
          placeholder="Caption"
          placeholderTextColor="#999"
          style={styles.input}
          value={caption}
          onChangeText={setCaption}
        />
     <TouchableOpacity style={styles.sendButton} onPress={uploadPost}>
  <Ionicons name="send" size={20} color="#fff" />
</TouchableOpacity>

      </View>

      {/* COLOR PICKER */}
      <Modal transparent visible={showColors} animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setShowColors(false)}
          activeOpacity={1}
        >
          <View style={styles.colorModal}>
            <Text style={styles.modalTitle}>Choose Color</Text>

            <View style={styles.colorGrid}>
              {COLORS.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: c,
                      borderWidth: color === c ? 3 : 1,
                    },
                  ]}
                  onPress={() => {
                    setColor(c);
                    setShowColors(false);
                  }}
                />
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "center",
  },

  headerTitle: { fontSize: 20, fontWeight: "600" },

  toolbar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
  },

  canvasCard: {
    flex: 1,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#fff",
    elevation: 4,
    overflow: "hidden",
  },

  canvas: { flex: 1, backgroundColor: "#fff" },

  bottomBar: {
    flexDirection: "row",
    padding: 14,
    borderTopWidth: 1,
    borderColor: "#eee",
  },

  input: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 16,
  },

  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  /* Stroke Slider */
  strokePopup: {
    position: "absolute",
    bottom: 70,
    right: 12,
    width: 280,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    elevation: 5,
  },

  sliderLabel: { fontWeight: "600", marginBottom: 8 },

  sliderTrack: {
    height: 6,
    width: 260,
    backgroundColor: "#ddd",
    borderRadius: 3,
  },

  sliderThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#000",
    position: "absolute",
    top: -8,
  },

  /* Color Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  colorModal: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    width: "80%",
  },

  modalTitle: {
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 12,
  },

  colorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  colorCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    margin: 8,
    borderColor: "#333",
  },
});
