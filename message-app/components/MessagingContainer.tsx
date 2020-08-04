import React, { ReactNode, useRef, useEffect } from "react";
import {
  BackHandler,
  LayoutAnimation,
  Platform,
  UIManager,
  View,
  NativeEventSubscription
} from "react-native";
import { isIphoneX } from "react-native-iphone-x-helper";
import { INPUT_METHOD } from "../utils/types";

interface Props {
  children: ReactNode;
  containerHeight: number;
  contentHeight: number;
  keyboardHeight: number;
  keyboardVisible: boolean;
  keyboardWillShow: boolean;
  keyboardWillHide: boolean;
  keyboardAnimationDuration: number;
  inputMethod: INPUT_METHOD;
  onChangeInputMethod(method: INPUT_METHOD): void;
  renderInputMethodEditor(): ReactNode;
}

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const MessagingContainer: React.FC<Props> = props => {
  const subscription = useRef<NativeEventSubscription | null>(null);
  const prevProps = useRef<Props>(props);

  useEffect(() => {
    subscription.current = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const { onChangeInputMethod, inputMethod } = props;

        console.log("!"); // For some reason the handler doesn't work if I delete this line
        if (inputMethod === INPUT_METHOD.CUSTOM) {
          onChangeInputMethod(INPUT_METHOD.NONE);
          return true;
        }

        return false;
      }
    );

    return () => {
      if (subscription.current) {
        subscription.current.remove();
      }
    };
  }, []);

  useEffect(() => {
    const { onChangeInputMethod } = prevProps.current;

    if (!prevProps.current.keyboardVisible && props.keyboardVisible) {
      // Keyboard shown
      onChangeInputMethod(INPUT_METHOD.KEYBOARD);
    } else if (
      // Keyboard hidden
      prevProps.current.keyboardVisible &&
      !props.keyboardVisible &&
      prevProps.current.inputMethod !== INPUT_METHOD.CUSTOM
    ) {
      onChangeInputMethod(INPUT_METHOD.NONE);
    }

    const { keyboardAnimationDuration } = props;

    // Animate between states
    const animation = LayoutAnimation.create(
      keyboardAnimationDuration,
      Platform.OS === "android"
        ? LayoutAnimation.Types.easeInEaseOut
        : LayoutAnimation.Types.keyboard,
      LayoutAnimation.Properties.opacity
    );
    LayoutAnimation.configureNext(animation);

    prevProps.current = props;
  }, [props]);

  const {
    children,
    renderInputMethodEditor,
    inputMethod,
    containerHeight,
    contentHeight,
    keyboardHeight,
    keyboardWillShow,
    keyboardWillHide
  } = props;

  const useContentHeight =
    keyboardWillShow || inputMethod === INPUT_METHOD.KEYBOARD;

  const containerStyle = {
    height: useContentHeight ? contentHeight : containerHeight
  };

  const showCustomInput =
    inputMethod === INPUT_METHOD.CUSTOM && !keyboardWillShow;

  const keyboardIsHidden =
    inputMethod === INPUT_METHOD.NONE && !keyboardWillShow;

  const keyboardIsHiding =
    inputMethod === INPUT_METHOD.KEYBOARD && keyboardWillHide;

  const inputStyle = {
    height: showCustomInput ? keyboardHeight || 250 : 0,
    marginTop: isIphoneX() && (keyboardIsHidden || keyboardIsHiding) ? 24 : 0
  };

  return (
    <View style={containerStyle}>
      {children}
      <View style={inputStyle}>{renderInputMethodEditor()}</View>
    </View>
  );
};

export default MessagingContainer;
