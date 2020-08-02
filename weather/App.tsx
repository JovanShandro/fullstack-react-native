import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  ViewStyle,
  ImageStyle,
  TextStyle
} from "react-native";
import { fetchLocationId, fetchWeather } from "./utils/api";
import getImageForWeather from "./utils/getImageForWeather";
import SearchInput from "./components/SearchInput";
import { weather_type, fetchWeatherResponse } from "./utils/types";

const App = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState(0);
  const [weather, setWeather] = useState<weather_type>("Clear"); // just a default value that will be overwritten

  useEffect(() => {
    handleUpdateLocation("San Francisco");
  }, []);

  useEffect(() => {
    handleAsync();
  }, [loading, city]);

  const handleAsync = async () => {
    try {
      const locationId: number = await fetchLocationId(city);
      const {
        location,
        weather,
        temperature
      }: fetchWeatherResponse = await fetchWeather(locationId);

      setLoading(false);
      setError(false);
      setLocation(location);
      setWeather(weather);
      setTemperature(temperature);
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  const handleUpdateLocation = async (city: string) => {
    if (!city) return;

    setLoading(true);
    setCity(city);
  };

  return (
    <TouchableWithoutFeedback
      style={styles.container}
      onPress={() => Keyboard.dismiss()}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == "ios" ? "padding" : "height"}
      >
        <StatusBar barStyle="light-content" />
        <ImageBackground
          source={getImageForWeather(weather)}
          style={styles.imageContainer}
          imageStyle={styles.image}
        >
          <View style={styles.detailsContainer}>
            <ActivityIndicator animating={loading} color="white" size="large" />

            {!loading && (
              <View>
                {error && (
                  <Text style={[styles.smallText, styles.textStyle]}>
                    Could not load weather, please try a different city.
                  </Text>
                )}

                {!error && (
                  <View>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {location}
                    </Text>
                    <Text style={[styles.smallText, styles.textStyle]}>
                      {weather}
                    </Text>
                    <Text style={[styles.largeText, styles.textStyle]}>
                      {`${Math.round(temperature)}°`}
                    </Text>
                  </View>
                )}

                <SearchInput onSubmit={handleUpdateLocation} />
              </View>
            )}
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

interface Style {
  container: ViewStyle;
  imageContainer: ViewStyle;
  image: ImageStyle;
  detailsContainer: ViewStyle;
  textStyle: TextStyle;
  largeText: TextStyle;
  smallText: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: "#34495E"
  },
  imageContainer: {
    flex: 1
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: "cover"
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 20
  },
  textStyle: {
    textAlign: "center",
    fontFamily: Platform.OS === "ios" ? "AvenirNext-Regular" : "Roboto",
    color: "white"
  },
  largeText: {
    fontSize: 44
  },
  smallText: {
    fontSize: 18
  }
});

export default App;
