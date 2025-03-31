import { useCallback, useEffect, useRef, useState } from "react";


import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import showToasts from "@/utils/toast";
import axios from "axios";
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

const API_KEY = "AIzaSyBoibG6IjHPC3KR4QLM2gu9R-cHXDMGEPQ"; //should be in .env file for security
const API_URL =
    "https://vision.googleapis.com/v1/images:annotate?key=" + API_KEY;

const useAnalyzeImage = () => {
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

            const base64Image = await FileSystem.readAsStringAsync(image, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const requestBody = {
                requests: [
                    {
                        image: {
                            content: base64Image,
                        },
                        features: [
                            {
                                type: "TEXT_DETECTION",
                                maxResults: 1,
                            },
                        ],
                    },
                ],
            };

            const response = await axios.post(API_URL, requestBody);
            setText(response.data.responses[0].textAnnotations[0].description);
        } catch (error) {
            showToasts({ type: "error", message: "Lỗi phân tích ảnh" });
        } finally {
            setIsLoading(false);
        }
    }, [image]);

    return { isLoading, text, pickImage, image, requestPermission, permission, setIsLoading, setImage };
};

export default useAnalyzeImage;
