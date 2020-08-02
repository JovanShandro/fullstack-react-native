import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  ViewStyle,
  TextStyle
} from "react-native";
import { newTimer } from "./utils/TimerUtils";
import EditableTimer from "./components/EditableTimer";
import ToggleableTimerForm from "./components/ToggleableTimerForm";
import { Timer, Attribute } from "./utils/types";
import { uuid } from "./utils/uuid";

interface State {
  timers: Timer[];
}

export default class App extends React.Component<{}, State> {
  state: State = {
    timers: [
      {
        title: "Mow the lawn",
        project: "House Chores",
        id: uuid(),
        elapsed: 5460494,
        isRunning: false
      },
      {
        title: "Clear paper jam",
        project: "Office Chores",
        id: uuid(),
        elapsed: 1277537,
        isRunning: false
      },
      {
        title: "Ponder origins of universe",
        project: "Life Chores",
        id: uuid(),
        elapsed: 120000,
        isRunning: true
      }
    ]
  };

  intervalId?: number;

  componentDidMount() {
    const TIME_INTERVAL = 1000;

    this.intervalId = setInterval(() => {
      const { timers } = this.state;

      this.setState({
        timers: timers.map(timer => {
          const { elapsed, isRunning } = timer;

          return {
            ...timer,
            elapsed: isRunning ? elapsed + TIME_INTERVAL : elapsed
          };
        })
      });
    }, TIME_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  handleCreateFormSubmit = (timer: Timer) => {
    const { timers } = this.state;

    this.setState({
      timers: [newTimer(timer), ...timers]
    });
  };

  handleFormSubmit = (attrs: Attribute) => {
    const { timers } = this.state;

    this.setState({
      timers: timers.map(timer => {
        if (timer.id === attrs.id) {
          const { title, project } = attrs;

          return {
            ...timer,
            title,
            project
          };
        }

        return timer;
      }) as Timer[]
    });
  };

  handleRemovePress = (timerId: string) => {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId)
    });
  };

  toggleTimer = (timerId: string) => {
    this.setState(prevState => {
      const { timers } = prevState;

      return {
        timers: timers.map(timer => {
          const { id, isRunning } = timer;

          if (id === timerId) {
            return {
              ...timer,
              isRunning: !isRunning
            };
          }

          return timer;
        })
      };
    });
  };

  render() {
    const { timers } = this.state;

    return (
      <View style={styles.appContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Timers</Text>
        </View>
        <KeyboardAvoidingView
          behavior="padding"
          style={styles.timerListContainer}
        >
          <ScrollView contentContainerStyle={styles.timerList}>
            <ToggleableTimerForm onFormSubmit={this.handleCreateFormSubmit} />
            {timers.map(({ title, project, id, elapsed, isRunning }) => (
              <EditableTimer
                key={id}
                id={id}
                title={title}
                project={project}
                elapsed={elapsed}
                isRunning={isRunning}
                onFormSubmit={this.handleFormSubmit}
                onRemovePress={this.handleRemovePress}
                onStartPress={this.toggleTimer}
                onStopPress={this.toggleTimer}
              />
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    );
  }
}

interface Style {
  title: TextStyle;
  timerList: ViewStyle;
  appContainer: ViewStyle;
  titleContainer: ViewStyle;
  timerListContainer: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  appContainer: {
    flex: 1
  },
  titleContainer: {
    paddingTop: 35,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#D6D7DA"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center"
  },
  timerListContainer: {
    flex: 1
  },
  timerList: {
    paddingBottom: 15
  }
});
