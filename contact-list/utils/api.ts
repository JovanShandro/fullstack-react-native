import { uuid } from "./uuid";
import { Contact, MappedContact } from "./types";
import capitalize from "../utils/capitalize";

interface FetchResponse {
  results: Contact[];
}

const mapContact = (contact: Contact): MappedContact => {
  const { name, picture, phone, cell, email } = contact;

  return {
    id: uuid(),
    name: `${capitalize(name.first)} ${capitalize(name.last)}`,
    avatar: picture.large,
    phone,
    cell,
    email,
    favorite: Math.random() >= 0.5 // randomly generate favorite contacts
  };
};

export const fetchContacts = async (): Promise<MappedContact[]> => {
  const response = await fetch(
    "https://randomuser.me/api/?results=100&seed=fullstackio"
  );
  const contactData = (await response.json()) as FetchResponse;

  return contactData.results.map(mapContact);
};

export const fetchUserContact = async (): Promise<MappedContact> => {
  const response = await fetch("https://randomuser.me/api/?seed=fullstackio");
  const userData = (await response.json()) as FetchResponse;

  return mapContact(userData.results[0]);
};

export const fetchRandomContact = async (): Promise<MappedContact> => {
  const response = await fetch("https://randomuser.me/api/");
  const userData = (await response.json()) as FetchResponse;

  return mapContact(userData.results[0]);
};
