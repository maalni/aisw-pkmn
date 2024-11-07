import { AppState, ScrollView, StyleSheet } from "react-native";
import {
  Camera,
  CameraRuntimeError,
  runAsync,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from "react-native-vision-camera";
import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/core";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScrollToTop } from "@react-navigation/native";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { Skia } from "@shopify/react-native-skia";
import * as ort from "onnxruntime-react-native";
import { detectCard } from "@/frameProcessors/cardDetection";

export default function ScanScreen() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const camera = useCameraDevice("back");
  const isFocused = useIsFocused();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const ref = React.useRef(null);
  const [inferenceSession, setInferenceSession] = useState<
    ort.InferenceSession | undefined
  >(undefined);
  const { resize } = useResizePlugin();

  useScrollToTop(ref);

  const [isAppActive, setIsAppActive] = useState(
    AppState.currentState === "active",
  );
  const [isCameraActive, setIsCameraActive] = useState(
    isFocused && isAppActive,
  );

  useEffect(() => {
    if (!hasPermission) {
      requestCameraPermission();
    }

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setIsAppActive(nextAppState === "active");
    });

    //loadModel();

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    setIsCameraActive(isFocused && isAppActive);
  }, [isFocused, isAppActive]);

  /*const loadModel = async () => {
    try {
      const assets = await Asset.loadAsync(
        require("../../assets/models/pkmn.onnx"),
      );
      const modelUri = assets[0].localUri;
      if (!modelUri) {
        Alert.alert("failed to get model URI", `${assets[0]}`);
      } else {
        const model = await ort.InferenceSession.create(modelUri, {});
        setInferenceSession(model);
      }
    } catch (e) {
      Alert.alert("failed to load model", `${e}`);
      throw e;
    }
  };*/

  const requestCameraPermission = async () => {
    const requestResult = await requestPermission();

    if (!requestResult) {
      console.log("User denied camera access");
    }
  };

  const handleError = (error: CameraRuntimeError) => {
    console.log(error.code);
  };

  const paint = Skia.Paint();
  paint.setColor(Skia.Color("red"));

  const frameProcessor = useFrameProcessor(
    (frame) => {
      "worklet";

      runAsync(frame, () => {
        /*if (inferenceSession === undefined) {
        return;
      }*/

        "worklet";

        console.log(detectCard(frame));
      });
    },
    [inferenceSession],
  );

  return (
    <SafeAreaView
      style={[{ backgroundColor: backgroundColor }, StyleSheet.absoluteFill]}
    >
      <ScrollView
        ref={ref}
        contentContainerStyle={[
          {
            padding: 20,
            paddingTop: 50,
            gap: 40,
            minHeight: "100%",
          },
        ]}
      >
        <ThemedView style={styles.titleContainer}>
          <Ionicons name={"camera"} size={32} color={textColor} />
          <ThemedText type="title">Scan new cards</ThemedText>
        </ThemedView>
        {hasPermission && camera !== undefined && (
          <ThemedView style={{ flex: 1, borderRadius: 16, overflow: "hidden" }}>
            <Camera
              style={{ flex: 1 }}
              device={camera}
              isActive={isCameraActive}
              onError={handleError}
              frameProcessor={frameProcessor}
            />
          </ThemedView>
        )}
        {camera === undefined && (
          <ThemedView
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Ionicons
              name={"alert-circle-outline"}
              size={50}
              color={textColor}
            />
            <ThemedText type={"subtitle"}>
              Your device does not support card scanning
            </ThemedText>
          </ThemedView>
        )}
        {!hasPermission && (
          <ThemedView
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Ionicons
              name={"alert-circle-outline"}
              size={50}
              color={textColor}
            />
            <ThemedText type={"subtitle"}>
              You need to give permission
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
