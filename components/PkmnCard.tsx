import { ImageBackground, View, ViewProps } from "react-native";
import React, { PropsWithChildren } from "react";
import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";

type CardProps = ViewProps & {
  name: string;
  set: string;
  number: number;
  onPress?: () => void;
};

export function PkmnCard({
  name,
  set,
  number,
  onPress,
  style,
}: PropsWithChildren<CardProps>) {
  return (
    <Card
      onPress={onPress}
      style={[
        { flex: 1, width: 150, height: 210, backgroundColor: "blue" },
        style,
      ]}
    >
      <ImageBackground
        style={{ flex: 1 }}
        source={{
          uri: "https://images.pokemontcg.io/" + set + "/" + number + ".png",
        }}
        resizeMode={"cover"}
      >
        <View
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
            flex: 1,
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: 8,
          }}
        >
          <ThemedText type={"defaultSemiBold"}>{name}</ThemedText>
          <ThemedText type={"default"}>{set + number}</ThemedText>
        </View>
      </ImageBackground>
    </Card>
  );
}
