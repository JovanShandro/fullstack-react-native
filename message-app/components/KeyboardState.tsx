import {
  Keyboard,
  KeyboardEvent,
  Platform,
  KeyboardEventListener,
  EmitterSubscription,
} from "react-native";
import { useState, useRef, useEffect, ReactElement } from "react";
import { Layout } from "../utils/types";
import { useComponentWillMount } from "../utils/useComponentWillMount";

const INITIAL_ANIMATION_DURATION = 250;

interface Props {
  layout: Layout;
  children(props: {
    containerHeight: number;
    contentHeight: number;
    keyboardHeight: number;
    keyboardVisible: boolean;
    keyboardWillShow: boolean;
    keyboardWillHide: boolean;
    keyboardAnimationDuration: number;
  }): ReactElement;
}

const KeyboardState = ({ layout, children }: Props) => {
  const [contentHeight, setContentHeight] = useState(layout.height);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardWillShow, setKeyboardWillShow] = useState(false);
  const [keyboardWillHide, setKeyboardWillHide] = useState(false);
  const [keyboardAnimationDuration, setKeyboardAnimationDuration] = useState(
    INITIAL_ANIMATION_DURATION
  );
  const subscriptions = useRef<EmitterSubscription[]>([]);

  const keyboardWillShowHandler: KeyboardEventListener = (
    event: KeyboardEvent
  ) => {
    const {
      endCoordinates: { height, screenY },
    } = event;
    setKeyboardWillShow(true);
    measure(height, screenY);
  };

  const keyboardDidShowHandler: KeyboardEventListener = (
    event: KeyboardEvent
  ) => {
    const {
      endCoordinates: { height, screenY },
    } = event;
    setKeyboardWillShow(false);
    setKeyboardVisible(true);
    measure(height, screenY);
  };

  const keyboardWillHideHandler: KeyboardEventListener = (
    event: KeyboardEvent
  ) => {
    const {
      endCoordinates: { height, screenY },
    } = event;
    setKeyboardWillHide(true);
    measure(height, screenY);
  };

  const keyboardDidHideHandler: KeyboardEventListener = () => {
    setKeyboardWillHide(false);
    setKeyboardVisible(false);
  };

  useComponentWillMount(() => {
    if (Platform.OS === "ios") {
      subscriptions.current = [
        Keyboard.addListener("keyboardWillShow", keyboardWillShowHandler),
        Keyboard.addListener("keyboardWillHide", keyboardWillHideHandler),
        Keyboard.addListener("keyboardDidShow", keyboardDidShowHandler),
        Keyboard.addListener("keyboardDidHide", keyboardDidHideHandler),
      ];
    } else {
      subscriptions.current = [
        Keyboard.addListener("keyboardDidHide", keyboardDidHideHandler),
        Keyboard.addListener("keyboardDidShow", keyboardDidShowHandler),
      ];
    }
  });

  useEffect(() => {
    return () => {
      subscriptions.current.forEach((subscription) => subscription.remove());
    };
  }, []);

  const measure = (height: number, screenY: number) => {
    setContentHeight(screenY - layout.y);
    setKeyboardHeight(height);
  };

  return children({
    containerHeight: layout.height,
    contentHeight,
    keyboardHeight,
    keyboardVisible,
    keyboardWillShow,
    keyboardWillHide,
    keyboardAnimationDuration,
  });
};

export default KeyboardState;
