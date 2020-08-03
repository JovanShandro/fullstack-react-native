import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialIcons } from "@expo/vector-icons";
import Favorites from "./screens/Favorites";
import Contacts from "./screens/Contacts";
import Profile from "./screens/Profile";
import User from "./screens/User";
import Options from "./screens/Options";
import colors from "./utils/colors";
import store from "./store";
import { MappedContact } from "./utils/types";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getTabBarIcon = (icon: string) => ({ color }: { color: string }) => (
  <MaterialIcons name={icon} size={26} style={{ color: color }} />
);

// Stack Screen Components
const ContactsComponent = (
  <Stack.Screen
    name="Contacts"
    component={Contacts}
    options={{ title: "Contacts" }}
  />
);

const ProfileComponent = (
  <Stack.Screen
    name="Profile"
    component={Profile}
    options={({ route }) => {
      const { id } = route.params as { id: string };
      const { name } = store
        .getState()
        .contacts.find(contact => contact.id === id) as MappedContact;

      return {
        title: name.split(" ")[0],
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: colors.blue
        }
      };
    }}
  />
);

const FavoriteComponent = (
  <Stack.Screen
    name="Favorites"
    component={Favorites}
    options={{ title: "Favorites" }}
  />
);

const UserComponent = (
  <Stack.Screen
    name="User"
    component={User}
    options={({ navigation: { navigate } }) => ({
      title: "Me",
      headerTintColor: "white",
      headerStyle: {
        backgroundColor: colors.blue
      },
      headerRight: () => (
        <MaterialIcons
          name="settings"
          size={24}
          style={{ color: "white", marginRight: 10 }}
          onPress={() => navigate("Options")}
        />
      )
    })}
  />
);

const OptionsComponent = (
  <Stack.Screen
    name="Options"
    component={Options}
    options={({ navigation: { goBack } }) => ({
      title: "Options",
      headerLeft: () => (
        <MaterialIcons
          name="close"
          size={24}
          style={{ color: colors.black, marginLeft: 10 }}
          onPress={() => goBack()}
        />
      )
    })}
  />
);

// Stack Navigators
const ContactsScreens = () => {
  return (
    <Stack.Navigator initialRouteName="Contacts">
      {ContactsComponent}
      {ProfileComponent}
    </Stack.Navigator>
  );
};

const FavoritesScreens = () => {
  return (
    <Stack.Navigator initialRouteName="Favorites">
      {FavoriteComponent}
      {ContactsComponent}
    </Stack.Navigator>
  );
};

const UserScreens = () => {
  return (
    <Stack.Navigator initialRouteName="User" mode="modal">
      {UserComponent}
      {OptionsComponent}
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const App: React.FC<{}> = () => (
  <NavigationContainer>
    <Tab.Navigator
      initialRouteName="Contacts"
      tabBarOptions={{
        style: {
          backgroundColor: colors.greyLight
        },
        showLabel: false,
        activeTintColor: colors.blue,
        inactiveTintColor: colors.greyDark
      }}
    >
      <Tab.Screen
        name="Contacts"
        component={ContactsScreens}
        options={{
          tabBarIcon: getTabBarIcon("list")
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreens}
        options={{
          tabBarIcon: getTabBarIcon("star")
        }}
      />
      <Tab.Screen
        name="User"
        component={UserScreens}
        options={{
          tabBarIcon: getTabBarIcon("person")
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;
