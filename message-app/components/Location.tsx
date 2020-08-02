import React from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import { Coordinate } from "../utils/types";

interface State {
  coords: Coordinate | null;
  error: PositionError | null;
}

export default class Location extends React.Component<{}, State> {
  state: State = {
    coords: null,
    error: null
  };

  UNSAFE_componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.handleChange,
      this.handleError
    );
    navigator.geolocation.watchPosition(this.handleChange, this.handleError);
  }

  handleChange = (location: { coords: Coordinate }) => {
    this.setState({
      coords: location.coords,
      error: null
    });
  };

  handleError: PositionErrorCallback = (error: PositionError) => {
    this.setState({ error });
  };

  render() {
    const { coords, error } = this.state;

    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          Geolocation:
          {coords ? `${coords.latitude}, ${coords.longitude}` : error}
        </Text>
      </View>
    );
  }
}

interface Style {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {},
  text: {
    color: "blue"
  }
});
