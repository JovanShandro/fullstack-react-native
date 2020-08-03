import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  ViewStyle
} from "react-native";

import ContactThumbnail from "../components/ContactThumbnail";

import { fetchContacts } from "../utils/api";
import store from "../store";
import { MappedContact, Subscription } from "../utils/types";

interface Props {
  navigation: {
    navigate(path: string, params: {}): void;
  };
}

const keyExtractor = ({ phone }: { phone: string }) => phone;

const Favorites: React.FC<Props> = ({ navigation: { navigate } }) => {
  const [contacts, setContacts] = useState<MappedContact[]>(
    store.getState().contacts
  );
  const [loading, setLoading] = useState(store.getState().isFetchingContacts);
  const [error, setError] = useState(store.getState().error);
  const unsubscribe = useRef<Subscription>();

  useEffect(() => {
    handleAsync();

    return () => {
      unsubscribe.current!();
    };
  }, []);

  const handleAsync = async () => {
    unsubscribe.current = store.onChange(() => {
      setContacts(store.getState().contacts);
      setLoading(store.getState().isFetchingContacts);
      setError(store.getState().error);
    });

    if (contacts.length === 0) {
      const fetchedContacts = await fetchContacts();

      store.setState({ contacts: fetchedContacts, isFetchingContacts: false });
    }
  };

  const renderFavoriteThumbnail = ({ item }: { item: MappedContact }) => {
    const { avatar } = item;

    return (
      <ContactThumbnail
        avatar={avatar}
        onPress={() => navigate("Profile", { id: item.id })}
      />
    );
  };

  const favorites = contacts.filter(contact => contact.favorite);

  return (
    <View style={styles.container}>
      {loading && <ActivityIndicator size="large" />}
      {error && <Text>Error...</Text>}

      {!loading && !error && (
        <FlatList
          data={favorites}
          keyExtractor={keyExtractor}
          numColumns={3}
          contentContainerStyle={styles.list}
          renderItem={renderFavoriteThumbnail}
        />
      )}
    </View>
  );
};

interface Style {
  container: ViewStyle;
  list: ViewStyle;
}

const styles = StyleSheet.create<Style>({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1
  },
  list: {
    alignItems: "center"
  }
});

export default Favorites;
