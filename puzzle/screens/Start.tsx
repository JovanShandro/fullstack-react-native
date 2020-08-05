import React, { useState, useEffect } from "react";
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

const Start: React.FC<Props> = ({ size, onStartGame, onChangeSize }): any => {
  const [transitionState, setTransitionState] = useState(
    StartScreenStates.Launching
  );

  const [toggleOpacity] = useState(new Animated.Value(0));
  const [buttonOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    handleAsync();
  }, []);

  const handleAsync = async () => {
    await sleep(500);

    await configureTransition(() => {
      setTransitionState(StartScreenStates.WillTransitionIn);
    });

    Animated.timing(toggleOpacity, {
      toValue: 1,
      duration: 500,
      delay: 500,
      useNativeDriver: true
    }).start();

    Animated.timing(buttonOpacity, {
      toValue: 1,
      duration: 500,
      delay: 1000,
      useNativeDriver: true
    }).start();
  };

  const handlePressStart = async () => {
    await configureTransition(() => {
      setTransitionState(StartScreenStates.WillTransitionOut);
    });

    onStartGame();
  };

  const toggleStyle = { opacity: toggleOpacity };
  const buttonStyle = { opacity: buttonOpacity };

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
            <Button title={"Start Game"} onPress={handlePressStart} />
          </Animated.View>
        )}
      </View>
    )
  );
};

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

export default Start;
