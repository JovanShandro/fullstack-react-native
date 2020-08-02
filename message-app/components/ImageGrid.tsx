import React from "react";
import { Image, StyleSheet, TouchableOpacity, ImageStyle } from "react-native";
import * as MediaLibrary from "expo-media-library";
import Grid from "./Grid";
import { GridRenderItem, ImageType } from "../utils/types";

const uri = require("../assets/favicon.png");

interface Props {
  onPressImage(uri: string): void;
}

interface State {
  images: ImageType[];
}

const keyExtractor = ({ uri }: { uri: string }) => uri;

export default class ImageGrid extends React.Component<Props, State> {
  static defaultProps: Props = {
    onPressImage: () => {}
  };

  // eslint-disable-next-line react/sort-comp
  loading = false;
  cursor: any = null;

  state: State = {
    images: []
  };

  UNSAFE_componentDidMount() {
    this.getImages(this.cursor);
  }

  getImages = async (after: any) => {
    if (this.loading) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      console.log("Camera roll permission denied");
      return;
    }

    console.log(status);

    this.loading = true;

    let results: any;

    try {
      results = await MediaLibrary.getAssetsAsync({
        first: 20,
        after
      });
    } catch (e) {
      /* handle error */
      console.log(e.message);
      return;
    }

    const { assets, endCursor, hasNextPage } = results;

    this.setState(
      {
        images: this.state.images.concat(assets)
      },
      () => {
        this.loading = false;
        this.cursor = (hasNextPage ? endCursor : "") as string;
      }
    );
  };

  getNextImages = () => {
    // Prevent loading the initial page after we've reached the end
    if (!this.cursor) return;

    this.getImages(this.cursor);
  };

  renderItem = ({
    item: { uri },
    size,
    marginTop,
    marginLeft
  }: GridRenderItem) => {
    const { onPressImage } = this.props;

    const style = {
      width: size,
      height: size,
      marginLeft,
      marginTop
    };

    return (
      <TouchableOpacity
        key={uri}
        activeOpacity={0.75}
        onPress={() => onPressImage(uri)}
        style={style}
      >
        <Image source={{ uri }} style={styles.image} />
      </TouchableOpacity>
    );
  };

  render() {
    const { images } = this.state;

    return (
      <Grid
        data={images}
        renderItem={this.renderItem}
        keyExtractor={keyExtractor}
        onEndReached={this.getNextImages}
      />
    );
  }
}

interface Style {
  image: ImageStyle;
}

const styles = StyleSheet.create<Style>({
  image: {
    flex: 1
  }
});
