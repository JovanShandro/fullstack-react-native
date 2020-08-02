export interface Params {
  [key: string]: string;
}

export interface Contact {
  name: { first: string; last: string };
  picture: { large: string };
  phone: string;
  cell: string;
  email: string;
}

export interface MappedContact {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  cell: string;
  email: string;
  favorite: boolean;
}

export type Listener = () => void;

export type Subscription = () => Listener[];

export interface StoreState {
  isFetchingContacts: boolean;
  isFetchingUser: boolean;
  contacts: MappedContact[];
  user: MappedContact | {};
  error: boolean;
}
