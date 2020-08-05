import { useRef } from "react";

export const useComponentWillMount = (f: Function) => {
  const willMount = useRef(true);

  if (willMount.current) {
    f();
  }
  willMount.current = false;
};
