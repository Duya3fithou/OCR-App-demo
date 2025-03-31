import COLORS from "@/utils/colors";
import { StyleSheet } from "react-native";

const commonButtonStyles = StyleSheet.create({
  buttonPrimary: {
    justifyContent: 'center',
    backgroundColor: COLORS.PRIMARY_RED,
    borderRadius: 8,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    alignItems: "center",

  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 18,
    textTransform: "uppercase",
  },
});

export default commonButtonStyles;
