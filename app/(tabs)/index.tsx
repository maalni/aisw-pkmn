import { FlatList, ScrollView, StyleSheet } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { NavigationCard } from "@/components/NavigationCard";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { PkmnCard } from "@/components/PkmnCard";
import React, { useEffect, useState } from "react";
import { useScrollToTop } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Collection } from "@/types/PkmntcgApi";
import { useIsFocused } from "@react-navigation/core";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const ref = React.useRef(null);
  const isFocused = useIsFocused();

  useScrollToTop(ref);

  const [collection, setCollection] = useState<Collection>({});

  useEffect(() => {
    try {
      AsyncStorage.getItem("collection").then((item) => {
        setCollection(item !== null ? JSON.parse(item) : {});
      });
    } catch (e) {
      console.log(e);
    }
  }, [isFocused]);

  const navigateToScanner = () => {
    router.navigate("/scan");
  };

  const navigateToCollection = () => {
    router.navigate("/collection");
  };

  const renderCollectionPreview = ({ item }: { item: string }) => (
    <PkmnCard
      key={collection[item].id}
      name={collection[item].name}
      set={collection[item].set.id}
      number={collection[item].number}
    />
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
          <ThemedText type="title">
            Welcome{" "}
            <ThemedText
              type="title"
              style={{
                textDecorationLine: "underline",
              }}
            >
              user
            </ThemedText>
            !
          </ThemedText>
          <HelloWave />
        </ThemedView>

        <NavigationCard
          text={"Scan new cards"}
          icon={"camera"}
          onPress={navigateToScanner}
        />

        {Object.keys(collection).length > 0 ? (
          <ThemedView style={{ gap: 20 }}>
            <ThemedText type={"subtitle"}>Your collection:</ThemedText>
            <FlatList
              contentContainerStyle={{ display: "flex", gap: 20 }}
              data={Object.keys(collection).slice(0, 10)}
              renderItem={renderCollectionPreview}
              keyExtractor={(item, index) => collection[item].id + index}
              horizontal={true}
            />
            <NavigationCard
              text={"View your collection"}
              onPress={navigateToCollection}
            />
          </ThemedView>
        ) : (
          <ThemedView
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              gap: 20,
            }}
          >
            <Ionicons name={"alert-circle-outline"} size={50} color={"white"} />
            <ThemedText type={"subtitle"}>Your collection is empty</ThemedText>
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
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
});
