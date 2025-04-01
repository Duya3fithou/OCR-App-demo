import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useEffect, useState } from "react";
import commonButtonStyles from "@/stylings/commonStyles";
import { router, useLocalSearchParams, useNavigation } from "expo-router";

const EditComponent = () => {
    const navigation = useNavigation();
  const { textParams, index } = useLocalSearchParams();
  const [text, setText] = useState(textParams as string);

  useEffect(() => {
    navigation.setOptions({ title: "Edit" });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <TextInput value={text} onChangeText={setText} style={styles.input} multiline={true} />
      <TouchableOpacity
        style={[commonButtonStyles.buttonPrimary, { marginTop: 8, width: "100%" }]}
        activeOpacity={0.8}
        onPress={() => {
          router.back();
          router.setParams({ editedText: text, index: index });
        }}
      >
        <Text style={commonButtonStyles.buttonText}>Lưu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    height: 340,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 10,
    padding: 10,
    margin: 10,
  },
});

export default EditComponent;
