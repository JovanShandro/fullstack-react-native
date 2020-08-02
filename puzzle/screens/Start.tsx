import React from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";

import Button from "../components/Button";
import Logo from "../components/Logo";
import Toggle from "../components/Toggle";
import configureTransition from "../utils/configureTransition";
import sleep from "../utils/sleep";

enum StartScreenStates {
  Launching,
  WillTransitionIn,
  WillTransitionOut
}

const BOARD_SIZES = [3, 4, 5, 6];

interface Props {
  onChangeSize(size: number): void;
  onStartGame(): void;
  size: number;
}

interface State {
  transitionState: StartScreenStates;
}

export default class Start extends React.Component<Props, State> {
  state: State = {
    transitionState: StartScreenStates.Launching
  };

  toggleOpacity = new Animated.Value(0);
  buttonOpacity = new Animated.Value(0);

  async componentDidMount() {
    await sleep(500);

    await configureTransition(() => {
      this.setState({ transitionState: StartScreenStates.WillTransitionIn });
    });

    Animated.timing(this.toggleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 500,
      useNativeDriver: true
    }).start();

    Animated.timing(this.buttonOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1000,
      useNativeDriver: true
    }).start();
  }

  handlePressStart = async () => {
    const { onStartGame } = this.props;

    await configureTransition(() => {
      this.setState({ transitionState: StartScreenStates.WillTransitionOut });
    });

    onStartGame();
  };

  render() {
    const { size, onChangeSize } = this.props;
    const { transitionState } = this.state;

    const toggleStyle = { opacity: this.toggleOpacity };
    const buttonStyle = { opacity: this.buttonOpacity };

    return (
      transitionState !== StartScreenStates.WillTransitionOut && (
        <View style={styles.container}>
          <View style={styles.logo}>
            <Logo />
          </View>
          {transitionState !== StartScreenStates.Launching && (
            <Animated.View style={toggleStyle}>
              <Toggle
                options={BOARD_SIZES}
                value={size}
                onChange={onChangeSize}
              />
            </Animated.View>
          )}
          {transitionState !== StartScreenStates.Launching && (
            <Animated.View style={buttonStyle}>
              <Button title={"Start Game"} onPress={this.handlePressStart} />
            </Animated.View>
          )}
        </View>
      )
    );
  }
}

interface Style {
  container: ViewStyle;
  logo: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20
  },
  logo: {
    alignSelf: "stretch",
    paddingHorizontal: 40
  }
});
