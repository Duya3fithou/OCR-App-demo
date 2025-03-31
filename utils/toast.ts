import { Toast } from "toastify-react-native";

const showToasts = ({
    type,
    message,
}: {
    type: "success" | "error" | "info";
    message: string;
}) => {
    Toast[type]?.(message, "top");
};

export default showToasts;
