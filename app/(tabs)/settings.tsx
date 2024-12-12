import { ScrollView, StyleSheet, Switch, TextInput } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import { useScrollToTop } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedButton } from "@/components/ThemedButton";

export default function SettingsScreen() {
  const textColor = useThemeColor({}, "text");
  const tintColor = useThemeColor({}, "tint");
  const backgroundColor = useThemeColor({}, "background");
  const ref = React.useRef(null);
  const isFocused = useIsFocused();

  useScrollToTop(ref);

  const [isEmbedding, setIsEmbedding] = useState(false);
  const [serverAddress, setServerAddress] = useState("http://localhost");
  const [serverPort, setServerPort] = useState("8080");

  const updateIsEmbedding = (value: boolean) => {
    try {
      AsyncStorage.setItem(
        "settings",
        JSON.stringify({
          isEmbedding: value,
          serverAddress: serverAddress,
          serverPort: serverPort,
        }),
      ).then(() => {
        setIsEmbedding(value);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const updateServerAddress = (value: string) => {
    try {
      AsyncStorage.setItem(
        "settings",
        JSON.stringify({
          isEmbedding: isEmbedding,
          serverAddress: value,
          serverPort: serverPort,
        }),
      ).then(() => {
        setServerAddress(value);
      });
    } catch (e) {
      console.log(e);
    }
  };

  const updateServerPort = (value: string) => {
    try {
      AsyncStorage.setItem(
        "settings",
        JSON.stringify({
          isEmbedding: isEmbedding,
          serverAddress: serverAddress,
          serverPort: value,
        }),
      ).then(() => {
        setServerPort(value);
      });
    } catch (e) {
      console.log(e);
    }
  };

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

  const clearCollection = async () => {
    try {
      await AsyncStorage.removeItem("collection");
    } catch (e) {
      console.log(e);
    }
  };

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
          <ThemedText type="title">Settings</ThemedText>
        </ThemedView>
        <ThemedView style={{ display: "flex", flexDirection: "row" }}>
          <Switch
            onValueChange={updateIsEmbedding}
            value={isEmbedding}
            trackColor={{ true: tintColor }}
          />
          <ThemedText>Save embeddings</ThemedText>
        </ThemedView>
        <ThemedView style={{ display: "flex", flexDirection: "row" }}>
          <TextInput
            onChangeText={updateServerAddress}
            value={serverAddress}
            placeholder={"Server address"}
            style={{ color: textColor }}
            placeholderTextColor={textColor}
          />
          <TextInput
            onChangeText={updateServerPort}
            value={serverPort}
            placeholder={"Port"}
            keyboardType={"numeric"}
            style={{ color: textColor }}
            placeholderTextColor={textColor}
          />
        </ThemedView>
        <ThemedButton
          icon={"trash"}
          text={"Delete Collection"}
          onPress={clearCollection}
          lightColor={"#ff0000"}
          darkColor={"#ff0000"}
        />
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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
