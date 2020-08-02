import React from "react";
import {
  Dimensions,
  ListRenderItem,
  FlatList,
  PixelRatio,
  StyleSheet,
  ListRenderItemInfo
} from "react-native";
import { GridRenderItem, ImageType } from "../utils/types";

type Props = {
  renderItem(info: GridRenderItem): React.ReactElement<any>;
  data: ImageType[];
  keyExtractor(item: { uri: string }): string;
  onEndReached(): void;
} & DefaultProps;

type DefaultProps = {
  numColumns?: number;
  itemMargin?: number;
};

export default class Grid extends React.Component<Props, {}> {
  static defaultProps: DefaultProps = {
    numColumns: 4,
    itemMargin: StyleSheet.hairlineWidth
  };

  renderGridItem: ListRenderItem<ImageType> = (
    info: ListRenderItemInfo<ImageType>
  ): React.ReactElement<any> => {
    const { index } = info;
    const { renderItem, numColumns, itemMargin } = this.props;

    // We want to get the device width on render, in case the device is rotated
    const { width } = Dimensions.get("window");

    // Fix visual inconsistencies by aligning to the nearest pixel
    const size = PixelRatio.roundToNearestPixel(
      (width - (itemMargin as number) * ((numColumns as number) - 1)) /
        (numColumns as number)
    );

    const marginTop =
      index < (numColumns as number) ? 0 : (itemMargin as number);
    const marginLeft =
      index % (numColumns as number) === 0 ? 0 : (itemMargin as number);

    return renderItem({ ...info, size, marginLeft, marginTop });
  };

  render() {
    return (
      <FlatList
        {...this.props}
        renderItem={this.renderGridItem as ListRenderItem<ImageType>}
      />
    );
  }
}
