import React from "react";
import { Image, StyleSheet, ImageStyle } from "react-native";

const logo = require("../assets/logo.png");

const Logo = () => {
  return <Image style={styles.image} source={logo} />;
};

interface Style {
  image: ImageStyle;
}

const styles = StyleSheet.create<Style>({
  image: {
    width: null as any,
    height: null as any,
    resizeMode: "contain",
    aspectRatio: 285 / 84
  }
});

export default Logo;
