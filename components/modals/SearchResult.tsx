import { ActivityIndicator, Image } from "react-native";
import React, { forwardRef, useEffect, useState } from "react";
import { ThemedText } from "@/components/ThemedText";
import { PkmntcgApiCardResult } from "@/types/PkmntcgApi";
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
  selectedCardId: string;
};

export const SearchResult = forwardRef<BottomSheetModal, SearchResultProps>(
  ({ selectedCardId, ...props }, ref) => {
    const backgroundColor = useThemeColor({}, "background");
    const textColor = useThemeColor({}, "text");
    const { dismissAll } = useBottomSheetModal();
    const [pkmnCard, setPkmnCard] = useState<PkmntcgApiCardResult | undefined>(
      undefined,
    );

    useEffect(() => {
      if (selectedCardId !== "") {
        fetchPkmnCardResultData();
      }
    }, [selectedCardId]);

    const fetchPkmnCardResultData = async () => {
      const pkmncardResponse = await fetch(
        `https://api.pokemontcg.io/v2/cards/${selectedCardId}`,
        {
          headers: {
            "X-Api-Key": process.env.EXPO_PUBLIC_PKMNTCG_API_KEY,
          },
        },
      );

      const pkmncardResponseJson = await pkmncardResponse.json();

      setPkmnCard(pkmncardResponseJson.data);
    };

    const addToCollection = async () => {
      try {
        if (pkmnCard === undefined) {
          return;
        }

        const item = await AsyncStorage.getItem("collection");
        const collection = item !== null ? JSON.parse(item) : {};

        if (collection[pkmnCard.id] === undefined) {
          collection[pkmnCard.id] = { count: 1, ...pkmnCard };
        } else {
          collection[pkmnCard.id].count = collection[pkmnCard.id].count + 1;
        }

        await AsyncStorage.setItem("collection", JSON.stringify(collection));
        dismissAll();
      } catch (e) {
        console.log(e);
      }
    };

    const handleDismiss = () => {
      setPkmnCard(undefined);
      props.onDismiss?.();
    };

    return (
      <BottomSheetModal
        ref={ref}
        {...props}
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
        onDismiss={handleDismiss}
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

              <ThemedButton
                onPress={addToCollection}
                text={"Add to collection"}
                icon={"add"}
              />
            </ThemedView>
          )}
        </BottomSheetScrollView>
      </BottomSheetModal>
    );
  },
);
