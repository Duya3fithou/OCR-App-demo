import { useCallback, useEffect, useRef, useState } from "react";


import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import showToasts from "@/utils/toast";
import axios from "axios";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { API_URL } from "@/utils/keys";
import TextRecognition from '@react-native-ml-kit/text-recognition';



const useAnalyzeImageOffline = () => {
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [text, setText] = useState<string>("");
    const [permission, requestPermission] = useCameraPermissions();


    useEffect(() => {
        if (image) {
            analyzeImage();
        }
    }, [image]);

    const pickImage = useCallback(async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ["images"],
                allowsEditing: false,
                aspect: [9, 9],
                quality: 1,
                selectionLimit: 1,
            });
            if (!result.canceled) {
                setImage(result.assets[0].uri);
            }
        } catch (error) {
            console.log(error);
            showToasts({ type: "error", message: "Lỗi chọn ảnh" });
        }
    }, []);

    const analyzeImage = useCallback(async () => {
        try {
            if (!image) {
                showToasts({ type: "error", message: "Vui lòng chọn ảnh" });
                return;
            }
            setIsLoading(true);

            const result = await TextRecognition.recognize(image);

            console.log('Recognized text:', result.text);

            for (let block of result.blocks) {
                console.log('Block text:', block.text);
                console.log('Block frame:', block.frame);

                for (let line of block.lines) {
                    console.log('Line text:', line.text);
                    console.log('Line frame:', line.frame);
                }
            }

        } catch (error) {
            console.log('error: ', error)
            showToasts({ type: "error", message: "Lỗi phân tích ảnh" });
        } finally {
            setIsLoading(false);
        }
    }, [image]);

    return { isLoading, text, pickImage, image, requestPermission, permission, setIsLoading, setImage };
};

export default useAnalyzeImageOffline;
