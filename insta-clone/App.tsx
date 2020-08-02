import React from "react";
import {
  AsyncStorage,
  Modal,
  Platform,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import Constants from "expo-constants";
import Comments from "./screens/Comments";
import Feed from "./screens/Feed";
import { CommentsForItem } from "./utils/types";

const ASYNC_STORAGE_COMMENTS_KEY = "ASYNC_STORAGE_COMMENTS_KEY";

type State = {
  showModal: boolean;
  selectedItemId: number;
  commentsForItem: CommentsForItem;
};

export default class App extends React.Component<{}, State> {
  state: State = {
    commentsForItem: {},
    showModal: false,
    selectedItemId: -1
  };

  async componentDidMount() {
    try {
      const commentsForItem = await AsyncStorage.getItem(
        ASYNC_STORAGE_COMMENTS_KEY
      );

      this.setState({
        commentsForItem: commentsForItem ? JSON.parse(commentsForItem) : {}
      });
    } catch (e) {
      console.log("Failed to load comments");
    }
  }

  onSubmitComment = (text: string) => {
    const { selectedItemId, commentsForItem } = this.state;
    const comments = commentsForItem[selectedItemId] || [];

    const updated = {
      ...commentsForItem,
      [selectedItemId]: [...comments, text]
    };

    this.setState({ commentsForItem: updated });

    try {
      AsyncStorage.setItem(ASYNC_STORAGE_COMMENTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log("Failed to save comment", text, "for", selectedItemId);
    }
  };

  openCommentScreen = (id: number) => {
    this.setState({
      showModal: true,
      selectedItemId: id
    });
  };

  closeCommentScreen = () => {
    this.setState({
      showModal: false,
      selectedItemId: -1
    });
  };

  render() {
    const { commentsForItem, showModal, selectedItemId } = this.state;

    return (
      <View style={styles.container}>
        <Feed
          style={styles.feed}
          commentsForItem={commentsForItem}
          onPressComments={this.openCommentScreen}
        />
        <Modal
          visible={showModal}
          animationType="slide"
          onRequestClose={this.closeCommentScreen}
        >
          <Comments
            style={styles.comments}
            comments={commentsForItem[selectedItemId] || []}
            onClose={this.closeCommentScreen}
            onSubmitComment={this.onSubmitComment}
          />
        </Modal>
      </View>
    );
  }
}

const platformVersion =
  Platform.OS === "ios"
    ? parseInt(Platform.Version as string, 10)
    : Platform.Version;

interface Style {
  container: ViewStyle;
  feed: ViewStyle;
  comments: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  feed: {
    flex: 1,
    marginTop:
      Platform.OS === "android" || platformVersion < 11
        ? Constants.statusBarHeight
        : 0
  },
  comments: {
    flex: 1,
    marginTop:
      Platform.OS === "ios" && platformVersion < 11
        ? Constants.statusBarHeight
        : 0
  }
});
