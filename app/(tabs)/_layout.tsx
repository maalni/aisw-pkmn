import { Tabs } from "expo-router";
import React, { type ComponentProps } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, View } from "react-native";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { LabelPosition } from "@react-navigation/bottom-tabs/src/types";
import { ThemedText } from "@/components/ThemedText";

export default function TabLayout() {
  const textColor = useThemeColor({}, "text");
  const tabIconSelectedColor = useThemeColor({}, "tabIconSelected");
  const backgroundColor = useThemeColor({}, "background");

  const renderButton = (props: BottomTabBarButtonProps) => {
    return (
      <Pressable
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          gap: 4,
          paddingTop: 16,
          paddingBottom: 16,
          justifyContent: "center",
          alignItems: "center",
        }}
        onPress={props.onPress}
      >
        {props.children}
      </Pressable>
    );
  };

  const renderTabBarIcon = (
    props: {
      focused: boolean;
      color: string;
      size: number;
    },
    icon: ComponentProps<typeof Ionicons>["name"],
  ) => {
    return (
      <View
        style={{
          display: "flex",
          backgroundColor: props.focused ? tabIconSelectedColor : "transparent",
          height: 32,
          width: 64,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 16,
        }}
      >
        <Ionicons
          name={icon}
          color={props.focused ? "white" : textColor}
          size={24}
        />
      </View>
    );
  };

  const renderLabel = (props: {
    focused: boolean;
    color: string;
    position: LabelPosition;
    children: string;
  }) => {
    return (
      <ThemedText type={"default"} style={{ fontSize: 12 }}>
        {props.children}
      </ThemedText>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: 80,
        },
        tabBarButton: renderButton,
        tabBarLabel: renderLabel,
        tabBarActiveBackgroundColor: backgroundColor,
        tabBarInactiveBackgroundColor: backgroundColor,
        tabBarActiveTintColor: textColor,
        tabBarInactiveTintColor: textColor,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="collection"
        options={{
          title: "Collection",
          tabBarIcon: (props) => renderTabBarIcon(props, "albums"),
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: (props) => renderTabBarIcon(props, "home"),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: "Scan",
          tabBarIcon: (props) => renderTabBarIcon(props, "camera"),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: (props) => renderTabBarIcon(props, "settings"),
        }}
      />
    </Tabs>
  );
}
