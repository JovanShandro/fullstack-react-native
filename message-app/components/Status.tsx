import React from "react";
import Constants from "expo-constants";
import NetInfo from "@react-native-community/netinfo";
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ViewStyle,
  TextStyle
} from "react-native";

interface State {
  connectionType: string | null;
}

export default class Status extends React.Component<{}, State> {
  state: State = {
    connectionType: null
  };

  unsubscribe: any = null;

  async UNSAFE_componentWillMount() {
    this.unsubscribe = NetInfo.addEventListener(this.handleChange);

    const { type } = await NetInfo.fetch();

    this.setState({ connectionType: type });

    // We can use this to test changes in network connectivity
    setTimeout(() => this.handleChange({ type: "none" }), 3000);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  handleChange = ({ type }: { type: string }) => {
    this.setState({ connectionType: type });
  };

  render() {
    const { connectionType } = this.state;

    const isConnected = connectionType !== "none";

    const backgroundColor = isConnected ? "white" : "red";

    const statusBar = (
      <StatusBar
        backgroundColor={backgroundColor}
        barStyle={isConnected ? "dark-content" : "light-content"}
        animated={false}
      />
    );

    const messageContainer = (
      <View style={styles.messageContainer} pointerEvents={"none"}>
        {statusBar}
        {!isConnected && (
          <View style={styles.bubble}>
            <Text style={styles.text}>No network connection</Text>
          </View>
        )}
      </View>
    );

    if (Platform.OS === "ios") {
      return (
        <View style={[styles.status, { backgroundColor }]}>
          {messageContainer}
        </View>
      );
    }

    return messageContainer;
  }
}

const statusHeight = Platform.OS === "ios" ? Constants.statusBarHeight : 0;

interface Style {
  status: ViewStyle;
  text: TextStyle;
  messageContainer: ViewStyle;
  bubble: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  status: {
    zIndex: 1,
    height: statusHeight
  },
  messageContainer: {
    zIndex: 1,
    position: "absolute",
    top: statusHeight + 20,
    right: 0,
    left: 0,
    height: 80,
    alignItems: "center"
  },
  bubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "red"
  },
  text: {
    color: "white"
  }
});
