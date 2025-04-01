import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { useClipboardHistory } from "@/hooks/useClipboardHistory";
import commonButtonStyles from "@/stylings/commonStyles";
import COLORS from "@/utils/colors";
import { router, useLocalSearchParams } from "expo-router";

interface ClipboardItem {
  text: string;
  timestamp: number;
}

const ClipboardItemHistory = ({
  item,
  handleCopy,
}: {
  item: ClipboardItem;
  handleCopy: (text: string) => void;
}) => {
  return (
    <TouchableOpacity
      key={item.timestamp}
      style={styles.historyItem}
      onPress={() => handleCopy(item.text)}
    >
      <Text style={styles.itemText} numberOfLines={3}>
        {item.text}
      </Text>
      <Text style={styles.timestamp}>
        {new Date(item.timestamp).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );
};

const ClipboardHistory = () => {
  const { history, clearHistory, loadHistory, editHistoryItem } = useClipboardHistory();
  const { editedText, index } = useLocalSearchParams();

  React.useEffect(() => {
    editHistoryItem(editedText as string, Number(index));
  }, [editedText, index]);

  useEffect(() => {
    const listener = DeviceEventEmitter.addListener(
      "clipboard-history-updated",
      () => {
        loadHistory();
      }
    );

    return () => {
      listener.remove();
    };
  }, []);

  useEffect(() => {
    loadHistory();
  }, []);

  const handleClearHistory = () => {
    Alert.alert(
      "Xóa lịch sử",
      "Bạn có chắc chắn muốn xóa tất cả lịch sử clipboard không?",
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xóa",
          onPress: () => clearHistory(),
          style: "destructive",
        },
      ],
      {
        userInterfaceStyle: "dark",
      }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lịch sử clipboard</Text>
        {history.length > 0 && (
          <TouchableOpacity
            style={[
              commonButtonStyles.buttonPrimary,
              { width: 130, height: 55 },
            ]}
            onPress={handleClearHistory}
            activeOpacity={0.8}
          >
            <Text style={commonButtonStyles.buttonText}>Xóa tất cả</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={history}
        renderItem={({ item, index }) => (
          <ClipboardItemHistory
            item={item}
            handleCopy={() => {
              router.push({
                pathname: "/edit-component",
                params: {
                  textParams: item.text,
                  index,
                },
              });
            }}
          />
        )}
        keyExtractor={(item) => item.timestamp.toString()}
        extraData={history}
        removeClippedSubviews={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
    width: 230,
  },
  scrollView: {
    flex: 1,
  },
  historyItem: {
    backgroundColor: COLORS.WHITE_30,
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#666",
  },
});

export default ClipboardHistory;
