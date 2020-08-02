import { ImageArray } from "./types";

export const fetchImages = async (): Promise<ImageArray> => {
  const response = await fetch("https://unsplash.it/list");
  const images = (await response.json()) as ImageArray;

  return images;
};

export const getImageFromId = (id: number) =>
  `https://unsplash.it/${600}/${600}?image=${id}`;
