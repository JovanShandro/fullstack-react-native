import React, { useState } from "react";
import { StyleSheet, ViewStyle, TextInput, View } from "react-native";

type Props = {
  onSubmit(text: string): void;
  placeholder?: string;
};

const CommentInput: React.FC<Props> = ({ placeholder = "", onSubmit }) => {
  const [text, setText] = useState("");

  const handleChangeText = (text: string) => {
    setText(text);
  };

  const handleSubmitEditing = () => {
    if (!text) return;

    onSubmit(text);
    setText("");
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        placeholder={placeholder}
        underlineColorAndroid="transparent"
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmitEditing}
      />
    </View>
  );
};

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

export default CommentInput;
