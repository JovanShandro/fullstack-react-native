import React from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";

import formatElapsedTime from "../utils/formatElapsedTime";

interface Props {
  time: number;
  moves: number;
}

const Stats: React.FC<Props> = ({ time, moves }) => (
  <View style={styles.container}>
    <View style={styles.labels}>
      <Text style={[styles.text, styles.textMargin]}>Time</Text>
      <Text style={styles.text}>Moves</Text>
    </View>
    <View style={styles.values}>
      <Text style={[styles.text, styles.textMargin, styles.value]}>
        {formatElapsedTime(time)}
      </Text>
      <Text style={[styles.text, styles.value]}>{moves.toString()}</Text>
    </View>
  </View>
);

interface Style {
  container: ViewStyle;
  labels: ViewStyle;
  values: ViewStyle;
  text: TextStyle;
  textMargin: TextStyle;
  value: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flexDirection: "row"
  },
  labels: {
    alignItems: "flex-end",
    marginRight: 15
  },
  values: {
    alignItems: "flex-end",
    minWidth: 56
  },
  text: {
    fontSize: 24,
    color: "#69B8FF",
    backgroundColor: "transparent"
  },
  value: {
    fontWeight: "bold"
  },
  textMargin: {
    marginBottom: 10
  }
});

export default Stats;
