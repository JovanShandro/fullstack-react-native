import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ViewStyle, TextStyle } from "react-native";
import { Coordinate } from "../utils/types";

const Location = () => {
  const [coords, setCoords] = useState<Coordinate | null>(null);
  const [error, setError] = useState<PositionError | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(handleChange, handleError);
    navigator.geolocation.watchPosition(handleChange, handleError);
  }, []);

  const handleChange = (location: { coords: Coordinate }) => {
    setCoords(location.coords);
    setError(null);
  };

  const handleError: PositionErrorCallback = (error: PositionError) => {
    setError(error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Geolocation:
        {coords ? `${coords.latitude}, ${coords.longitude}` : error}
      </Text>
    </View>
  );
};

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

export default Location;
