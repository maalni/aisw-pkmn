import { ScrollView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
import { NavigationCard } from "@/components/NavigationCard";
import { router } from "expo-router";
import { PkmnCard } from "@/components/PkmnCard";
import { useScrollToTop } from "@react-navigation/native";
import { Collection, PkmntcgApiCardWithCount } from "@/types/PkmntcgApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused } from "@react-navigation/core";
import { CardModal } from "@/components/modals/CardModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";

export default function CollectionScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const ref = React.useRef(null);
  const isFocused = useIsFocused();
  const cardModal = useRef<BottomSheetModal>(null);

  const [selectedCard, setSelectedCard] = useState<
    PkmntcgApiCardWithCount | undefined
  >(undefined);

  useScrollToTop(ref);

  const [collection, setCollection] = useState<Collection>({});

  useEffect(() => {
    getCollection();
  }, [isFocused]);

  const getCollection = () => {
    try {
      AsyncStorage.getItem("collection").then((item) => {
        setCollection(item !== null ? JSON.parse(item) : {});
      });
    } catch (e) {
      console.log(e);
    }
  };

  const renderPkmnCard = (item: PkmntcgApiCardWithCount, index: number) => (
    <PkmnCard
      key={item.id + index}
      name={item.name}
      set={item.set.id}
      number={item.number}
      onPress={() => openCardView(item)}
    />
  );

  const openCardView = (card: PkmntcgApiCardWithCount) => {
    setSelectedCard(card);
    cardModal.current?.present();
  };

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
          <ThemedText type="title">Your Collection</ThemedText>
        </ThemedView>
        {Object.keys(collection).length > 0 ? (
          <ThemedView
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              gap: 20,
            }}
          >
            {Object.keys(collection).map((key, index) => {
              const item = collection[key];
              return renderPkmnCard(item, index);
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
      <CardModal
        ref={cardModal}
        pkmnCard={selectedCard}
        onDismiss={getCollection}
      />
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
