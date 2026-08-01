import { useContext } from "react";
import { TextPostContext } from "../context/TextPostContext";

export const useTextPost = () => {
  const context = useContext(TextPostContext);
  if (!context) {
    throw new Error("useTextPost must be used inside a TextPostProvider");
  }
  return context;
};