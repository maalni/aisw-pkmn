import { View, ViewProps } from "react-native";
import React, { type ComponentProps, PropsWithChildren } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Card } from "@/components/Card";
import { ThemedText } from "@/components/ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

type CardProps = ViewProps & {
  icon?: ComponentProps<typeof Ionicons>["name"];
  text: string;
  onPress: () => void;
};

export function NavigationCard({
  icon,
  text,
  style,
  onPress,
}: PropsWithChildren<CardProps>) {
  const tintColor = useThemeColor({}, "tint");

  return (
    <Card
      style={[
        {
          display: "flex",
          flexDirection: "column",
          backgroundColor: tintColor,
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 15,
        },
        style,
      ]}
      onPress={onPress}
    >
      {icon !== undefined && (
        <Ionicons name={icon} size={80} style={{ color: "white" }} />
      )}
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <ThemedText type={"subtitle"} lightColor={"white"}>
          {text}
        </ThemedText>

        <Ionicons
          name={"chevron-forward"}
          size={20}
          style={{ color: "white" }}
        />
      </View>
    </Card>
  );
}
