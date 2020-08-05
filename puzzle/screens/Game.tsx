import React, { useState, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";

import { move, movableSquares, isSolved } from "../utils/puzzle";
import Board from "../components/Board";
import Button from "../components/Button";
import Preview from "../components/Preview";
import Stats from "../components/Stats";
import configureTransition from "../utils/configureTransition";
import { Puzzle, ImageType } from "../utils/types";
import { useComponentWillMount } from "../utils/useComponentWillMount";

enum GameScreenState {
  LoadingImage,
  WillTransitionIn,
  RequestTransitionOut,
  WillTransitionOut
}

interface Props {
  puzzle: Puzzle;
  onChange(puzzle: Puzzle): void;
  onQuit(): void;
  image: ImageType | null;
}

const Game: React.FC<Props> = ({
  image = null,
  onQuit,
  puzzle,
  puzzle: { size },
  onChange
}): any => {
  const [transitionState, setTransitionState] = useState<GameScreenState>(
    image ? GameScreenState.WillTransitionIn : GameScreenState.LoadingImage
  );
  const [moves, setMoves] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [previousMove, setPreviousMove] = useState<number | null>(null);

  useComponentWillMount(configureTransition);

  useEffect(() => {
    if (image && transitionState === GameScreenState.LoadingImage) {
      configureTransition(() => {
        setTransitionState(GameScreenState.WillTransitionIn);
      });
    }
  }, [image]);

  const intervalId = useRef(-1);

  const handleBoardTransitionIn = () => {
    intervalId.current = setInterval(() => {
      setElapsed(elapsed => elapsed + 1);
    }, 1000);
  };

  const handleBoardTransitionOut = async () => {
    await configureTransition(() => {
      setTransitionState(GameScreenState.WillTransitionOut);
    });

    onQuit();
  };

  const requestTransitionOut = () => {
    clearInterval(intervalId.current);
    setTransitionState(GameScreenState.RequestTransitionOut);
  };

  const handlePressQuit = () => {
    Alert.alert(
      "Quit",
      "Do you want to quit and lose progress on this puzzle?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Quit",
          style: "destructive",
          onPress: requestTransitionOut
        }
      ]
    );
  };

  const handlePressSquare = (square: number) => {
    if (!movableSquares(puzzle).includes(square)) return;

    const updated = move(puzzle, square);

    setMoves(moves => moves + 1);
    setPreviousMove(square);

    onChange(updated);

    if (isSolved(updated)) {
      requestTransitionOut();
    }
  };

  return (
    transitionState !== GameScreenState.WillTransitionOut && (
      <View style={styles.container}>
        {transitionState === GameScreenState.LoadingImage && (
          <ActivityIndicator size={"large"} color={"rgba(255,255,255,0.5)"} />
        )}
        {transitionState !== GameScreenState.LoadingImage && (
          <View style={styles.centered}>
            <View style={styles.header}>
              <Preview image={image} boardSize={size} />
              <Stats moves={moves} time={elapsed} />
            </View>
            <Board
              puzzle={puzzle}
              image={image}
              previousMove={previousMove}
              teardown={
                transitionState === GameScreenState.RequestTransitionOut
              }
              onMoveSquare={handlePressSquare}
              onTransitionOut={handleBoardTransitionOut}
              onTransitionIn={handleBoardTransitionIn}
            />
            <Button title={"Quit"} onPress={handlePressQuit} />
          </View>
        )}
      </View>
    )
  );
};

interface Style {
  container: ViewStyle;
  centered: ViewStyle;
  header: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  centered: {
    flex: 1,
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 16,
    alignSelf: "stretch"
  }
});

export default Game;
