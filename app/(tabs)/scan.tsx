import {
  Alert,
  AppState,
  ScrollView,
  StyleSheet,
  TextInput,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useIsFocused } from "@react-navigation/core";
import { ThemedView } from "@/components/ThemedView";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { useScrollToTop } from "@react-navigation/native";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import {
  CameraMountError,
  CameraView,
  useCameraPermissions,
} from "expo-camera";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import {
  BackendDetectingResponseResult,
  BackendResponse,
} from "@/types/AiswPkmnBackend";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SearchResultList } from "@/components/modals/SearchResultList";
import { ThemedButton } from "@/components/ThemedButton";

export default function ScanScreen() {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const isFocused = useIsFocused();
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const scrollRef = useRef(null);
  const cameraRef = useRef<CameraView>(null);
  const searchResultListModal = useRef<BottomSheetModal>(null);

  useScrollToTop(scrollRef);

  const [cardResults, setCardResults] = useState<
    BackendDetectingResponseResult[]
  >([]);

  const [cardSet, setCardSet] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");

  const [isCameraReady, setIsCameraReady] = useState(false);

  const [isAppActive, setIsAppActive] = useState(
    AppState.currentState === "active",
  );

  const [isCameraActive, setIsCameraActive] = useState(
    isFocused && isAppActive,
  );

  const [isEmbedding, setIsEmbedding] = useState(false);
  const [serverAddress, setServerAddress] = useState("http://localhost");
  const [serverPort, setServerPort] = useState("8080");

  const [isWorking, setIsWorking] = useState(false);

  useEffect(() => {
    setIsCameraActive(isFocused && isAppActive);
  }, [isFocused, isAppActive]);

  useEffect(() => {
    try {
      AsyncStorage.getItem("settings").then((item) => {
        setIsEmbedding(item !== null ? JSON.parse(item).isEmbedding : false);
        setServerAddress(
          item !== null ? JSON.parse(item).serverAddress : "http://localhost",
        );
        setServerPort(item !== null ? JSON.parse(item).serverPort : "8080");
      });
    } catch (e) {
      console.log(e);
    }
  }, [isFocused]);

  useEffect(() => {
    if (!hasPermission) {
      requestCameraPermission();
    }

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      setIsAppActive(nextAppState === "active");
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const requestCameraPermission = async () => {
    const requestResult = await requestPermission();

    if (!requestResult) {
      console.log("User denied camera access");
    }
  };

  const handleError = (error: CameraMountError) => {
    console.log(error.message);
  };

  async function detectImage() {
    setIsWorking(true);

    if (!isCameraReady || cameraRef.current === null) {
      return;
    }

    const pic = await cameraRef.current.takePictureAsync({
      base64: true,
    });

    if (pic === undefined) {
      return;
    }

    const resizedPic = await manipulateAsync(
      pic.uri,
      [{ resize: { width: 512, height: 512 } }],
      { compress: 0.4, format: SaveFormat.JPEG, base64: true },
    );

    if (isEmbedding && (cardSet === "" || cardNumber === "")) {
      Alert.alert("Label empty");
      setIsWorking(false);
      return;
    }

    const payload = {
      data: resizedPic.base64,
      height: resizedPic.height,
      width: resizedPic.width,
      set: cardSet,
      number: cardNumber,
      stage: isEmbedding ? "EMBEDDING" : "DETECTING",
    };

    try {
      const url = `${serverAddress}:${serverPort}/api/image`;
      console.log("sending to: " + url);
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseJson = (await response.json()) as BackendResponse;

      if (responseJson.STATE === "SUCCESS") {
        if (responseJson.STAGE === "DETECTING") {
          if (responseJson.result.length > 0) {
            setCardResults(responseJson.result);
            searchResultListModal.current?.present();
            setIsWorking(false);
          } else {
            setIsWorking(false);
            Alert.alert("Card not found");
          }
        } else {
          Alert.alert("Embedding saved");
          setIsWorking(false);
        }
      } else {
        setIsWorking(false);
        Alert.alert("Error", responseJson.message);
      }
    } catch (e) {
      console.log("Failed", e);
      setIsWorking(false);
    }
  }

  return (
    <SafeAreaView
      style={[{ backgroundColor: backgroundColor }, StyleSheet.absoluteFill]}
    >
      <ScrollView
        ref={scrollRef}
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
          <ThemedText type="title">Scan new cards</ThemedText>
        </ThemedView>
        {hasPermission && (
          <ThemedView style={{ flex: 1, gap: 20 }}>
            <ThemedView
              style={{ flex: 1, borderRadius: 8, overflow: "hidden" }}
            >
              <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                active={isCameraActive}
                onCameraReady={() => setIsCameraReady(true)}
                onMountError={handleError}
                ratio={"4:3"}
              />
            </ThemedView>
            <ThemedButton
              onPress={detectImage}
              disabled={isWorking}
              icon={"camera"}
              text={"Take photo"}
              isLoading={isWorking}
            />
            {isEmbedding && (
              <>
                <TextInput
                  onChangeText={setCardSet}
                  style={{ color: textColor }}
                  placeholder={"Card set"}
                  placeholderTextColor={textColor}
                />
                <TextInput
                  onChangeText={setCardNumber}
                  style={{ color: textColor }}
                  placeholder={"Card number"}
                  placeholderTextColor={textColor}
                />
              </>
            )}
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
      <SearchResultList
        ref={searchResultListModal}
        results={cardResults}
        onDismiss={() => setCardResults([])}
      />
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
