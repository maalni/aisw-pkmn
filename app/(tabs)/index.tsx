import { FlatList, ScrollView, StyleSheet } from "react-native";
import { HelloWave } from "@/components/HelloWave";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { NavigationCard } from "@/components/NavigationCard";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { PkmnCard } from "@/components/PkmnCard";
import React from "react";
import { useScrollToTop } from "@react-navigation/native";

interface pkmncard {
  id: string;
  name: string;
  set: string;
  number: number;
}

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const ref = React.useRef(null);

  useScrollToTop(ref);

  const navigateToScanner = () => {
    router.navigate("/scan");
  };

  const navigateToCollection = () => {
    router.navigate("/collection");
  };

  const renderCollectionPreview = ({ item }: { item: pkmncard }) => (
    <PkmnCard
      key={item.id}
      name={item.name}
      set={item.set}
      number={item.number}
    />
  );

  const testCardData: pkmncard[] = [
    { id: "1", name: "a", set: "xy1", number: 1 },
    { id: "2", name: "b", set: "xy1", number: 2 },
    { id: "3", name: "c", set: "xy1", number: 3 },
    { id: "4", name: "d", set: "xy1", number: 4 },
    { id: "5", name: "e", set: "xy1", number: 5 },
    { id: "6", name: "f", set: "xy1", number: 6 },
    { id: "7", name: "g", set: "xy1", number: 7 },
    { id: "8", name: "h", set: "xy1", number: 8 },
  ];

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

        <ThemedView style={{ gap: 20 }}>
          <ThemedText type={"subtitle"}>Your collection:</ThemedText>
          <FlatList
            contentContainerStyle={{ display: "flex", gap: 20 }}
            data={testCardData}
            renderItem={renderCollectionPreview}
            keyExtractor={(item) => item.id}
            horizontal={true}
          />
          <NavigationCard
            text={"View your collection"}
            onPress={navigateToCollection}
          />
        </ThemedView>
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
