import React from "react";
import { ScrollView, StyleSheet, Text, View, ViewStyle } from "react-native";

interface Props {
  items: string[];
}

export default class CommentList extends React.Component<Props, {}> {
  renderItem = (item: string, index: number) => (
    <View key={index} style={styles.comment}>
      <Text>{item}</Text>
    </View>
  );

  render() {
    const { items } = this.props;

    return <ScrollView>{items.map(this.renderItem)}</ScrollView>;
  }
}

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
