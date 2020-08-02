import { StyleSheet, ViewStyle, TextStyle, Text, View } from "react-native";
import React from "react";

interface Props {
  initials: string;
  size: number;
  backgroundColor: string;
}
export default function Avatar({ size, backgroundColor, initials }: Props) {
  const style = {
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{initials}</Text>
    </View>
  );
}

interface Style {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  text: {
    color: "white"
  }
});
