import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  ViewStyle,
  TextStyle,
  Platform
} from "react-native";
import { newTimer } from "./utils/TimerUtils";
import EditableTimer from "./components/EditableTimer";
import ToggleableTimerForm from "./components/ToggleableTimerForm";
import { Timer, Attribute } from "./utils/types";
import { uuid } from "./utils/uuid";

const initialState = [
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
];

const App: React.FC<{}> = () => {
  const [timers, setTimers] = useState<Timer[]>(initialState);
  const intervalId = useRef(-1);

  useEffect(() => {
    const TIME_INTERVAL = 1000;

    intervalId.current = setInterval(() => {
      setTimers(timers =>
        timers.map(timer => {
          const { elapsed, isRunning } = timer;

          return {
            ...timer,
            elapsed: isRunning ? elapsed + TIME_INTERVAL : elapsed
          };
        })
      );
    }, TIME_INTERVAL);

    return () => {
      clearInterval(intervalId.current);
    };
  }, []);

  const handleCreateFormSubmit = (timer: Timer) => {
    setTimers(timers => [newTimer(timer), ...timers]);
  };

  const handleFormSubmit = (attrs: Attribute) => {
    setTimers(
      timers =>
        timers.map(timer => {
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
    );
  };

  const handleRemovePress = (timerId: string) => {
    setTimers(timers => timers.filter(t => t.id !== timerId));
  };

  const toggleTimer = (timerId: string) => {
    setTimers(timers =>
      timers.map(timer => {
        const { id, isRunning } = timer;

        if (id === timerId) {
          return {
            ...timer,
            isRunning: !isRunning
          };
        }

        return timer;
      })
    );
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Timers</Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.timerListContainer}
      >
        <ScrollView contentContainerStyle={styles.timerList}>
          <ToggleableTimerForm onFormSubmit={handleCreateFormSubmit} />
          {timers.map(({ title, project, id, elapsed, isRunning }) => (
            <EditableTimer
              key={id}
              id={id}
              title={title}
              project={project}
              elapsed={elapsed}
              isRunning={isRunning}
              onFormSubmit={handleFormSubmit}
              onRemovePress={handleRemovePress}
              onStartPress={toggleTimer}
              onStopPress={toggleTimer}
            />
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

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

export default App;
