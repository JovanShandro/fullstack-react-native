import {
  StyleSheet,
  ViewStyle,
  TextStyle,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import React from "react";
import Avatar from "./Avatar";
import getAvatarColor from "../utils/getAvatarColor";
import getInitials from "../utils/getInitials";

interface Props {
  fullname: string;
  linkText: string;
  onPressLinkText(): void;
}

export default function AuthorRow({
  fullname,
  linkText,
  onPressLinkText
}: Props) {
  return (
    <View style={styles.container}>
      <Avatar
        size={35}
        initials={getInitials(fullname)}
        backgroundColor={getAvatarColor(fullname)}
      />
      <Text style={styles.text} numberOfLines={1}>
        {fullname}
      </Text>
      {!!linkText && (
        <TouchableOpacity onPress={onPressLinkText}>
          <Text numberOfLines={1}>{linkText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

interface Style {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10
  },
  text: {
    flex: 1,
    marginHorizontal: 6
  }
});
