import React, { useState, useRef, useEffect } from "react";
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

const User: React.FC<{}> = () => {
  const [user, setUser] = useState(store.getState().user);
  const [loading, setLoading] = useState(store.getState().isFetchingUser);
  const [error, setError] = useState(store.getState().error);
  const unsubscribe = useRef<Subscription | null>(null);

  useEffect(() => {
    handleAsync();
    return () => {
      if (unsubscribe.current) {
        unsubscribe.current();
      }
    };
  }, []);

  const handleAsync = async () => {
    unsubscribe.current = store.onChange(() => {
      setUser(store.getState().user);
      setLoading(store.getState().isFetchingUser);
      setError(store.getState().error);
    });

    const user = await fetchUserContact();

    store.setState({ user, isFetchingUser: false });
  };

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
};

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

export default User;
