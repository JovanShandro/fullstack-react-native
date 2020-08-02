import React from "react";
import { StyleSheet, ViewStyle, TextInput, View } from "react-native";

type Props = {
  onSubmit(text: string): void;
} & DefaultProps;

type DefaultProps = { placeholder?: string };

interface State {
  text: string;
}

export default class CommentInput extends React.Component<Props, State> {
  static defaultProps: DefaultProps = {
    placeholder: ""
  };

  state: State = {
    text: ""
  };

  handleChangeText = (text: string) => {
    this.setState({ text });
  };

  handleSubmitEditing = () => {
    const { onSubmit } = this.props;
    const { text } = this.state;

    if (!text) return;

    onSubmit(text);
    this.setState({ text: "" });
  };

  render() {
    const { placeholder } = this.props;
    const { text } = this.state;

    return (
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          value={text}
          placeholder={placeholder}
          underlineColorAndroid="transparent"
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.handleSubmitEditing}
        />
      </View>
    );
  }
}

interface Style {
  container: ViewStyle;
  input: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingHorizontal: 20,
    height: 60
  },
  input: {
    flex: 1
  }
});
