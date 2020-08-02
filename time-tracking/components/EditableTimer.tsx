import React from "react";
import Timer from "./Timer";
import TimerForm from "./TimerForm";
import { Timer as TimerType, Attribute } from "../utils/types";

type Props = {
  onFormSubmit(attrs: Attribute): void;
  onRemovePress(timerId: string): void;
  onStartPress(timerId: string): void;
  onStopPress(timerId: string): void;
} & TimerType;

interface State {
  editFormOpen: boolean;
}

export default class EditableTimer extends React.Component<Props, State> {
  state: State = {
    editFormOpen: false
  };

  handleEditPress = () => {
    this.openForm();
  };

  handleFormClose = () => {
    this.closeForm();
  };

  handleSubmit = (attrs: Attribute) => {
    const { onFormSubmit } = this.props;

    onFormSubmit(attrs);
    this.closeForm();
  };

  closeForm = () => {
    this.setState({ editFormOpen: false });
  };

  openForm = () => {
    this.setState({ editFormOpen: true });
  };

  render() {
    const {
      id,
      title,
      project,
      elapsed,
      isRunning,
      onRemovePress,
      onStartPress,
      onStopPress
    } = this.props;
    const { editFormOpen } = this.state;

    if (editFormOpen) {
      return (
        <TimerForm
          id={id}
          title={title}
          project={project}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    }

    return (
      <Timer
        id={id}
        title={title}
        project={project}
        elapsed={elapsed}
        isRunning={isRunning}
        onEditPress={this.handleEditPress}
        onRemovePress={onRemovePress}
        onStartPress={onStartPress}
        onStopPress={onStopPress}
      />
    );
  }
}
