import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Button,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

import commonButtonStyles from "@/stylings/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "@/utils/colors";
import ToastManager from "toastify-react-native";
import Loading from "@/components/Loading";
import * as Clipboard from "expo-clipboard";
import useAnalyzeImage from "@/hooks/useAnalyzeImage";
import showToasts from "@/utils/toast";
import { router } from "expo-router";
import useAnalyzeImageOffline from "@/hooks/useAnalyzeImageOffline";

export const windowWidth = Dimensions.get("window").width;

export default function OfflineModeScreen() {
  const {
    isLoading,
    text,
    pickImage,
    image,
    requestPermission,
    permission,
    setImage,
  } = useAnalyzeImageOffline();

  const { photoUri } = useLocalSearchParams();

  useEffect(() => {
    if (photoUri && typeof photoUri === "string" && photoUri !== "") {
      setImage(photoUri);
    }
  }, [photoUri]);

  if (!permission) {
    return <Loading isLoading={true} />;
  }

  if (!permission.granted) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="GRANT PERMISSION" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Loading isLoading={isLoading} />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.wrapperImage}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            contentFit="contain"
          />
        </View>
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={commonButtonStyles.buttonPrimaryOffline}
            onPress={() => {
              router.navigate({
                pathname: "/camera-component",
                params: {
                  photoUri: "ok",
                  isOffline: "true",
                },
              });
            }}
            activeOpacity={0.8}
          >
            <Text style={commonButtonStyles.buttonText}>Chụp ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[commonButtonStyles.buttonPrimaryOffline, { marginTop: 8 }]}
            activeOpacity={0.8}
            onPress={pickImage}
          >
            <Text style={commonButtonStyles.buttonText}>Chọn ảnh</Text>
          </TouchableOpacity>
        </View>
        {text && (
          <View style={styles.wrapperText}>
            <Text style={styles.textResult}>Kết quả: </Text>
            <Text>{text}</Text>
            <TouchableOpacity
              style={[commonButtonStyles.buttonPrimaryOffline, { marginTop: 8 }]}
              onPress={() => {
                Clipboard.setStringAsync(text);
                showToasts({ type: "info", message: "Đã copy vào bộ nhớ" });
              }}
              activeOpacity={0.8}
            >
              <Text style={commonButtonStyles.buttonText}>Copy</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonText: {
    color: COLORS.WHITE,
  },
  wrapperImage: {
    width: windowWidth - 50,
    height: windowWidth - 100,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  wrapperButton: {
    marginHorizontal: 25,
  },
  wrapperText: {
    marginHorizontal: 25,
  },
  scrollView: {
    paddingBottom: 80,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
  },
  textResult: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 8,
  },
});
