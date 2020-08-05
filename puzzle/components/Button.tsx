import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  TouchableWithoutFeedback,
  ViewStyle,
  TextStyle
} from "react-native";

const getValue = (pressed: boolean, disabled: boolean) => {
  const base = disabled ? 0.5 : 1;
  const delta = disabled ? 0.1 : 0.3;

  return pressed ? base - delta : base;
};

interface Props {
  title: string;
  onPress(): void;
  disabled?: boolean;
  height?: number;
  color?: string;
  fontSize?: number;
  borderRadius?: number;
}

const Button: React.FC<Props> = ({
  onPress,
  disabled = false,
  height = null,
  color = "#0CE1C2",
  fontSize = 24,
  borderRadius = 100,
  title
}) => {
  const [pressed, setPressed] = useState(false);
  const value = useRef(new Animated.Value(getValue(false, disabled)));
  const prevPressed = useRef(pressed);
  const prevDisabled = useRef(disabled);

  useEffect(() => {
    if (prevDisabled.current !== disabled || prevPressed.current !== pressed) {
      Animated.timing(value.current, {
        duration: 200,
        toValue: getValue(pressed, disabled),
        easing: Easing.out(Easing.quad),
        useNativeDriver: false
      }).start();
    }

    prevDisabled.current = disabled;
    prevPressed.current = pressed;
  }, [disabled, pressed]);

  const handlePressIn = () => {
    setPressed(true);
  };

  const handlePressOut = () => {
    setPressed(false);
  };

  const animatedColor = value.current.interpolate({
    inputRange: [0, 1],
    outputRange: ["black", color]
  });

  const animatedScale = value.current.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1]
  });

  const containerStyle = {
    borderColor: animatedColor,
    borderRadius,
    height,
    transform: [{ scale: animatedScale }]
  };

  const titleStyle = {
    color: animatedColor,
    fontSize
  };

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.container, containerStyle]}>
        <Animated.Text style={[styles.title, titleStyle]}>
          {title}
        </Animated.Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

interface Style {
  container: ViewStyle;
  title: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F1E2A",
    borderWidth: 2
  },
  title: {
    backgroundColor: "transparent",
    fontSize: 24
  }
});

export default Button;
