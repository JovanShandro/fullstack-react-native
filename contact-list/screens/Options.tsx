import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";

import DetailListItem from "../components/DetailListItem";

export default class Options extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <DetailListItem title="Update Profile" />
        <DetailListItem title="Change Language" />
        <DetailListItem title="Sign Out" />
      </View>
    );
  }
}

interface Style {
  container: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: "white"
  }
});
