import { Params } from "./types";

export default (url: string): Params => {
  const paramString = url.includes("?") ? url.split("?")[1].split("&") : [];
  const params: Params = {};

  paramString.forEach(param => {
    const paramSplit = param.split("=");
    params[paramSplit[0]] = paramSplit[1];
  });

  return params;
};
