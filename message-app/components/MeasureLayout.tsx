import React, { ReactNode } from "react";
import Constants from "expo-constants";
import {
  Platform,
  StyleSheet,
  View,
  LayoutChangeEvent,
  ViewStyle
} from "react-native";
import { Layout } from "../utils/types";

interface Props {
  children(layout: Layout): ReactNode;
}

interface State {
  layout: Layout | null;
}

export default class MeasureLayout extends React.Component<Props, State> {
  state: State = {
    layout: null
  };

  handleLayout = (event: LayoutChangeEvent) => {
    const {
      nativeEvent: { layout }
    } = event;

    this.setState({
      layout: {
        ...layout,
        y:
          layout.y + (Platform.OS === "android" ? Constants.statusBarHeight : 0)
      }
    });
  };

  render() {
    const { children } = this.props;
    const { layout } = this.state;

    // Measure the available space with a placeholder view set to flex 1
    if (!layout) {
      return <View onLayout={this.handleLayout} style={styles.container} />;
    }

    return children(layout);
  }
}

interface Style {
  container: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1
  }
});
