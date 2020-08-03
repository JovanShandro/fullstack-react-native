import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, SafeAreaView, ViewStyle } from "react-native";
import { fetchImages } from "../utils/api";
import CardList from "../components/CardList";
import { CommentsForItem, ImageArray } from "../utils/types";

type Props = {
  commentsForItem: CommentsForItem;
  onPressComments(id: number): void;
  style: ViewStyle | null;
};

const Feed: React.FC<Props> = ({
  style = null,
  commentsForItem,
  onPressComments
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [items, setItems] = useState<ImageArray>([]);

  useEffect(() => {
    handleAsync();
  }, []);

  const handleAsync = async () => {
    try {
      const items = await fetchImages();

      setLoading(false);
      setItems(items);
    } catch (e) {
      setLoading(false);
      setError(true);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error...</Text>;
  }

  return (
    <SafeAreaView style={style}>
      <CardList
        items={items}
        commentsForItem={commentsForItem}
        onPressComments={onPressComments}
      />
    </SafeAreaView>
  );
};

export default Feed;
