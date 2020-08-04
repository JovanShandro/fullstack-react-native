import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle
} from "react-native";

interface ButtonProps {
  title: string;
  onPress(): void;
}

const ToolbarButton = ({ title, onPress }: ButtonProps) => (
  <TouchableOpacity onPress={onPress}>
    <Text style={styles.button}>{title}</Text>
  </TouchableOpacity>
);

interface Props {
  isFocused: boolean;
  onChangeFocus(focus: boolean): void;
  onSubmit(text: string): void;
  onPressCamera(): void;
  onPressLocation(): void;
}

const Toolbar: React.FC<Props> = ({
  onChangeFocus,
  onPressCamera,
  onPressLocation,
  onSubmit,
  isFocused
}) => {
  const [text, setText] = useState("");
  const prevIsFocused = useRef(isFocused);
  const input = useRef<TextInput | null>(null);

  useEffect(() => {
    if (isFocused !== prevIsFocused.current) {
      if (isFocused) {
        input.current?.focus();
      } else {
        input.current?.blur();
      }
    }

    prevIsFocused.current = isFocused;
  }, [isFocused]);

  const handleFocus = () => {
    onChangeFocus(true);
  };

  const handleBlur = () => {
    onChangeFocus(false);
  };

  const handleChangeText = (text: string) => {
    setText(text);
  };

  const handleSubmitEditing = () => {
    if (!text) return; // Don't submit if empty

    onSubmit(text);
    setText(text);
  };

  return (
    <View style={styles.toolbar}>
      <ToolbarButton title={"📷"} onPress={onPressCamera} />
      <ToolbarButton title={"📍"} onPress={onPressLocation} />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          underlineColorAndroid={"transparent"}
          placeholder={"Type something!"}
          blurOnSubmit={false}
          value={text}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmitEditing}
          ref={input}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
    </View>
  );
};

interface Style {
  toolbar: ViewStyle;
  inputContainer: ViewStyle;
  input: ViewStyle;
  button: TextStyle;
}

const styles = StyleSheet.create<Style>({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingLeft: 16,
    backgroundColor: "white",
    marginBottom: 20
  },
  inputContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.04)",
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)"
  },
  input: {
    flex: 1,
    fontSize: 18
  },
  button: {
    top: -2,
    marginRight: 12,
    fontSize: 20,
    color: "grey"
  }
});

export default Toolbar;
