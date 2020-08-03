import React from "react";
import {
  StyleSheet,
  View,
  TouchableHighlight,
  Text,
  Image,
  ViewStyle,
  ImageStyle,
  TextStyle
} from "react-native";
import colors from "../utils/colors";

interface Props {
  name: string;
  avatar: string;
  phone: string;
  onPress(): void;
}

const ContactListItem: React.FC<Props> = ({ name, avatar, phone, onPress }) => (
  <TouchableHighlight
    underlayColor={colors.grey}
    style={styles.container}
    onPress={onPress}
  >
    <View style={styles.contactInfo}>
      <Image
        style={styles.avatar}
        source={{
          uri: avatar
        }}
      />

      <View style={styles.details}>
        <Text style={[styles.title]}>{name}</Text>
        <Text style={styles.subtitle}>{phone}</Text>
      </View>
    </View>
  </TouchableHighlight>
);

interface Style {
  container: ViewStyle;
  contactInfo: ViewStyle;
  avatar: ImageStyle;
  details: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    paddingLeft: 24
  },
  contactInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 16,
    paddingRight: 24,
    borderBottomColor: colors.grey,
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  avatar: {
    borderRadius: 22,
    width: 44,
    height: 44
  },
  details: {
    justifyContent: "center",
    flex: 1,
    marginLeft: 20
  },
  title: {
    color: colors.black,
    fontWeight: "bold",
    fontSize: 16
  },
  subtitle: {
    color: colors.blue,
    fontSize: 15,
    marginTop: 4
  }
});

export default ContactListItem;
