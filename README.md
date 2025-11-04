# Doodleppad Social Media (DoodlePad)

A React Native app (Expo / dev-client) that includes a Skia-powered drawing screen (Doodlepad) along with basic navigation and chat scaffolding.

This repository contains a working prototype that demonstrates:

- A Skia-based freehand drawing canvas using `@shopify/react-native-skia`.
- Gesture handling via `react-native-gesture-handler` (wrapped at app root).
- Reanimated-friendly patterns (avoid mutating objects captured by worklets).
- Firebase (auth/firestore) wiring (via `@react-native-firebase/*`).

---

## Table of contents

- Project status
- Prerequisites
- Quick start (development)
- Running on device / emulator
- Rebuild native dev-client (important)
- File structure highlights
- Troubleshooting
- Contributing
- License

---

## Project status

Prototype / work-in-progress. The Doodlepad screen supports freehand drawing and basic undo/clear controls. Saving/export and stroke smoothing are TODOs.

---

## Prerequisites

- Node.js (16+ recommended)
- npm or yarn
- Expo CLI (optional): `npm install -g expo-cli`
- Android Studio (for Android emulator / builds) or Xcode for iOS
- If building native modules, follow the Expo dev-client workflow (see below)

Environment notes
- This project uses native modules (Skia and Reanimated). When you change native dependencies, you must rebuild the dev-client and re-install the app on device/emulator.

---

## Quick start (development)

1. Install dependencies

```powershell
cd path\to\project\doodleppad-social-media
npm install
```

2. Start Metro / Expo

```powershell
npm start
# or
expo start
```

3. Open on device

- Use the Expo Dev Tools QR code, or
- Run `npm run android` to build/run on an Android device (requires dev-client rebuild if native modules changed).

---

## Running on Android (dev-client with native modules)

Because this app uses native modules (`@shopify/react-native-skia`, `react-native-reanimated`), the recommended workflow is to use Expo Dev Client.

1. Build a dev client (only after native dependency changes)

```powershell
eas build --profile development --platform android
# then install the generated APK on your device or emulator
```

2. Start the local bundler

```powershell
npm start
```

3. Open the app using the dev client and scan the QR code in Expo Dev Tools.

Note: If you don't use EAS, you can still run a bare React Native workflow (`npx react-native run-android`) but you'll need a proper native build environment.

---

## File structure highlights

- `App.js` – root navigator. Wrapped with `GestureHandlerRootView` for gesture support.
- `src/Doodlepad.js` – Skia canvas screen. Key features:
  - JS-thread path construction from point arrays
  - GestureDetector (Pan) → runOnJS helpers (start/addPoint/finish)
  - Paths rendered as outline strokes using `style="stroke"` and `strokeWidth`
  - Debug overlay and programmatic test-stroke helper
- `src/` – other screens (Login, PhoneAuth, Otp, Dashboard, ChatList, ChatScreen, Details)
- `android/` and `ios/` – native projects (used for building dev client / release builds)

---

## Troubleshooting

- "Value is a string, expected a number" (native HostFunction error)
  - Common cause: passing non-primitive/native objects as React props to native components (e.g., passing a Paint object into a component prop). The code now uses primitive Path props (style, strokeWidth, color) to avoid this.
  - If the error persists, run the app and capture the full stack trace from Metro and/or Android `adb logcat` and paste it here.

- Reanimated / worklets warnings
  - Keep `react-native-reanimated/plugin` as the last plugin in `babel.config.js` and rebuild the app after changing `babel.config.js`.

- Android SDK / Gradle issues
  - Make sure `ANDROID_HOME` or `android/local.properties` is set to your SDK path.
  - For Gradle plugin incompatibilities in third-party libs, consider patching or upgrading those libs; edits in `node_modules` are temporary and will be lost after reinstall.

- PowerShell / npm execution policy problems (Windows)
  - If `npm` scripts fail due to execution policy, run PowerShell as Administrator and execute:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

---

## Contributing

Small PRs welcome. Work flow:

1. Fork & branch
2. Create a clear commit message (Conventional Commits style recommended)
3. Run and test on device/emulator (Skia/Reanimated require a native rebuild if changed)

Suggested commit message for recent changes in this repo:

```
feat(doodlepad): use stroke props for Skia Paths and avoid Paint object

Build Skia.Path on JS thread, remove paint prop, add debug overlay, and wrap app with GestureHandlerRootView.
```

---

## License

This project does not include a license file. Add one (for example, MIT) if you plan to open-source it.

---

If you want, I can also:
- Add a small runtime validator that scans the app's top-level styles for numeric values written as strings (helps catch native prop mismatches).
- Commit and push the README for you.
