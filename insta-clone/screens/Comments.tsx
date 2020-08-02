import { SafeAreaView, ViewStyle } from "react-native";
import React from "react";
import CommentInput from "../components/CommentInput";
import CommentList from "../components/CommentList";
import NavigationBar from "../components/NavigationBar";

interface Props {
  comments: string[];
  onClose(): void;
  onSubmitComment(text: string): void;
  style: ViewStyle | null;
}

export default function Comments({
  comments,
  onClose,
  onSubmitComment,
  style = null
}: Props) {
  return (
    <SafeAreaView style={style}>
      <NavigationBar
        title="Comments"
        leftText="Close"
        onPressLeftText={onClose}
      />
      <CommentInput placeholder="Leave a comment" onSubmit={onSubmitComment} />
      <CommentList items={comments} />
    </SafeAreaView>
  );
}
