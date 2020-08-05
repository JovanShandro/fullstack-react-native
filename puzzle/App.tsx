import React, { useState, useEffect } from "react";
import Constants from "expo-constants";
import { LinearGradient } from "expo-linear-gradient";
import {
  Image,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  UIManager,
  ViewStyle
} from "react-native";

import { createPuzzle } from "./utils/puzzle";
import { getRandomImage } from "./utils/api";
import Game from "./screens/Game";
import Start from "./screens/Start";
import { Puzzle, ImageType } from "./utils/types";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const BACKGROUND_COLORS = ["#1B1D34", "#2A2A38"];

interface State {
  size: number;
  puzzle: Puzzle | null;
  image: ImageType | null;
}

const App = () => {
  const [size, setSize] = useState(3);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [image, setImage] = useState<ImageType | null>(null);

  useEffect(() => {
    preloadNextImage();
  }, []);

  const preloadNextImage = async () => {
    const randImage = await getRandomImage();

    Image.prefetch(randImage.uri);
    setImage(randImage);
  };

  const handleChangeSize = (size: number) => {
    setSize(size);
  };

  const handleStartGame = () => {
    setPuzzle(createPuzzle(size));
  };

  const handleGameChange = (puzzle: Puzzle) => {
    setPuzzle(puzzle);
  };

  const handleQuit = () => {
    setPuzzle(null);
    setImage(null);

    preloadNextImage();
  };

  return (
    <LinearGradient style={styles.background} colors={BACKGROUND_COLORS}>
      <StatusBar barStyle={"light-content"} />
      <SafeAreaView style={styles.container}>
        {!puzzle && (
          <Start
            size={size}
            onStartGame={handleStartGame}
            onChangeSize={handleChangeSize}
          />
        )}
        {puzzle && (
          <Game
            puzzle={puzzle}
            image={image}
            onChange={handleGameChange}
            onQuit={handleQuit}
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

interface Style {
  background: ViewStyle;
  container: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  background: {
    flex: 1
  },
  container: {
    flex: 1,
    marginTop:
      Platform.OS === "android" || parseInt(Platform.Version as string, 10) < 11
        ? Constants.statusBarHeight
        : 0
  }
});

export default App;
