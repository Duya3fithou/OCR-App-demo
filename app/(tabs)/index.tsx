import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Button,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { useClipboardHistory } from "@/hooks/useClipboardHistory";

import commonButtonStyles from "@/stylings/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import COLORS from "@/utils/colors";
import Loading from "@/components/Loading";
import * as Clipboard from "expo-clipboard";
import useAnalyzeImage from "@/hooks/useAnalyzeImage";
import showToasts from "@/utils/toast";
import { router } from "expo-router";
import NetInfo from "@react-native-community/netinfo";

export const windowWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const {
    isLoading,
    text,
    pickImage,
    image,
    requestPermission,
    permission,
    setImage,
  } = useAnalyzeImage();

  const { addToHistory } = useClipboardHistory();

  const { photoUri } = useLocalSearchParams();

  useEffect(() => {
    if (photoUri && typeof photoUri === "string" && photoUri !== "") {
      setImage(photoUri);
    }
  }, [photoUri]);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!state.isConnected) {
        Alert.alert(
          "Không có kết nối internet",
          "Vui lòng kiểm tra kết nối internet",
          [
            {
              text: "Chuyển sang chế độ offline",
              onPress: () => {
                router.navigate({
                  pathname: "/offline-mode",
                  params: {
                    photoUri: "ok",
                  },
                });
              },
              style: "destructive",
            },
            {
              text: "Tôi hiểu",
              onPress: () => null,
              style: "cancel",
            },
          ],
          {
            userInterfaceStyle: "dark",
          }
        );
      }
    });

    () => {
      unsubscribe();
    };
  }, []);

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
      <ScrollView contentContainerStyle={styles.scrollView}>
      <Loading isLoading={isLoading} />
        <View style={styles.wrapperImage}>
          <Image
            source={{ uri: image }}
            style={styles.image}
            contentFit="contain"
          />
        </View>
        <View style={styles.wrapperButton}>
          <TouchableOpacity
            style={commonButtonStyles.buttonPrimary}
            onPress={() => {
              router.navigate({
                pathname: "/camera-component",
                params: {
                  onPhotoTaken: "true",
                  photoUri: "ok",
                },
              });
            }}
            activeOpacity={0.8}
          >
            <Text style={commonButtonStyles.buttonText}>Chụp ảnh</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[commonButtonStyles.buttonPrimary, { marginTop: 8 }]}
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
              style={[commonButtonStyles.buttonPrimary, { marginTop: 8 }]}
              onPress={async () => {
                await Clipboard.setStringAsync(text);
                await addToHistory(text);
                DeviceEventEmitter.emit('clipboard-history-updated');
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
