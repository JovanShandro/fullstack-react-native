import React from "react";
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
} & DefaultProps;

type DefaultProps = {
  id: string;
  title?: string;
  project?: string;
};

type State = {
  title: string;
  project: string;
};

export default class TimerForm extends React.Component<Props, State> {
  static defaultProps: DefaultProps = {
    id: "",
    title: "",
    project: ""
  };

  constructor(props: Props) {
    super(props);

    const { id, title, project } = props;

    this.state = {
      title: (id ? title : "") as string,
      project: (id ? project : "") as string
    };
  }

  handleTitleChange = (title: string) => {
    this.setState({ title });
  };

  handleProjectChange = (project: string) => {
    this.setState({ project });
  };

  handleSubmit = () => {
    const { onFormSubmit, id } = this.props;
    const { title, project } = this.state;

    onFormSubmit({
      id,
      title,
      project
    });
  };

  render() {
    const { id, onFormClose } = this.props;
    const { title, project } = this.state;

    const submitText = id ? "Update" : "Create";

    return (
      <View style={styles.formContainer}>
        <View style={styles.attributeContainer}>
          <Text style={styles.textInputTitle}>Title</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="transparent"
              onChangeText={this.handleTitleChange}
              value={title}
            />
          </View>
        </View>
        <View style={styles.attributeContainer}>
          <Text style={styles.textInputTitle}>Project</Text>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              underlineColorAndroid="transparent"
              onChangeText={this.handleProjectChange}
              value={project}
            />
          </View>
        </View>
        <View style={styles.buttonGroup}>
          <TimerButton
            small
            color="#21BA45"
            title={submitText}
            onPress={this.handleSubmit}
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
  }
}

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
