import React, { Component } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import TimerButton from "./TimerButton";
import TimerForm from "./TimerForm";
import { Timer } from "../utils/types";

interface Props {
  onFormSubmit(timer: Timer): void;
}

interface State {
  isOpen: boolean;
}

export default class ToggleableTimerForm extends Component<Props, State> {
  state: State = {
    isOpen: false
  };

  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFormClose = () => {
    this.setState({ isOpen: false });
  };

  handleFormSubmit = (timer: Timer) => {
    const { onFormSubmit } = this.props;

    onFormSubmit(timer);
    this.setState({ isOpen: false });
  };

  render() {
    const { isOpen } = this.state;

    return (
      <View style={[styles.container, !isOpen && styles.buttonPadding]}>
        {isOpen ? (
          <TimerForm
            onFormSubmit={this.handleFormSubmit}
            onFormClose={this.handleFormClose}
          />
        ) : (
          <TimerButton title="+" color="black" onPress={this.handleFormOpen} />
        )}
      </View>
    );
  }
}

interface Style {
  container: ViewStyle;
  buttonPadding: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    paddingVertical: 10
  },
  buttonPadding: {
    paddingHorizontal: 15
  }
});
