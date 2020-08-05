import React, { useState, useMemo } from "react";
import {
  PanResponder,
  GestureResponderHandlers,
  PanResponderGestureState
} from "react-native";
import { ItemSize } from "../utils/types";

interface Props {
  children({
    handlers,
    dragging
  }: {
    handlers: GestureResponderHandlers;
    dragging: boolean;
  }): React.ReactElement;
  onTouchStart(): void;
  onTouchMove(offset: ItemSize): void;
  onTouchEnd(offset: ItemSize): void;
  enabled: boolean;
}

const Draggable: React.FC<Props> = ({
  onTouchStart = () => {},
  onTouchMove = () => {},
  onTouchEnd = () => {},
  enabled = true,
  children
}) => {
  const [dragging, setDragging] = useState(false);

  // Should we become active when the user presses down on the square?
  const handleStartShouldSetPanResponder = () => {
    return enabled;
  };

  // We were granted responder status! Let's update the UI
  const handlePanResponderGrant = () => {
    setDragging(true);
    onTouchStart();
  };

  // Every time the touch moves
  const handlePanResponderMove = (
    e: any,
    gestureState: PanResponderGestureState
  ) => {
    // Keep track of how far we've moved in total (dx and dy)
    const offset = {
      top: gestureState.dy,
      left: gestureState.dx
    };

    onTouchMove(offset);
  };

  // When the touch is lifted
  const handlePanResponderEnd = (
    e: any,
    gestureState: PanResponderGestureState
  ) => {
    const offset = {
      top: gestureState.dy,
      left: gestureState.dx
    };

    setDragging(false);

    onTouchMove(offset);
    onTouchEnd(offset);
  };
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: handleStartShouldSetPanResponder,
        onPanResponderGrant: handlePanResponderGrant,
        onPanResponderMove: handlePanResponderMove,
        onPanResponderRelease: handlePanResponderEnd,
        onPanResponderTerminate: handlePanResponderEnd
      }),
    []
  );

  // Update children with the state of the drag
  return children({
    handlers: panResponder.panHandlers,
    dragging
  });
};

export default Draggable;
