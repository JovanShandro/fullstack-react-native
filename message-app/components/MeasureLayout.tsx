import React, { ReactNode, useState, ReactElement } from "react";
import Constants from "expo-constants";
import {
  Platform,
  StyleSheet,
  View,
  LayoutChangeEvent,
  ViewStyle,
} from "react-native";
import { Layout } from "../utils/types";

interface Props {
  children(layout: Layout): ReactElement;
}

const MeasureLayout = ({ children }: Props) => {
  const [layout, setLayout] = useState<Layout | null>(null);

  const handleLayout = (event: LayoutChangeEvent) => {
    const newLayout = event.nativeEvent.layout;

    setLayout({
      ...(newLayout as Layout),
      y:
        newLayout.y +
        (Platform.OS === "android" ? Constants.statusBarHeight : 0),
    });
  };

  // Measure the available space with a placeholder view set to flex 1
  if (!layout) {
    return <View onLayout={handleLayout} style={styles.container} />;
  }

  return children(layout);
};

interface Style {
  container: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
  },
});

export default MeasureLayout;
