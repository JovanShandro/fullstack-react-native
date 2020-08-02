import React from "react";
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

enum GameScreenState {
  LoadingImage,
  WillTransitionIn,
  RequestTransitionOut,
  WillTransitionOut
}

type Props = {
  puzzle: Puzzle;
  onChange(puzzle: Puzzle): void;
  onQuit(): void;
} & DefaultProps;

type DefaultProps = {
  image: ImageType | null;
};
interface State {
  transitionState: GameScreenState;
  moves: number;
  elapsed: number;
  previousMove: number | null;
  image: ImageType | null;
}

export default class Game extends React.Component<Props, State> {
  static defaultProps: DefaultProps = {
    image: null
  };

  constructor(props: Props) {
    super(props);

    const { image } = props;

    this.state = {
      transitionState: image
        ? GameScreenState.WillTransitionIn
        : GameScreenState.LoadingImage,
      moves: 0,
      elapsed: 0,
      previousMove: null,
      image: null
    };

    configureTransition();
  }

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { image } = nextProps;
    const { transitionState } = this.state;

    if (image && transitionState === GameScreenState.LoadingImage) {
      configureTransition(() => {
        this.setState({ transitionState: GameScreenState.WillTransitionIn });
      });
    }
  }

  intervalId: number = -1;

  handleBoardTransitionIn = () => {
    this.intervalId = setInterval(() => {
      const { elapsed } = this.state;

      this.setState({ elapsed: elapsed + 1 });
    }, 1000);
  };

  handleBoardTransitionOut = async () => {
    const { onQuit } = this.props;

    await configureTransition(() => {
      this.setState({ transitionState: GameScreenState.WillTransitionOut });
    });

    onQuit();
  };

  requestTransitionOut = () => {
    clearInterval(this.intervalId);

    this.setState({ transitionState: GameScreenState.RequestTransitionOut });
  };

  handlePressQuit = () => {
    Alert.alert(
      "Quit",
      "Do you want to quit and lose progress on this puzzle?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Quit",
          style: "destructive",
          onPress: this.requestTransitionOut
        }
      ]
    );
  };

  handlePressSquare = (square: number) => {
    const { puzzle, onChange } = this.props;
    const { moves } = this.state;

    if (!movableSquares(puzzle).includes(square)) return;

    const updated = move(puzzle, square);

    this.setState({ moves: moves + 1, previousMove: square });

    onChange(updated);

    if (isSolved(updated)) {
      this.requestTransitionOut();
    }
  };

  render() {
    const {
      puzzle,
      puzzle: { size },
      image
    } = this.props;
    const { transitionState, moves, elapsed, previousMove } = this.state;

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
                onMoveSquare={this.handlePressSquare}
                onTransitionOut={this.handleBoardTransitionOut}
                onTransitionIn={this.handleBoardTransitionIn}
              />
              <Button title={"Quit"} onPress={this.handlePressQuit} />
            </View>
          )}
        </View>
      )
    );
  }
}

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
