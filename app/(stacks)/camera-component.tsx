import CameraView from "expo-camera/build/CameraView";
import { router, useNavigation, useLocalSearchParams } from "expo-router";
import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { windowWidth } from "../(tabs)";
import commonButtonStyles from "@/stylings/commonStyles";

const CameraCpn = () => {
  const navigation = useNavigation();
  const ref = useRef<CameraView>(null);

  const handlePhotoTaken = async () => {
    try {
      const photo: any = await ref?.current?.takePictureAsync();
      router.back();
      router.setParams({
        photoUri: photo?.uri
      });
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  useEffect(() => {
    navigation.setOptions({ title: "Camera" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <CameraView style={styles.wrapperImage} facing={"back"} ref={ref} />
      <TouchableOpacity
        style={[commonButtonStyles.buttonPrimary, { marginHorizontal: 25 }]}
        onPress={handlePhotoTaken}
        activeOpacity={0.8}
      >
        <Text style={commonButtonStyles.buttonText}>Chụp ảnh</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapperImage: {
    width: windowWidth - 50,
    height: windowWidth - 100,
    alignSelf: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});

export default CameraCpn;
