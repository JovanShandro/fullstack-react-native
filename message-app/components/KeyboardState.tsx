import {
  Keyboard,
  KeyboardEvent,
  Platform,
  KeyboardEventListener,
  EmitterSubscription
} from "react-native";
import React, { ReactNode } from "react";
import { Layout } from "../utils/types";

const INITIAL_ANIMATION_DURATION = 250;

interface Props {
  layout: Layout;
  children(props: State & { containerHeight: number }): ReactNode;
}

interface State {
  contentHeight: number;
  keyboardHeight: number;
  keyboardVisible: boolean;
  keyboardWillShow: boolean;
  keyboardWillHide: boolean;
  keyboardAnimationDuration: number;
}

export default class KeyboardState extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      layout: { height }
    } = props;

    this.state = {
      contentHeight: height,
      keyboardHeight: 0,
      keyboardVisible: false,
      keyboardWillShow: false,
      keyboardWillHide: false,
      keyboardAnimationDuration: INITIAL_ANIMATION_DURATION
    };
  }

  subscriptions: EmitterSubscription[] = [];

  UNSAFE_componentWillMount() {
    if (Platform.OS === "ios") {
      this.subscriptions = [
        Keyboard.addListener("keyboardWillShow", this.keyboardWillShow),
        Keyboard.addListener("keyboardWillHide", this.keyboardWillHide),
        Keyboard.addListener("keyboardDidShow", this.keyboardDidShow),
        Keyboard.addListener("keyboardDidHide", this.keyboardDidHide)
      ];
    } else {
      this.subscriptions = [
        Keyboard.addListener("keyboardDidHide", this.keyboardDidHide),
        Keyboard.addListener("keyboardDidShow", this.keyboardDidShow)
      ];
    }
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.remove());
  }

  keyboardWillShow: KeyboardEventListener = (event: KeyboardEvent) => {
    this.setState({ keyboardWillShow: true });
    this.measure(event);
  };
  keyboardDidShow: KeyboardEventListener = (event: KeyboardEvent) => {
    this.setState({
      keyboardWillShow: false,
      keyboardVisible: true
    });
    this.measure(event);
  };

  keyboardWillHide: KeyboardEventListener = (event: KeyboardEvent) => {
    this.setState({ keyboardWillHide: true });
    this.measure(event);
  };

  keyboardDidHide: KeyboardEventListener = () => {
    this.setState({
      keyboardWillHide: false,
      keyboardVisible: false
    });
  };

  measure = (event: any) => {
    const { layout } = this.props;

    const {
      endCoordinates: { height, screenY }
    } = event;

    this.setState({
      contentHeight: screenY - layout.y,
      keyboardHeight: height
    });
  };

  render() {
    const { children, layout } = this.props;
    const {
      contentHeight,
      keyboardHeight,
      keyboardVisible,
      keyboardWillShow,
      keyboardWillHide,
      keyboardAnimationDuration
    } = this.state;

    return children({
      containerHeight: layout.height,
      contentHeight,
      keyboardHeight,
      keyboardVisible,
      keyboardWillShow,
      keyboardWillHide,
      keyboardAnimationDuration
    });
  }
}
