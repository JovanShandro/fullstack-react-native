import React, { useState, useEffect, useRef } from "react";
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
import { useComponentWillMount } from "../utils/useComponentWillMount";

enum BoardState {
  WillTransitionIn,
  DidTransitionIn,
  DidTransitionOut
}

interface Props {
  puzzle: Puzzle;
  teardown: boolean;
  onMoveSquare(square: number): void;
  onTransitionIn(): void;
  onTransitionOut(): void;
  image: ImageSourcePropType | null;
  previousMove: number | null;
}

const Board: React.FC<Props> = ({
  puzzle,
  puzzle: { size, empty, board },
  teardown,
  onTransitionOut,
  onTransitionIn,
  onMoveSquare,
  image = null,
  previousMove = null
}) => {
  const [transitionState, setTransitionState] = useState(
    BoardState.WillTransitionIn
  );
  const prevPuzzle = useRef<Puzzle>(puzzle);
  const prevTeardown = useRef<boolean>(teardown);

  const animatedValues = useRef<
    {
      scale: Animated.Value;
      top: Animated.Value;
      left: Animated.Value;
    }[]
  >([]);

  useComponentWillMount(() => {
    const height = Dimensions.get("window").height;

    board.forEach((square, index) => {
      const { top, left } = calculateItemPosition(size, index);

      animatedValues.current[square] = {
        scale: new Animated.Value(1),
        top: new Animated.Value(top + height),
        left: new Animated.Value(left)
      };
    });
  });

  // As a component did mount hook
  useEffect(() => {
    const handleDidMountAsync = async () => {
      await animateAllSquares(true);

      setTransitionState(BoardState.DidTransitionIn);
      onTransitionIn();
    };
    handleDidMountAsync();
  }, []);

  // As a should receive props lifecycle hook
  useEffect(() => {
    // Check prop changes to update positions
    const handlePropChangesAsync = async (
      previousMove: number | null,
      onTransitionOut: () => void,
      puzzle: Puzzle,
      teardown: boolean
    ) => {
      const didMovePiece =
        prevPuzzle.current !== puzzle && previousMove !== null;
      const shouldTeardown = !prevTeardown.current && teardown;

      if (didMovePiece) {
        await updateSquarePosition(
          previousMove as number,
          getIndex(puzzle, previousMove as number)
        );
      }

      if (shouldTeardown) {
        await animateAllSquares(false);

        setTransitionState(BoardState.DidTransitionOut);

        onTransitionOut();
      }
      prevTeardown.current = teardown;
      prevPuzzle.current = puzzle;
    };
    handlePropChangesAsync(previousMove, onTransitionOut, puzzle, teardown);
  }, [previousMove, onTransitionOut, puzzle, teardown]);

  // Animate all squares when entering of leaving the board
  const animateAllSquares = (visible: boolean) => {
    const height = Dimensions.get("window").height;

    const animations = board.map((square, index) => {
      const { top } = calculateItemPosition(size, index);

      return Animated.timing(animatedValues.current[square].top, {
        toValue: visible ? top : top + height,
        delay: 800 * (index / board.length),
        duration: 400,
        easing: visible ? Easing.out(Easing.ease) : Easing.in(Easing.ease),
        useNativeDriver: true
      });
    });

    return new Promise(resolve => Animated.parallel(animations).start(resolve));
  };

  // Move the square
  const updateSquarePosition = (square: number, index: number) => {
    const { top, left } = calculateItemPosition(size, index);

    const animations = [
      Animated.spring(animatedValues.current[square].top, {
        toValue: top,
        friction: 20,
        tension: 200,
        useNativeDriver: true
      }),
      Animated.spring(animatedValues.current[square].left, {
        toValue: left,
        friction: 20,
        tension: 200,
        useNativeDriver: true
      })
    ];

    return new Promise(resolve => Animated.parallel(animations).start(resolve));
  };

  // Hanlde start of touch
  const handleTouchStart = (square: number) => {
    Animated.spring(animatedValues.current[square].scale, {
      toValue: 1.1,
      friction: 20,
      tension: 200,
      useNativeDriver: true
    }).start();
  };

  // Handle moving finger on screen
  const handleTouchMove = (
    square: number,
    index: number,
    { top, left }: ItemSize
  ) => {
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

    animatedValues.current[square].left.setValue(initialLeft + clampedLeft);
    animatedValues.current[square].top.setValue(initialTop + clampedTop);
  };

  // Make sure if movement cut in half, the square gets to the desired position
  const handleTouchEnd = (
    square: number,
    index: number,
    { top, left }: ItemSize
  ) => {
    const itemSize = calculateItemSize(size);
    const move = availableMove(puzzle, square);

    Animated.spring(animatedValues.current[square].scale, {
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
      updateSquarePosition(square, index);
    }
  };

  // Draw a square on the board
  const renderSquare = (square: number, index: number) => {
    if (square === empty) return null;

    const itemSize = calculateItemSize(size);

    return (
      <Draggable
        key={square}
        enabled={transitionState === BoardState.DidTransitionIn}
        onTouchStart={() => handleTouchStart(square)}
        onTouchMove={offset => handleTouchMove(square, index, offset)}
        onTouchEnd={offset => handleTouchEnd(square, index, offset)}
      >
        {({ handlers, dragging }) => {
          const itemStyle = {
            position: "absolute",
            width: itemSize,
            height: itemSize,
            overflow: "hidden",
            transform: [
              { translateX: animatedValues.current[square].left },
              { translateY: animatedValues.current[square].top },
              { scale: animatedValues.current[square].scale }
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

  const containerSize = calculateContainerSize();
  const containerStyle = { width: containerSize, height: containerSize };

  return (
    <View style={[styles.container, containerStyle]}>
      {transitionState !== BoardState.DidTransitionOut &&
        board.map(renderSquare)}
    </View>
  );
};

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

export default Board;
