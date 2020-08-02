import React from "react";
import {
  PanResponder,
  PanResponderInstance,
  GestureResponderHandlers,
  PanResponderGestureState
} from "react-native";
import { ItemSize } from "../utils/types";

type Props = {
  children({
    handlers,
    dragging
  }: {
    handlers: GestureResponderHandlers;
    dragging: boolean;
  }): React.ReactNode;
} & DefaultProps;

type DefaultProps = {
  onTouchStart(): void;
  onTouchMove(offset: ItemSize): void;
  onTouchEnd(offset: ItemSize): void;
  enabled: boolean;
};

interface State {
  dragging: boolean;
}

export default class Draggable extends React.Component<Props, State> {
  static defaultProps: DefaultProps = {
    onTouchStart: () => {},
    onTouchMove: () => {},
    onTouchEnd: () => {},
    enabled: true
  };

  panResponder: PanResponderInstance;

  constructor(props: Props) {
    super(props);

    this.state = {
      dragging: false
    };

    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd
    });
  }

  render() {
    const { children } = this.props;
    const { dragging } = this.state;

    // Update children with the state of the drag
    return children({
      handlers: this.panResponder.panHandlers,
      dragging
    });
  }

  // Should we become active when the user presses down on the square?
  handleStartShouldSetPanResponder = () => {
    const { enabled } = this.props;

    return enabled;
  };

  // We were granted responder status! Let's update the UI
  handlePanResponderGrant = () => {
    const { onTouchStart } = this.props;

    this.setState({ dragging: true });

    onTouchStart();
  };

  // Every time the touch moves
  handlePanResponderMove = (e: any, gestureState: PanResponderGestureState) => {
    const { onTouchMove } = this.props;

    // Keep track of how far we've moved in total (dx and dy)
    const offset = {
      top: gestureState.dy,
      left: gestureState.dx
    };

    onTouchMove(offset);
  };

  // When the touch is lifted
  handlePanResponderEnd = (e: any, gestureState: PanResponderGestureState) => {
    const { onTouchMove, onTouchEnd } = this.props;

    const offset = {
      top: gestureState.dy,
      left: gestureState.dx
    };

    this.setState({
      dragging: false
    });

    onTouchMove(offset);
    onTouchEnd(offset);
  };
}
