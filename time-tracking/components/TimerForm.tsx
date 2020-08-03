import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TextStyle,
  ViewStyle
} from "react-native";
import TimerButton from "./TimerButton";
import { Attribute } from "../utils/types";

type Props = {
  onFormSubmit(attrs: Attribute): void;
  onFormClose(): void;
  id?: string;
  title?: string;
  project?: string;
};

const TimerForm: React.FC<Props> = ({
  id = "",
  title = "",
  project = "",
  onFormSubmit,
  onFormClose
}) => {
  const [titleState, setTitle] = useState(id ? title : "");
  const [projectState, setProject] = useState(id ? project : "");

  const handleTitleChange = (title: string) => {
    setTitle(title);
  };

  const handleProjectChange = (project: string) => {
    setProject(project);
  };

  const handleSubmit = () => {
    onFormSubmit({
      id,
      title: titleState,
      project: projectState
    });
  };

  const submitText = id ? "Update" : "Create";

  return (
    <View style={styles.formContainer}>
      <View style={styles.attributeContainer}>
        <Text style={styles.textInputTitle}>Title</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            onChangeText={handleTitleChange}
            value={titleState}
          />
        </View>
      </View>
      <View style={styles.attributeContainer}>
        <Text style={styles.textInputTitle}>Project</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            underlineColorAndroid="transparent"
            onChangeText={handleProjectChange}
            value={projectState}
          />
        </View>
      </View>
      <View style={styles.buttonGroup}>
        <TimerButton
          small
          color="#21BA45"
          title={submitText}
          onPress={handleSubmit}
        />
        <TimerButton
          small
          color="#DB2828"
          title="Cancel"
          onPress={onFormClose}
        />
      </View>
    </View>
  );
};

interface Style {
  textInputTitle: TextStyle;
  formContainer: ViewStyle;
  attributeContainer: ViewStyle;
  textInputContainer: ViewStyle;
  textInput: ViewStyle;
  buttonGroup: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  formContainer: {
    backgroundColor: "white",
    borderColor: "#D6D7DA",
    borderWidth: 2,
    borderRadius: 10,
    padding: 15,
    margin: 15,
    marginBottom: 0
  },
  attributeContainer: {
    marginVertical: 8
  },
  textInputContainer: {
    borderColor: "#D6D7DA",
    borderRadius: 2,
    borderWidth: 1,
    marginBottom: 5
  },
  textInput: {
    height: 30,
    padding: 5,
    fontSize: 12
  },
  textInputTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 5
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default TimerForm;
