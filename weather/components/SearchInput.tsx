import React, { useState } from "react";
import { StyleSheet, TextInput, View, ViewStyle } from "react-native";

interface Props {
  onSubmit(city: string): void;
  placeholder: string;
}

const SearchInput = ({ onSubmit, placeholder = "" }: Props) => {
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
        autoCorrect={false}
        value={text}
        placeholder={placeholder}
        placeholderTextColor="white"
        underlineColorAndroid="transparent"
        style={styles.textInput}
        clearButtonMode="always"
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmitEditing}
      />
    </View>
  );
};

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

export default SearchInput;
