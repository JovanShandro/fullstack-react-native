import React, { Component } from "react";
import { StyleSheet, View, Text, ViewStyle, TextStyle } from "react-native";
import TimerButton from "./TimerButton";
import { Timer as TimerType } from "../utils/types";
import { millisecondsToHuman } from "../utils/TimerUtils";

type Props = {
  onEditPress(): void;
  onRemovePress(timerId: string): void;
  onStartPress(timerId: string): void;
  onStopPress(timerId: string): void;
} & TimerType;

export default class Timer extends Component<Props, {}> {
  handleStartPress = () => {
    const { id, onStartPress } = this.props;

    onStartPress(id);
  };

  handleStopPress = () => {
    const { id, onStopPress } = this.props;

    onStopPress(id);
  };

  handleRemovePress = () => {
    const { id, onRemovePress } = this.props;

    onRemovePress(id);
  };

  renderActionButton() {
    const { isRunning } = this.props;

    if (isRunning) {
      return (
        <TimerButton
          color="#DB2828"
          title="Stop"
          onPress={this.handleStopPress}
        />
      );
    }

    return (
      <TimerButton
        color="#21BA45"
        title="Start"
        onPress={this.handleStartPress}
      />
    );
  }

  render() {
    const { elapsed, title, project, onEditPress } = this.props;
    const elapsedString: string = millisecondsToHuman(elapsed);

    return (
      <View style={styles.timerContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text>{project}</Text>
        <Text style={styles.elapsedTime}>{elapsedString}</Text>
        <View style={styles.buttonGroup}>
          <TimerButton color="blue" small title="Edit" onPress={onEditPress} />
          <TimerButton
            color="blue"
            small
            title="Remove"
            onPress={this.handleRemovePress}
          />
        </View>
        {this.renderActionButton()}
      </View>
    );
  }
}

interface Style {
  timerContainer: ViewStyle;
  elapsedTime: TextStyle;
  buttonGroup: ViewStyle;
  title: TextStyle;
}
const styles = StyleSheet.create<Style>({
  timerContainer: {
    backgroundColor: "white",
    borderColor: "#d6d7da",
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 0
  },
  title: {
    fontSize: 14,
    fontWeight: "bold"
  },
  elapsedTime: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    paddingVertical: 15
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});
