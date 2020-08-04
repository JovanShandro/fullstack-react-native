import React, { useState, useRef, useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, ImageStyle } from "react-native";
import * as MediaLibrary from "expo-media-library";
import Grid from "./Grid";
import { GridRenderItem, ImageType } from "../utils/types";

interface Props {
  onPressImage(uri: string): void;
}

const keyExtractor = ({ uri }: { uri: string }) => uri;

const ImageGrid: React.FC<Props> = ({ onPressImage }) => {
  const [images, setImages] = useState<ImageType[]>([]);
  const loading = useRef(false);
  const cursor = useRef<any>(null);
  const hasNextPage = useRef(false);
  const endCursor = useRef<any>(null);

  useEffect(() => {
    getImages(cursor.current);
  }, []);

  useEffect(() => {
    loading.current = false;
    cursor.current = (hasNextPage.current ? endCursor.current : "") as string;
  }, [images]);

  const getImages = async (after: any) => {
    if (loading.current) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      console.log("Camera roll permission denied");
      return;
    }

    loading.current = true;

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

    const { assets } = results;
    endCursor.current = results.endCursor;
    hasNextPage.current = results.hasNextPage;

    setImages(images => images.concat(assets));
  };

  const getNextImages = () => {
    // Prevent loading the initial page after we've reached the end
    if (!cursor.current) return;

    getImages(cursor.current);
  };

  const renderItem = ({
    item: { uri },
    size,
    marginTop,
    marginLeft
  }: GridRenderItem) => {
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

  return (
    <Grid
      data={images}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      onEndReached={getNextImages}
    />
  );
};

interface Style {
  image: ImageStyle;
}

const styles = StyleSheet.create<Style>({
  image: {
    flex: 1
  }
});

export default ImageGrid;
