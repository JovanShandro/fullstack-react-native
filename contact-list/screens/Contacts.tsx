import React, { useState, useEffect, useRef } from "react";
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

interface Props {
  navigation: {
    navigate(path: string, params: {}): void;
  };
}

const keyExtractor = ({ phone }: { phone: string }) => phone;

const Contacts: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [contacts, setContacts] = useState(store.getState().contacts);
  const [loading, setLoading] = useState(store.getState().isFetchingContacts);
  const [error, setError] = useState(store.getState().error);
  const unsubscribe = useRef<Subscription | null>(null);

  const handleAsync = async () => {
    unsubscribe.current = store.onChange(() => {
      setContacts(store.getState().contacts);
      setLoading(store.getState().isFetchingContacts);
      setError(store.getState().error);
    });

    const contacts = await fetchContacts();

    store.setState({ contacts, isFetchingContacts: false });

    Linking.addEventListener("url", handleOpenUrl);

    const url = (await Linking.getInitialURL()) as string;
    handleOpenUrl({ url });
  };

  useEffect(() => {
    handleAsync();
    return () => {
      Linking.removeEventListener("url", handleOpenUrl);
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, []);

  const handleOpenUrl = (event: { url: string }) => {
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
  };

  const renderContact = ({ item }: { item: MappedContact }) => {
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

  const contactsSorted = contacts.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      {error && <Text>Error...</Text>}
      {!loading && !error && (
        <FlatList
          data={contactsSorted}
          keyExtractor={keyExtractor}
          renderItem={renderContact}
        />
      )}
    </View>
  );
};

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

export default Contacts;
