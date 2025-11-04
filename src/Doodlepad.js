import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Canvas, Path, PaintStyle, Skia } from "@shopify/react-native-skia";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { runOnJS } from 'react-native-reanimated';

export default function DoodlePad() {
  const [paths, setPaths] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(5);

  const COLORS = ["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFA500", "#800080"];
  const STROKES = [3, 6, 10, 15];

  // store paths-in-progress in a Map to avoid mutating a ref object that
  // may have been captured by reanimated worklets (which causes warnings)
  const pathStoreRef = useRef(new Map());
  const [currentPathId, setCurrentPathId] = useState(null);
  const lastUpdateRef = useRef(0);
  const [debugTouch, setDebugTouch] = useState({ x: null, y: null });
  // Build a Skia.Path from a simple array of points on the JS thread
  const buildSkiaPathFromPoints = (points) => {
    const p = Skia.Path.Make();
    if (!points || points.length === 0) return p;
    p.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      p.lineTo(points[i][0], points[i][1]);
    }
    return p;
  }

  // create a reusable stroke paint
  // Note: we rely on Path props (style, strokeWidth, strokeJoin, strokeCap)
  // for stroke rendering instead of passing a Paint object as a prop.

  const startPath = (x, y, c, sw) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2,8)}`;
    const cp = { points: [[x, y]], color: c, strokeWidth: sw };
    pathStoreRef.current.set(id, cp);
    setCurrentPathId(id);
    setCurrentPath({ path: buildSkiaPathFromPoints(cp.points), color: c, strokeWidth: sw });
  }

  const addPointToCurrentPath = (x, y) => {
    const id = currentPathId;
    if (!id) return;
    const cp = pathStoreRef.current.get(id);
    if (!cp) return;
    const newCp = { points: [...cp.points, [x, y]], color: cp.color, strokeWidth: cp.strokeWidth };
    pathStoreRef.current.set(id, newCp);
    setCurrentPath({ path: buildSkiaPathFromPoints(newCp.points), color: newCp.color, strokeWidth: newCp.strokeWidth });
  }

  const finishCurrentPath = () => {
    const id = currentPathId;
    if (!id) return;
    const cp = pathStoreRef.current.get(id);
    if (!cp) return;
    const path = buildSkiaPathFromPoints(cp.points);
    setPaths(prev => [...prev, { path, color: cp.color, strokeWidth: cp.strokeWidth }]);
    // debug log: number of points and a small sample
    try {
      const count = cp.points.length;
      const sample = cp.points.slice(0, Math.min(5, count)).concat(count > 5 ? ['...'] : []);
      console.log('Finished path id=', id, 'points=', count, 'sample=', sample);
    } catch (e) {
      console.log('Finished path (log error)', e);
    }
    setCurrentPath(null);
    pathStoreRef.current.delete(id);
    setCurrentPathId(null);
  }

  const panGesture = Gesture.Pan()
    .onBegin(e => {
      // delegate creation to JS thread
      runOnJS(startPath)(e.x, e.y, color, strokeWidth);
      runOnJS(setDebugTouch)({ x: Math.round(e.x), y: Math.round(e.y) });
    })
    .onUpdate(e => {
      const now = Date.now();
      if (now - lastUpdateRef.current > 30) {
        lastUpdateRef.current = now;
        runOnJS(addPointToCurrentPath)(e.x, e.y);
        runOnJS(setDebugTouch)({ x: Math.round(e.x), y: Math.round(e.y) });
      }
    })
    .onEnd(() => {
      runOnJS(finishCurrentPath)();
    });

  const onClear = () => setPaths([]);
  const onUndo = () => setPaths(prev => prev.slice(0, -1));
  const onSave = async () => Alert.alert("Info", "Use Skia snapshot and save to file system");

  // Debug helper: programmatically add a test stroke to verify rendering
  const addTestStroke = () => {
    const p = Skia.Path.Make();
    p.moveTo(50, 50);
    p.lineTo(120, 80);
    p.lineTo(100, 140);
    p.lineTo(60, 120);
    setPaths(prev => [...prev, { path: p, color: '#FF00FF', strokeWidth: 8 }]);
    console.log('Added test stroke');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>🎨 Doodle Pad</Text>

      <View style={{ flex: 1 }}>
        <GestureDetector gesture={panGesture}>
          <View style={{ flex: 1 }}>
            <Canvas style={styles.canvas}>
          {paths.map((p, i) => (
            <Path
              key={i}
              path={p.path}
              color={p.color}
              // use stroke-only rendering via props instead of passing a Paint object
              style="stroke"
              strokeWidth={p.strokeWidth}
              strokeJoin="round"
              strokeCap="round"
            />
          ))}
          {currentPath && (
            <Path
              path={currentPath.path}
              color={currentPath.color}
              style="stroke"
              strokeWidth={currentPath.strokeWidth}
              strokeJoin="round"
              strokeCap="round"
            />
          )}
            </Canvas>
          </View>
        </GestureDetector>
      </View>

      {/* Debug overlay to show last touch coordinates (remove in production) */}
      <View style={styles.debugOverlay} pointerEvents="none">
        <Text style={styles.debugText}>x: {debugTouch.x ?? '-'} y: {debugTouch.y ?? '-'}</Text>
      </View>

      {/* Color palette */}
      <ScrollView horizontal style={styles.palette}>
        {COLORS.map(c => (
          <TouchableOpacity
            key={c}
            style={[styles.colorButton, { backgroundColor: c, borderWidth: color === c ? 2 : 0 }]}
            onPress={() => setColor(c)}
          />
        ))}
      </ScrollView>

      {/* Stroke selector */}
      <ScrollView horizontal style={styles.palette}>
        {STROKES.map(s => (
          <TouchableOpacity
            key={s}
            style={[styles.strokeButton, { borderWidth: strokeWidth === s ? 2 : 0 }]}
            onPress={() => setStrokeWidth(s)}
          >
            <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: "black" }} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.button} onPress={onUndo}>
          <Text style={styles.buttonText}>Undo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onClear}>
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={onSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#8A2BE2' }]} onPress={addTestStroke}>
          <Text style={styles.buttonText}>Add Test Stroke</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f4f4" },
  headerText: { fontSize: 22, textAlign: "center", margin: 10, fontWeight: "bold" },
  canvas: { flex: 1, margin: 10, borderWidth: 1, borderColor: "#ddd", backgroundColor: "white" },
  palette: { flexDirection: "row", padding: 5, backgroundColor: "#fff" },
  colorButton: { width: 35, height: 35, borderRadius: 18, marginHorizontal: 5, borderColor: "#333" },
  strokeButton: { width: 40, height: 40, marginHorizontal: 5, borderRadius: 20, borderColor: "#333", justifyContent: "center", alignItems: "center", backgroundColor: "#ddd" },
  controls: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 10, backgroundColor: "#eee" },
  button: { padding: 10, backgroundColor: "#39579A", borderRadius: 8, minWidth: 70, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "600" },
  debugOverlay: { position: 'absolute', top: 50, right: 10, backgroundColor: 'rgba(0,0,0,0.6)', padding: 6, borderRadius: 6 },
  debugText: { color: 'white', fontSize: 12 },
});
