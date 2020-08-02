import React, { useEffect, useState } from "react";
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

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(-1);
  const [commentsForItem, setCommentsForItem] = useState<CommentsForItem>({});

  useEffect(() => {
    handleAsync();
  }, []);

  const handleAsync = async () => {
    try {
      const commentsForItem = await AsyncStorage.getItem(
        ASYNC_STORAGE_COMMENTS_KEY
      );

      setCommentsForItem(commentsForItem ? JSON.parse(commentsForItem) : {});
    } catch (e) {
      console.log("Failed to load comments");
    }
  };

  const onSubmitComment = (text: string) => {
    const comments = commentsForItem[selectedItemId] || [];

    const updated = {
      ...commentsForItem,
      [selectedItemId]: [...comments, text]
    };

    setCommentsForItem(updated);

    try {
      AsyncStorage.setItem(ASYNC_STORAGE_COMMENTS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.log("Failed to save comment", text, "for", selectedItemId);
    }
  };

  const openCommentScreen = (id: number) => {
    setShowModal(true);
    setSelectedItemId(id);
  };

  const closeCommentScreen = () => {
    setShowModal(false);
    setSelectedItemId(-1);
  };

  return (
    <View style={styles.container}>
      <Feed
        style={styles.feed}
        commentsForItem={commentsForItem}
        onPressComments={openCommentScreen}
      />
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={closeCommentScreen}
      >
        <Comments
          style={styles.comments}
          comments={commentsForItem[selectedItemId] || []}
          onClose={closeCommentScreen}
          onSubmitComment={onSubmitComment}
        />
      </Modal>
    </View>
  );
};

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

export default App;
