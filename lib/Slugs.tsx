import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";

export const formatSlug = (slug: string | null) => {
  if (!slug) {
    return "";
  }
  return slug
    .split("-") //split by hyphen
    .map((word) => {
      word.charAt(0).toUpperCase() + word.slice(1); //capitalize each letter
    })
    .join(" "); //join by space
};

export const inverseFormatSlug = (title: string | null) => {
  if (!title) return "";
  return title
    .split(" ") //split by space
    .map((word) => word.charAt(0).toLowerCase() + word.slice(1).toLowerCase()) //lowercase each letter
    .join("-"); //join by hyphen
};

export const CopySlug = async (slug: string | null) => {
  if (!slug) {
    return;
  }
  await Clipboard.setStringAsync(formatSlug(slug));
  // orange-happy-fox --> Orange Happy Fox

  Toast.show("Copied id to clipboard", {
    duration: Toast.durations.LONG,
    position: Toast.positions.CENTER,
    shadow: true,
  });
};
