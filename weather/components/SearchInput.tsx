import React from "react";
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";

type Props = {
  onSubmit(city: string): void;
} & Partial<DefaultProps>;

type DefaultProps = {
  placeholder: string;
};

interface State {
  text: string;
}

export default class SearchInput extends React.Component<Props, State> {
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
          autoCorrect={false}
          value={text}
          placeholder={placeholder}
          placeholderTextColor="white"
          underlineColorAndroid="transparent"
          style={styles.textInput}
          clearButtonMode="always"
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.handleSubmitEditing}
        />
      </View>
    );
  }
}

interface Style {
  textInput: ViewStyle;
  container: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    height: 40,
    marginTop: 20,
    backgroundColor: "#666",
    marginHorizontal: 40,
    paddingHorizontal: 10,
    borderRadius: 5
  },
  textInput: {
    flex: 1,
    color: "white"
  }
});
