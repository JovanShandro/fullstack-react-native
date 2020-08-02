import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle
} from "react-native";

interface Props {
  title?: string;
  leftText?: string;
  onPressLeftText?(): void;
}

const NavigationBar = ({
  title = "",
  leftText = "",
  onPressLeftText = () => {}
}: Props) => (
  <View style={styles.container}>
    <TouchableOpacity style={styles.leftText} onPress={onPressLeftText}>
      <Text>{leftText}</Text>
    </TouchableOpacity>
    <Text style={styles.title}>{title}</Text>
  </View>
);

interface Style {
  container: ViewStyle;
  title: TextStyle;
  leftText: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    height: 40,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontWeight: "500"
  },
  leftText: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    justifyContent: "center"
  }
});

export default NavigationBar;
