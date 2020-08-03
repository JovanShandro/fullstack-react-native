import React from "react";
import { ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";

interface Props {
  items: string[];
}

const CommentList: React.FC<Props> = ({ items }) => {
  const renderItem = (item: string, index: number) => (
    <View key={index} style={styles.comment}>
      <Text>{item}</Text>
    </View>
  );

  return <ScrollView>{items.map(renderItem)}</ScrollView>;
};

interface Style {
  comment: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  comment: {
    marginLeft: 20,
    paddingVertical: 20,
    paddingRight: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.05)"
  }
});

export default CommentList;
