import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from "react-native";

type Props = {
  color: string;
  title: string;
  onPress(): void;
  small?: boolean;
};

const TimerButton: React.FC<Props> = ({
  color,
  title,
  onPress,
  small = false
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { borderColor: color }]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.buttonText,
          small ? styles.small : styles.large,
          { color }
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

interface Style {
  button: ViewStyle;
  buttonText: TextStyle;
  small: TextStyle;
  large: TextStyle;
}

const styles = StyleSheet.create<Style>({
  button: {
    marginTop: 10,
    minWidth: 100,
    borderWidth: 2,
    borderRadius: 3
  },
  small: {
    fontSize: 14,
    padding: 5
  },
  large: {
    fontSize: 16,
    padding: 10
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold"
  }
});

export default TimerButton;
