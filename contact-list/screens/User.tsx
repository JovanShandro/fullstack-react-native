import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ViewStyle
} from "react-native";
import ContactThumbnail from "../components/ContactThumbnail";
import colors from "../utils/colors";
import { fetchUserContact } from "../utils/api";
import store from "../store";
import { MappedContact, Subscription } from "../utils/types";

interface State {
  user?: MappedContact | {};
  loading?: boolean;
  error?: boolean;
}

export default class User extends React.Component<{}, State> {
  state: State = {
    user: store.getState().user,
    loading: store.getState().isFetchingUser,
    error: store.getState().error
  };

  unsubscribe: Subscription = () => [];

  async componentDidMount() {
    this.unsubscribe = store.onChange(() =>
      this.setState({
        user: store.getState().user,
        loading: store.getState().isFetchingUser,
        error: store.getState().error
      })
    );

    const user = await fetchUserContact();

    store.setState({ user, isFetchingUser: false });
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    const { user, loading, error } = this.state;
    const { avatar, name, phone } = user as MappedContact;

    return (
      <View style={styles.container}>
        {loading && <ActivityIndicator size="large" />}
        {error && <Text>Error...</Text>}

        {!loading && (
          <ContactThumbnail avatar={avatar} name={name} phone={phone} />
        )}
      </View>
    );
  }
}

interface Style {
  container: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.blue
  }
});
