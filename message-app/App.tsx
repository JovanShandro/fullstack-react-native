import React from "react";
import {
  Alert,
  BackHandler,
  Image,
  StyleSheet,
  TouchableHighlight,
  View,
  ViewStyle,
  ImageStyle
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

interface State {
  messages: MessageShape[];
  fullscreenImageId: number | null;
  isInputFocused: boolean;
  inputMethod: INPUT_METHOD;
}

export default class App extends React.Component<{}, State> {
  state: State = {
    messages: [
      createImageMessage("https://unsplash.it/300/300"),
      createTextMessage("World"),
      createTextMessage("Hello"),
      createLocationMessage({
        latitude: 37.78825,
        longitude: -122.4324
      })
    ],
    fullscreenImageId: null,
    isInputFocused: false,
    inputMethod: INPUT_METHOD.NONE
  };

  subscription: any = null;

  UNSAFE_componentWillMount() {
    this.subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        const { fullscreenImageId } = this.state;

        if (fullscreenImageId) {
          this.dismissFullscreenImage();
          return true;
        }

        return false;
      }
    );
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  handlePressToolbarCamera = () => {
    this.setState({
      isInputFocused: false,
      inputMethod: INPUT_METHOD.CUSTOM
    });
  };

  handlePressToolbarLocation = () => {
    const { messages } = this.state;

    navigator.geolocation.getCurrentPosition(position => {
      const {
        coords: { latitude, longitude }
      } = position;

      this.setState({
        messages: [
          createLocationMessage({
            latitude,
            longitude
          }),
          ...messages
        ]
      });
    });
  };

  handlePressImage = (uri: string) => {
    const { messages } = this.state;

    this.setState({
      messages: [createImageMessage(uri), ...messages]
    });
  };

  handleSubmit = (text: string) => {
    const { messages } = this.state;

    this.setState({
      messages: [createTextMessage(text), ...messages]
    });
  };

  handleChangeFocus = (isFocused: boolean) => {
    this.setState({ isInputFocused: isFocused });
  };

  handleChangeInputMethod = (inputMethod: INPUT_METHOD) => {
    this.setState({ inputMethod });
  };

  handlePressMessage = ({ id, type }: MessageShape) => {
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
                const { messages } = this.state;
                this.setState({
                  messages: messages.filter(message => message.id !== id)
                });
              }
            }
          ]
        );
        break;
      case "image":
        this.setState({ fullscreenImageId: id, isInputFocused: false });
        break;
      default:
        break;
    }
  };

  renderMessageList() {
    const { messages } = this.state;

    return (
      <View style={styles.content}>
        <MessageList
          messages={messages}
          onPressMessage={this.handlePressMessage}
        />
      </View>
    );
  }

  renderToolbar() {
    const { isInputFocused } = this.state;

    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

  renderInputMethodEditor = () => (
    <View style={styles.inputMethodEditor}>
      <ImageGrid onPressImage={this.handlePressImage} />
    </View>
  );

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;

    if (!fullscreenImageId) return null;

    const image = messages.find(message => message.id === fullscreenImageId);

    if (!image) return null;

    const { uri } = image;

    return (
      <TouchableHighlight
        style={styles.fullscreenOverlay}
        onPress={this.dismissFullscreenImage}
      >
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  render() {
    const { inputMethod } = this.state;

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
                  onChangeInputMethod={this.handleChangeInputMethod}
                  renderInputMethodEditor={this.renderInputMethodEditor}
                >
                  {this.renderMessageList()}
                  {this.renderToolbar()}
                </MessagingContainer>
              )}
            </KeyboardState>
          )}
        </MeasureLayout>
        {this.renderFullscreenImage()}
      </View>
    );
  }
}

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
