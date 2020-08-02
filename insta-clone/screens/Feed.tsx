import React from "react";
import { ActivityIndicator, Text, SafeAreaView, ViewStyle } from "react-native";
import { fetchImages } from "../utils/api";
import CardList from "../components/CardList";
import { CommentsForItem, ImageArray } from "../utils/types";

type Props = {
  commentsForItem: CommentsForItem;
  onPressComments(id: number): void;
} & DefaultProps;

type DefaultProps = {
  style: ViewStyle | null;
};

interface State {
  loading: boolean;
  error: boolean;
  items: ImageArray;
}

export default class Feed extends React.Component<Props, State> {
  static defaultProps: DefaultProps = {
    style: null
  };

  state: State = {
    loading: true,
    error: false,
    items: []
  };

  async componentDidMount() {
    try {
      const items = await fetchImages();

      this.setState({
        loading: false,
        items
      });
    } catch (e) {
      this.setState({
        loading: false,
        error: true
      });
    }
  }

  render() {
    const { commentsForItem, onPressComments, style } = this.props;
    const { loading, error, items } = this.state;

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
  }
}
