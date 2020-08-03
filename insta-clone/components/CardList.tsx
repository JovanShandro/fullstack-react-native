import React from "react";
import { FlatList } from "react-native";
import Card from "./Card";
import { getImageFromId } from "../utils/api";
import { ImageArray, CommentsForItem } from "../utils/types";

interface Props {
  items: ImageArray;
  commentsForItem: CommentsForItem;
  onPressComments(id: number): void;
}

interface Item {
  item: {
    id: number;
    author: string;
  };
}

const keyExtractor = ({ id }: { id: number }) => id.toString();

const CardList: React.FC<Props> = ({
  items,
  commentsForItem,
  onPressComments
}) => {
  const renderItem = ({ item: { id, author } }: Item) => {
    const comments = commentsForItem[id];

    return (
      <Card
        fullname={author}
        image={{
          uri: getImageFromId(id)
        }}
        linkText={`${comments ? comments.length : 0} Comments`}
        onPressLinkText={() => onPressComments(id)}
      />
    );
  };

  return (
    <FlatList
      data={items}
      extraData={commentsForItem}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default CardList;
