import { MessageShape, Coordinate } from "./types";

let messageId: number = 0;

function getNextId(): number {
  messageId += 1;
  return messageId;
}

export function createTextMessage(text: string): MessageShape {
  return {
    type: "text",
    id: getNextId(),
    text
  };
}

export function createImageMessage(uri: string): MessageShape {
  return {
    type: "image",
    id: getNextId(),
    uri
  };
}

export function createLocationMessage(coordinate: Coordinate): MessageShape {
  return {
    type: "location",
    id: getNextId(),
    coordinate
  };
}
