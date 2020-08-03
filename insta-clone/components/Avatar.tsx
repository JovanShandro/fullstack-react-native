import React from "react";
import { StyleSheet, ViewStyle, TextStyle, Text, View } from "react-native";

interface Props {
  initials: string;
  size: number;
  backgroundColor: string;
}
const Avatar: React.FC<Props> = ({ size, backgroundColor, initials }) => {
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
};

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

export default Avatar;
