import { ActivityIndicator, Image } from "react-native";
import React, { forwardRef } from "react";
import { ThemedText } from "@/components/ThemedText";
import { PkmntcgApiCardWithCount } from "@/types/PkmntcgApi";
import { useThemeColor } from "@/hooks/useThemeColor";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { ThemedView } from "@/components/ThemedView";
import { ThemedButton } from "@/components/ThemedButton";

type SearchResultProps = Omit<BottomSheetModalProps, "children"> & {
  pkmnCard?: PkmntcgApiCardWithCount;
};

export const CardModal = forwardRef<BottomSheetModal, SearchResultProps>(
  ({ pkmnCard, ...props }, ref) => {
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const { dismissAll } = useBottomSheetModal();

    const removeFromCollection = async () => {
      try {
        if (pkmnCard === undefined) {
          return;
        }

        const item = await AsyncStorage.getItem("collection");
        const collection = item !== null ? JSON.parse(item) : {};

        if (collection[pkmnCard.id] !== undefined) {
          const newCount = collection[pkmnCard.id].count - 1;

          if (newCount > 0) {
            collection[pkmnCard.id].count = newCount;
          } else {
            delete collection[pkmnCard.id];
          }
        }

        await AsyncStorage.setItem("collection", JSON.stringify(collection));
        dismissAll();
      } catch (e) {
        console.log(e);
      }
    };

    return (
      <BottomSheetModal
        ref={ref}
        style={{ backgroundColor: backgroundColor }}
        handleIndicatorStyle={{ backgroundColor: textColor }}
        backgroundStyle={{ backgroundColor: backgroundColor }}
        enableDismissOnClose={true}
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...{
              appearsOnIndex: 0,
              disappearsOnIndex: -1,
              ...props,
            }}
          />
        )}
        {...props}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            padding: 20,
            paddingTop: 50,
            gap: 40,
          }}
        >
          {pkmnCard === undefined && <ActivityIndicator />}
          {pkmnCard !== undefined && (
            <ThemedView
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 20,
              }}
            >
              <ThemedView>
                <ThemedText type={"title"}>{pkmnCard.name}</ThemedText>
                <ThemedText type={"subtitle"}>
                  {"#" + pkmnCard.number}
                </ThemedText>
              </ThemedView>
              <Image
                source={{
                  uri: pkmnCard.images.large,
                }}
                style={{ height: null, width: null, aspectRatio: 640 / 892 }}
              />

              <ThemedView>
                <ThemedText type={"subtitle"}>{pkmnCard.count}</ThemedText>
              </ThemedView>

              <ThemedButton
                icon={"trash"}
                onPress={removeFromCollection}
                text={"Remove from collection"}
                lightColor={"#ff0000"}
                darkColor={"#ff0000"}
              />
            </ThemedView>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);
