import React, { RefObject } from "react";
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

interface State {
  text: string;
}

export default class Toolbar extends React.Component<Props, State> {
  state: State = {
    text: ""
  };

  input: RefObject<TextInput> = React.createRef<TextInput>();

  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.isFocused !== this.props.isFocused) {
      if (nextProps.isFocused) {
        this.input.current!.focus();
      } else {
        this.input.current!.blur();
      }
    }
  }

  handleFocus = () => {
    const { onChangeFocus } = this.props;

    onChangeFocus(true);
  };

  handleBlur = () => {
    const { onChangeFocus } = this.props;

    onChangeFocus(false);
  };

  handleChangeText = (text: string) => {
    this.setState({ text });
  };

  handleSubmitEditing = () => {
    const { onSubmit } = this.props;
    const { text } = this.state;

    if (!text) return; // Don't submit if empty

    onSubmit(text);
    this.setState({ text: "" });
  };

  render() {
    const { onPressCamera, onPressLocation } = this.props;
    const { text } = this.state;

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
            onChangeText={this.handleChangeText}
            onSubmitEditing={this.handleSubmitEditing}
            ref={this.input}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
          />
        </View>
      </View>
    );
  }
}

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
