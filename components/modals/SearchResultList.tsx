import React, { forwardRef, useEffect, useRef, useState } from "react";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { PkmnCard } from "@/components/PkmnCard";
import { SearchResult } from "@/components/modals/SearchResult";
import { BackendDetectingResponseResult } from "@/types/AiswPkmnBackend";
import { ThemedText } from "@/components/ThemedText";

type SearchResultListProps = Omit<BottomSheetModalProps, "children"> & {
  results: BackendDetectingResponseResult[];
};

export const SearchResultList = forwardRef<
  BottomSheetModal,
  SearchResultListProps
>(({ results, ...props }, ref) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const searchResultModal = useRef<BottomSheetModal>(null);
  const [selectedCardId, setSelectedCardId] = useState("");

  useEffect(() => {
    if (results.length === 1) {
      openSearchResult(results[0].id);
    }
  }, [results]);

  const renderCard = (item: BackendDetectingResponseResult) => (
    <PkmnCard
      key={item.id}
      name={item.name}
      set={item.set}
      number={item.number}
      onPress={() => openSearchResult(item.id)}
    />
  );

  const openSearchResult = (id: string) => {
    setSelectedCardId(id);
    searchResultModal.current?.present();
  };

  const dismissSearchResult = () => {
    setSelectedCardId("");
  };

  return (
    <>
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
          <ThemedText type={"title"}>
            {results.length + ` Result${results.length !== 1 ? "s" : ""}:`}
          </ThemedText>
          <ThemedView
            style={{
              flex: 1,
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-evenly",
              gap: 20,
            }}
          >
            {results.map((item) => {
              return renderCard(item);
            })}
          </ThemedView>
        </BottomSheetScrollView>
      </BottomSheetModal>
      <SearchResult
        ref={searchResultModal}
        selectedCardId={selectedCardId}
        onDismiss={dismissSearchResult}
      />
    </>
  );
});
