import React from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
  ImageStyle
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { MessageShape } from "../utils/types";

type DefaultProps = {
  onPressMessage(item: MessageShape): void;
};

type Props = {
  messages: MessageShape[];
} & DefaultProps;

const keyExtractor = (item: { id: number }) => item.id.toString();

export default class MessageList extends React.Component<Props, {}> {
  static defaultProps: DefaultProps = {
    onPressMessage: () => {}
  };

  renderMessageBody = ({ type, text, uri, coordinate }: MessageShape) => {
    switch (type) {
      case "text":
        return (
          <View style={styles.messageBubble}>
            <Text style={styles.text}>{text}</Text>
          </View>
        );
      case "image":
        return <Image style={styles.image} source={{ uri }} />;
      case "location":
        return (
          <MapView
            style={styles.map}
            initialRegion={{
              ...coordinate!,
              latitudeDelta: 0.08,
              longitudeDelta: 0.04
            }}
          >
            <Marker coordinate={coordinate!} />
          </MapView>
        );
      default:
        return null;
    }
  };

  renderMessageItem = ({ item }: { item: MessageShape }) => {
    const { onPressMessage } = this.props;

    return (
      <View key={item.id} style={styles.messageRow}>
        <TouchableOpacity onPress={() => onPressMessage(item)}>
          {this.renderMessageBody(item)}
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { messages } = this.props;

    return (
      <FlatList
        style={styles.container}
        inverted
        data={messages}
        renderItem={this.renderMessageItem}
        keyExtractor={keyExtractor}
        keyboardShouldPersistTaps={"handled"}
      />
    );
  }
}

interface Style {
  container: ViewStyle;
  messageRow: ViewStyle;
  messageBubble: ViewStyle;
  text: TextStyle;
  image: ImageStyle;
  map: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    overflow: "visible" // Prevents clipping on resize!
  },
  messageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
    marginRight: 10,
    marginLeft: 60
  },
  messageBubble: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgb(16,135,255)",
    borderRadius: 20
  },
  text: {
    fontSize: 18,
    color: "white"
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10
  },
  map: {
    width: 250,
    height: 250,
    borderRadius: 10
  }
});
