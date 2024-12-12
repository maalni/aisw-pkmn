import { ActivityIndicator, Pressable, PressableProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedText } from "@/components/ThemedText";
import React, { type ComponentProps } from "react";

export type ThemedButtonProps = PressableProps & {
  lightColor?: string;
  darkColor?: string;
  text: string;
  icon?: ComponentProps<typeof Ionicons>["name"];
  isLoading?: boolean;
};

export function ThemedButton({
  style,
  isLoading = false,
  icon,
  text,
  lightColor,
  darkColor,
  ...rest
}: ThemedButtonProps) {
  const tint = useThemeColor({ light: lightColor, dark: darkColor }, "tint");

  const newShade = (hexColor: string, magnitude: number) => {
    hexColor = hexColor.replace(`#`, ``);
    if (hexColor.length === 6) {
      const decimalColor = parseInt(hexColor, 16);
      let r = (decimalColor >> 16) + magnitude;
      r > 255 && (r = 255);
      r < 0 && (r = 0);
      let g = (decimalColor & 0x0000ff) + magnitude;
      g > 255 && (g = 255);
      g < 0 && (g = 0);
      let b = ((decimalColor >> 8) & 0x00ff) + magnitude;
      b > 255 && (b = 255);
      b < 0 && (b = 0);
      return `#${(g | (b << 8) | (r << 16)).toString(16)}`;
    } else {
      return hexColor;
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        {
          display: "flex",
          flexDirection: "row",
          gap: 10,
          justifyContent: "center",
          alignItems: "center",
          padding: 15,
          backgroundColor: tint,
          borderRadius: 8,
        },
        pressed ? { backgroundColor: newShade(tint, -25) } : {},
        rest.disabled || isLoading
          ? { backgroundColor: newShade(tint, 50) }
          : {},
      ]}
      {...rest}
    >
      {!isLoading && (
        <>
          {icon !== undefined && (
            <Ionicons name={icon} size={20} color={"white"} />
          )}
          <ThemedText type={"subtitle"} lightColor={"white"}>
            {text}
          </ThemedText>
        </>
      )}
      {isLoading && <ActivityIndicator color={"white"} size={25} />}
    </Pressable>
  );
}
