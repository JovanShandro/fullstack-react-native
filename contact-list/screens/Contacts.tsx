import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  ViewStyle
} from "react-native";
import * as Linking from "expo-linking";
import ContactListItem from "../components/ContactListItem";
import { fetchContacts } from "../utils/api";
import getURLParams from "../utils/getURLParams";
import store from "../store";
import { MappedContact, Subscription } from "../utils/types";

interface State {
  contacts: MappedContact[];
  loading: boolean;
  error?: boolean;
}

interface Props {
  navigation: {
    navigate(path: string, params: {}): void;
  };
}

const keyExtractor = ({ phone }: { phone: string }) => phone;

export default class Contacts extends React.Component<Props, State> {
  state: State = {
    contacts: store.getState().contacts,
    loading: store.getState().isFetchingContacts,
    error: store.getState().error
  };

  unsubscribe: Subscription = () => [];

  async componentDidMount() {
    this.unsubscribe = store.onChange(() =>
      this.setState({
        contacts: store.getState().contacts,
        loading: store.getState().isFetchingContacts,
        error: store.getState().error
      })
    );

    const contacts = await fetchContacts();

    store.setState({ contacts, isFetchingContacts: false });

    Linking.addEventListener("url", this.handleOpenUrl);

    const url = (await Linking.getInitialURL()) as string;
    this.handleOpenUrl({ url });
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenUrl);
    this.unsubscribe();
  }

  handleOpenUrl(event: { url: string }) {
    const {
      navigation: { navigate }
    } = this.props;
    const { url } = event;
    const params = getURLParams(url);

    if (params.name) {
      const queriedContact = store
        .getState()
        .contacts.find(
          contact =>
            contact.name.split(" ")[0].toLowerCase() ===
            params.name.toLowerCase()
        );

      if (queriedContact) {
        navigate("Profile", { id: queriedContact.id });
      }
    }
  }

  renderContact = ({ item }: { item: MappedContact }) => {
    const {
      navigation: { navigate }
    } = this.props;
    const { id, name, avatar, phone } = item;

    return (
      <ContactListItem
        name={name}
        avatar={avatar}
        phone={phone}
        onPress={() => navigate("Profile", { id })}
      />
    );
  };

  render() {
    const { contacts, loading, error } = this.state;

    const contactsSorted = contacts.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    return (
      <View style={styles.container}>
        {loading && <ActivityIndicator size="large" />}
        {error && <Text>Error...</Text>}
        {!loading && !error && (
          <FlatList
            data={contactsSorted}
            keyExtractor={keyExtractor}
            renderItem={this.renderContact}
          />
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
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1
  }
});
