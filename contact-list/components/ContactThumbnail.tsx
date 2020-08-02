import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Text,
  ViewStyle,
  ImageStyle,
  TextStyle
} from "react-native";

interface Props {
  name?: string;
  phone?: string;
  avatar: string;
  textColor?: string;
  onPress?: () => void;
}

export default function ContactThumbnail({
  name = "",
  phone = "",
  avatar,
  textColor = "white",
  onPress
}: Props) {
  const colorStyle = {
    color: textColor
  };
  const ImageComponent = onPress ? TouchableOpacity : View;

  return (
    <View style={styles.container}>
      <ImageComponent onPress={onPress}>
        <Image
          source={{
            uri: avatar
          }}
          style={styles.avatar}
        />
      </ImageComponent>
      {name !== "" && <Text style={[styles.name, colorStyle]}>{name}</Text>}

      {phone !== "" && (
        <View style={styles.phoneSection}>
          <MaterialIcons name="phone" size={16} style={{ color: textColor }} />
          <Text style={[styles.phone, colorStyle]}>{phone}</Text>
        </View>
      )}
    </View>
  );
}

interface Style {
  container: ViewStyle;
  phoneSection: ViewStyle;
  avatar: ImageStyle;
  name: TextStyle;
  phone: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    paddingVertical: 30,
    marginHorizontal: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderColor: "white",
    borderWidth: 2
  },
  name: {
    fontSize: 20,
    marginTop: 24,
    marginBottom: 2,
    fontWeight: "bold"
  },
  phoneSection: {
    flexDirection: "row",
    marginTop: 4,
    alignItems: "center",
    justifyContent: "center"
  },
  phone: {
    marginLeft: 4,
    fontSize: 16,
    fontWeight: "bold"
  }
});
