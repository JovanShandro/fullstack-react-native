import React from "react";
import {
  Image,
  StyleSheet,
  View,
  ImageSourcePropType,
  ViewStyle,
  ImageStyle
} from "react-native";

import { calculateItemSize, itemMargin } from "../utils/grid";

interface Props {
  image: ImageSourcePropType | null;
  boardSize: number;
}
const Preview: React.FC<Props> = ({ image = null, boardSize }) => {
  const itemSize = calculateItemSize(boardSize);
  const scaledSize = itemSize < 80 ? itemSize * 2 + itemMargin : itemSize;

  const style = {
    width: scaledSize,
    height: scaledSize
  };

  return (
    <View style={styles.container}>
      <Image
        style={[styles.image, style]}
        source={image as ImageSourcePropType}
      />
    </View>
  );
};

interface Style {
  container: ViewStyle;
  image: ImageStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    padding: 6,
    borderRadius: 6,
    backgroundColor: "#1F1E2A"
  },
  image: {
    resizeMode: "contain"
  }
});

export default Preview;
