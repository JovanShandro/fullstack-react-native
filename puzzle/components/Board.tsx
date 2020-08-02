import React from "react";
import {
  Animated,
  Image,
  StyleSheet,
  View,
  Dimensions,
  Easing,
  ViewStyle,
  ImageStyle,
  ImageSourcePropType
} from "react-native";

import { availableMove, getIndex } from "../utils/puzzle";
import {
  calculateContainerSize,
  calculateItemSize,
  itemMargin,
  calculateItemPosition
} from "../utils/grid";
import Draggable from "./Draggable";
import clamp from "../utils/clamp";
import { Puzzle, ItemSize } from "../utils/types";

enum BoardState {
  WillTransitionIn,
  DidTransitionIn,
  DidTransitionOut
}

type Props = {
  puzzle: Puzzle;
  teardown: boolean;
  onMoveSquare(square: number): void;
  onTransitionIn(): void;
  onTransitionOut(): void;
} & DefaultProps;

type DefaultProps = {
  image: ImageSourcePropType | null;
  previousMove: number | null;
};

interface State {
  transitionState: BoardState;
}

export default class Board extends React.PureComponent<Props, State> {
  static defaultProps: DefaultProps = {
    image: null,
    previousMove: null
  };

  animatedValues: {
    scale: Animated.Value;
    top: Animated.Value;
    left: Animated.Value;
  }[];

  constructor(props: Props) {
    super(props);

    const {
      puzzle: { size, board }
    } = props;

    this.state = { transitionState: BoardState.WillTransitionIn };
    this.animatedValues = [];

    const height = Dimensions.get("window").height;

    board.forEach((square, index) => {
      const { top, left } = calculateItemPosition(size, index);

      this.animatedValues[square] = {
        scale: new Animated.Value(1),
        top: new Animated.Value(top + height),
        left: new Animated.Value(left)
      };
    });
  }

  async componentDidMount() {
    await this.animateAllSquares(true);

    const { onTransitionIn } = this.props;

    this.setState({ transitionState: BoardState.DidTransitionIn });

    onTransitionIn();
  }

  async UNSAFE_componentWillReceiveProps(nextProps: Props) {
    const { previousMove, onTransitionOut, puzzle, teardown } = nextProps;

    const didMovePiece = this.props.puzzle !== puzzle && previousMove !== null;
    const shouldTeardown = !this.props.teardown && teardown;

    if (didMovePiece) {
      await this.updateSquarePosition(
        puzzle,
        previousMove as number,
        getIndex(puzzle, previousMove as number)
      );
    }

    if (shouldTeardown) {
      await this.animateAllSquares(false);

      this.setState({ transitionState: BoardState.DidTransitionOut });

      onTransitionOut();
    }
  }

  animateAllSquares(visible: boolean) {
    const {
      puzzle: { board, size }
    } = this.props;

    const height = Dimensions.get("window").height;

    const animations = board.map((square, index) => {
      const { top } = calculateItemPosition(size, index);

      return Animated.timing(this.animatedValues[square].top, {
        toValue: visible ? top : top + height,
        delay: 800 * (index / board.length),
        duration: 400,
        easing: visible ? Easing.out(Easing.ease) : Easing.in(Easing.ease),
        useNativeDriver: true
      });
    });

    return new Promise(resolve => Animated.parallel(animations).start(resolve));
  }

  updateSquarePosition(puzzle: Puzzle, square: number, index: number) {
    const { size } = puzzle;

    const { top, left } = calculateItemPosition(size, index);

    const animations = [
      Animated.spring(this.animatedValues[square].top, {
        toValue: top,
        friction: 20,
        tension: 200,
        useNativeDriver: true
      }),
      Animated.spring(this.animatedValues[square].left, {
        toValue: left,
        friction: 20,
        tension: 200,
        useNativeDriver: true
      })
    ];

    return new Promise(resolve => Animated.parallel(animations).start(resolve));
  }

  handleTouchStart(square: number) {
    Animated.spring(this.animatedValues[square].scale, {
      toValue: 1.1,
      friction: 20,
      tension: 200,
      useNativeDriver: true
    }).start();
  }

  handleTouchMove(square: number, index: number, { top, left }: ItemSize) {
    const {
      puzzle,
      puzzle: { size }
    } = this.props;

    const itemSize = calculateItemSize(size);
    const move = availableMove(puzzle, square);

    const { top: initialTop, left: initialLeft } = calculateItemPosition(
      size,
      index
    );

    const distance = itemSize + itemMargin;

    const clampedTop = clamp(
      top,
      move === "up" ? -distance : 0,
      move === "down" ? distance : 0
    );

    const clampedLeft = clamp(
      left,
      move === "left" ? -distance : 0,
      move === "right" ? distance : 0
    );

    this.animatedValues[square].left.setValue(initialLeft + clampedLeft);
    this.animatedValues[square].top.setValue(initialTop + clampedTop);
  }

  handleTouchEnd(square: number, index: number, { top, left }: ItemSize) {
    const {
      puzzle,
      puzzle: { size },
      onMoveSquare
    } = this.props;

    const itemSize = calculateItemSize(size);
    const move = availableMove(puzzle, square);

    Animated.spring(this.animatedValues[square].scale, {
      toValue: 1,
      friction: 20,
      tension: 200,
      useNativeDriver: true
    }).start();

    if (
      (move === "up" && top < -itemSize / 2) ||
      (move === "down" && top > itemSize / 2) ||
      (move === "left" && left < -itemSize / 2) ||
      (move === "right" && left > itemSize / 2)
    ) {
      onMoveSquare(square);
    } else {
      this.updateSquarePosition(puzzle, square, index);
    }
  }

  renderSquare = (square: number, index: number) => {
    const {
      puzzle: { size, empty },
      image
    } = this.props;
    const { transitionState } = this.state;

    if (square === empty) return null;

    const itemSize = calculateItemSize(size);

    return (
      <Draggable
        key={square}
        enabled={transitionState === BoardState.DidTransitionIn}
        onTouchStart={() => this.handleTouchStart(square)}
        onTouchMove={offset => this.handleTouchMove(square, index, offset)}
        onTouchEnd={offset => this.handleTouchEnd(square, index, offset)}
      >
        {({ handlers, dragging }) => {
          const itemStyle = {
            position: "absolute",
            width: itemSize,
            height: itemSize,
            overflow: "hidden",
            transform: [
              { translateX: this.animatedValues[square].left },
              { translateY: this.animatedValues[square].top },
              { scale: this.animatedValues[square].scale }
            ],
            zIndex: dragging ? 1 : 0
          };

          const imageStyle: ImageStyle = {
            position: "absolute",
            width: itemSize * size + (itemMargin * size - 1),
            height: itemSize * size + (itemMargin * size - 1),
            transform: [
              {
                translateX: -Math.floor(square % size) * (itemSize + itemMargin)
              },
              {
                translateY: -Math.floor(square / size) * (itemSize + itemMargin)
              }
            ]
          };

          return (
            <Animated.View {...handlers} style={itemStyle}>
              <Image style={imageStyle} source={image as ImageSourcePropType} />
            </Animated.View>
          );
        }}
      </Draggable>
    );
  };

  render() {
    const {
      puzzle: { board }
    } = this.props;
    const { transitionState } = this.state;

    const containerSize = calculateContainerSize();
    const containerStyle = { width: containerSize, height: containerSize };

    return (
      <View style={[styles.container, containerStyle]}>
        {transitionState !== BoardState.DidTransitionOut &&
          board.map(this.renderSquare)}
      </View>
    );
  }
}

interface Style {
  container: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#1F1E2A"
  }
});
