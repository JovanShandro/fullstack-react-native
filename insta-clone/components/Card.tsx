import {
  ActivityIndicator,
  Image,
  ImageStyle,
  StyleSheet,
  View
} from "react-native";
import React from "react";
import AuthorRow from "./AuthorRow";

interface Props {
  fullname: string;
  image: { uri: string };
  linkText: string;
  onPressLinkText(): void;
}

interface State {
  loading: boolean;
}

export default class Card extends React.Component<Props, State> {
  state: State = {
    loading: true
  };

  handleLoad = () => {
    this.setState({ loading: false });
  };

  render() {
    const { fullname, image, linkText, onPressLinkText } = this.props;
    const { loading } = this.state;

    return (
      <View>
        <AuthorRow
          fullname={fullname}
          linkText={linkText}
          onPressLinkText={onPressLinkText}
        />
        <View style={styles.image}>
          {loading && (
            <ActivityIndicator style={StyleSheet.absoluteFill} size={"large"} />
          )}
          <Image
            style={StyleSheet.absoluteFill}
            source={image}
            onLoad={this.handleLoad}
          />
        </View>
      </View>
    );
  }
}

interface Style {
  image: ImageStyle;
}

const styles = StyleSheet.create<Style>({
  image: {
    aspectRatio: 1,
    backgroundColor: "rgba(0,0,0,0.02)"
  }
});
