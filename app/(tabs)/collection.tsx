import { ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationCard } from "@/components/NavigationCard";
import { router } from "expo-router";
import { PkmnCard } from "@/components/PkmnCard";
import { useScrollToTop } from "@react-navigation/native";

interface pkmncard {
  id: string;
  name: string;
  set: string;
  number: number;
}

export default function CollectionScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const ref = React.useRef(null);

  useScrollToTop(ref);

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

  const renderPkmnCard = (item: pkmncard) => (
    <PkmnCard
      key={item.id}
      name={item.name}
      set={item.set}
      number={item.number}
    />
  );

  const navigateToScanner = () => {
    router.navigate("/scan");
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
          <Ionicons name={"albums"} size={32} color={textColor} />
          <ThemedText type="title">Your Collection</ThemedText>
        </ThemedView>
        {testCardData.length > 0 ? (
          <ThemedView
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 20,
            }}
          >
            {testCardData.map((item) => {
              return renderPkmnCard(item);
            })}
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
            <Ionicons
              name={"alert-circle-outline"}
              size={50}
              color={textColor}
            />
            <ThemedText type={"subtitle"}>Your collection is empty</ThemedText>
            <NavigationCard
              text={"Scan new cards"}
              onPress={navigateToScanner}
            />
          </ThemedView>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
