import React from "react";
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
  disabled: boolean;
  height: number;
  color: string;
  fontSize: number;
  borderRadius: number;
}

interface State {
  pressed: boolean;
}

export default class Button extends React.Component<Props, State> {
  static defaultProps = {
    onPress: () => {},
    disabled: false,
    height: null,
    color: "#0CE1C2",
    fontSize: 24,
    borderRadius: 100
  };

  value: Animated.Value;

  constructor(props: Props) {
    super(props);

    const { disabled } = props;

    this.state = { pressed: false };
    this.value = new Animated.Value(getValue(false, disabled));
  }

  updateValue(nextProps: Props, nextState: State) {
    if (
      this.props.disabled !== nextProps.disabled ||
      this.state.pressed !== nextState.pressed
    ) {
      Animated.timing(this.value, {
        duration: 200,
        toValue: getValue(nextState.pressed, nextProps.disabled),
        easing: Easing.out(Easing.quad),
        useNativeDriver: false
      }).start();
    }
  }

  UNSAFE_componentWillUpdate(nextProps: Props, nextState: State) {
    this.updateValue(nextProps, nextState);
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props, nextState: State) {
    this.updateValue(nextProps, nextState);
  }

  handlePressIn = () => {
    this.setState({ pressed: true });
  };

  handlePressOut = () => {
    this.setState({ pressed: false });
  };

  render() {
    const {
      props: { title, onPress, color, height, borderRadius, fontSize }
    } = this;

    const animatedColor = this.value.interpolate({
      inputRange: [0, 1],
      outputRange: ["black", color]
    });

    const animatedScale = this.value.interpolate({
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
        onPressIn={this.handlePressIn}
        onPressOut={this.handlePressOut}
      >
        <Animated.View style={[styles.container, containerStyle]}>
          <Animated.Text style={[styles.title, titleStyle]}>
            {title}
          </Animated.Text>
        </Animated.View>
      </TouchableWithoutFeedback>
    );
  }
}

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
