import React from "react";
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

interface State {
  loading: boolean;
  error: boolean;
  location: string;
  temperature: number;
  weather: weather_type;
}

export default class App extends React.Component<{}, State> {
  state: State = {
    loading: false,
    error: false,
    location: "",
    temperature: 0,
    weather: "Clear" // just a default value that will be overwritten
  };

  componentDidMount() {
    this.handleUpdateLocation("San Francisco");
  }

  handleUpdateLocation = async (city: string) => {
    if (!city) return;

    this.setState({ loading: true }, async () => {
      try {
        const locationId: number = await fetchLocationId(city);
        const {
          location,
          weather,
          temperature
        }: fetchWeatherResponse = await fetchWeather(locationId);

        this.setState({
          loading: false,
          error: false,
          location,
          weather,
          temperature
        });
      } catch (e) {
        this.setState({
          loading: false,
          error: true
        });
      }
    });
  };

  render() {
    const { loading, error, location, weather, temperature } = this.state;

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
              <ActivityIndicator
                animating={loading}
                color="white"
                size="large"
              />

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

                  <SearchInput onSubmit={this.handleUpdateLocation} />
                </View>
              )}
            </View>
          </ImageBackground>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  }
}

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
