import COLORS from "@/utils/colors";
import { SkypeIndicator } from "react-native-indicators";
import { StyleSheet, View, Dimensions } from "react-native";

const Loading = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;
  return (
    <View style={styles.ctn}>
      <View style={styles.loadingCtn}>
        <SkypeIndicator color={COLORS.WHITE} size={40} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ctn: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    zIndex: 2,
    width: "100%",
    height: Dimensions.get("window").height - 90,
  },
  loadingCtn: {
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: COLORS.BLACK_50,
    borderRadius: 10,
    justifyContent: "center",
    padding: 20,
    position: "absolute",
  },
});

export default Loading;
