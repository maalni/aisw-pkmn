import { Pressable, View, ViewProps } from "react-native";
import React, { PropsWithChildren } from "react";

type CardProps = ViewProps & {
  onPress?: () => void;
};

export function Card({
  onPress,
  style,
  children,
}: PropsWithChildren<CardProps>) {
  return (
    <Pressable onPress={onPress}>
      <View
        style={[
          {
            borderRadius: 16,
            display: "flex",
            overflow: "hidden",
          },
          style,
        ]}
      >
        {children}
      </View>
    </Pressable>
  );
}
