import { ImageBackground, View, ViewProps } from "react-native";
import React, { PropsWithChildren } from "react";
import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";

type CardProps = ViewProps & {
  name: string;
  set: string;
  number: string;
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
        {
          width: 150,
          aspectRatio: 640 / 892,
          backgroundColor: "blue",
        },
        style,
      ]}
    >
      <ImageBackground
        style={{ flex: 1 }}
        imageStyle={{ height: null, width: null, aspectRatio: 640 / 892 }}
        source={{
          uri: "https://images.pokemontcg.io/" + set + "/" + number + ".png",
        }}
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
          <ThemedText type={"defaultSemiBold"} lightColor={"#FFFFFF"}>
            {name}
          </ThemedText>
          <ThemedText type={"default"} lightColor={"#FFFFFF"}>
            {number}
          </ThemedText>
        </View>
      </ImageBackground>
    </Card>
  );
}
