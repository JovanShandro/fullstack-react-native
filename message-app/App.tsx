import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  BackHandler,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
  ViewStyle,
  ImageStyle,
  NativeEventSubscription
} from "react-native";
import {
  createImageMessage,
  createLocationMessage,
  createTextMessage
} from "./utils/MessageUtils";
import ImageGrid from "./components/ImageGrid";
import KeyboardState from "./components/KeyboardState";
import MeasureLayout from "./components/MeasureLayout";
import MessageList from "./components/MessageList";
import MessagingContainer from "./components/MessagingContainer";
import Status from "./components/Status";
import Toolbar from "./components/Toolbar";
import { MessageShape, INPUT_METHOD } from "./utils/types";

const App: React.FC<{}> = () => {
  const [messages, setMessages] = useState([
    createImageMessage("https://unsplash.it/300/300"),
    createTextMessage("World"),
    createTextMessage("Hello"),
    createLocationMessage({
      latitude: 37.78825,
      longitude: -122.4324
    })
  ]);

  const [fullscreenImageId, setFullscreenImageId] = useState<number | null>(
    null
  );
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputMethod, setInputMethod] = useState(INPUT_METHOD.NONE);
  const subscription = useRef<NativeEventSubscription | null>(null);
  const willMount = useRef(true);

  if (willMount.current) {
    subscription.current = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (fullscreenImageId) {
          dismissFullscreenImage();
          return true;
        }

        return false;
      }
    );
  }

  willMount.current = false;

  useEffect(() => {
    return () => {
      if (subscription.current) {
        subscription.current.remove();
      }
    };
  }, []);

  const dismissFullscreenImage = () => {
    setFullscreenImageId(null);
  };

  const handlePressToolbarCamera = () => {
    setIsInputFocused(false);
    setInputMethod(INPUT_METHOD.CUSTOM);
  };

  const handlePressToolbarLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const {
        coords: { latitude, longitude }
      } = position;

      setMessages(messages => [
        createLocationMessage({
          latitude,
          longitude
        }),
        ...messages
      ]);
    });
  };

  const handlePressImage = (uri: string) => {
    setMessages(messages => [createImageMessage(uri), ...messages]);
  };

  const handleSubmit = (text: string) => {
    setMessages(messages => [createTextMessage(text), ...messages]);
  };

  const handleChangeFocus = (isFocused: boolean) => {
    setIsInputFocused(isFocused);
  };

  const handleChangeInputMethod = (inputMethod: INPUT_METHOD) => {
    setInputMethod(inputMethod);
  };

  const handlePressMessage = ({ id, type }: MessageShape) => {
    switch (type) {
      case "text":
        Alert.alert(
          "Delete message?",
          "Are you sure you want to permanently delete this message?",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => {
                setMessages(messages =>
                  messages.filter(message => message.id !== id)
                );
              }
            }
          ]
        );
        break;
      case "image":
        setFullscreenImageId(id);
        setIsInputFocused(false);
        break;
      default:
        break;
    }
  };

  const renderMessageList = () => (
    <View style={styles.content}>
      <MessageList messages={messages} onPressMessage={handlePressMessage} />
    </View>
  );

  const renderToolbar = () => (
    <View style={styles.toolbar}>
      <Toolbar
        isFocused={isInputFocused}
        onSubmit={handleSubmit}
        onChangeFocus={handleChangeFocus}
        onPressCamera={handlePressToolbarCamera}
        onPressLocation={handlePressToolbarLocation}
      />
    </View>
  );

  const renderInputMethodEditor = () => (
    <View style={styles.inputMethodEditor}>
      <ImageGrid onPressImage={handlePressImage} />
    </View>
  );

  const renderFullscreenImage = () => {
    if (!fullscreenImageId) return null;

    const image = messages.find(message => message.id === fullscreenImageId);

    if (!image) return null;

    const { uri } = image;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={dismissFullscreenImage}
      >
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  return (
    <View style={styles.container}>
      <Status />
      <MeasureLayout>
        {layout => (
          <KeyboardState layout={layout}>
            {keyboardInfo => (
              <MessagingContainer
                {...keyboardInfo}
                inputMethod={inputMethod}
                onChangeInputMethod={handleChangeInputMethod}
                renderInputMethodEditor={renderInputMethodEditor}
              >
                {renderMessageList()}
                {renderToolbar()}
              </MessagingContainer>
            )}
          </KeyboardState>
        )}
      </MeasureLayout>
      {renderFullscreenImage()}
    </View>
  );
};

interface Style {
  container: ViewStyle;
  content: ViewStyle;
  inputMethodEditor: ViewStyle;
  toolbar: ViewStyle;
  fullscreenImage: ImageStyle;
  fullscreenOverlay: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  content: {
    flex: 1,
    backgroundColor: "white"
  },
  inputMethodEditor: {
    flex: 1,
    backgroundColor: "white"
  },
  toolbar: {
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.04)",
    backgroundColor: "white"
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    zIndex: 2
  },
  fullscreenImage: {
    flex: 1,
    resizeMode: "contain"
  }
});

export default App;
