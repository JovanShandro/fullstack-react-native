export interface MessageShape {
  id: number;
  type: "text" | "image" | "location";
  text?: string;
  uri?: string;
  coordinate?: Coordinate;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface GridRenderItem {
  index: number;
  item: { uri: string };
  size: number;
  marginTop: number;
  marginLeft: number;
}

export interface ImageType {
  uri: string;
  height: number;
  width: number;
  isStored?: boolean;
  playableDuration?: number;
}

export interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export enum INPUT_METHOD {
  NONE,
  KEYBOARD,
  CUSTOM
}
