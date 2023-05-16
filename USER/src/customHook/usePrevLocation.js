import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

//THIS IS THE CUSTOM HOOK

export const UsePrevLocation = (location) => {
  const prevLocRef = useRef(location);

  useEffect(() => {
    prevLocRef.current = location;
  }, [location]);

  return prevLocRef.current;
};
