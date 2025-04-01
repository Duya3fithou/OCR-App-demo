import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback } from 'react';

const CLIPBOARD_HISTORY_KEY = '@clipboard_history';
const MAX_HISTORY_ITEMS = 10;

interface ClipboardItem {
  text: string;
  timestamp: number;
}

export const useClipboardHistory = () => {
  const [history, setHistory] = useState<ClipboardItem[]>([]);

  const loadHistory = useCallback(async () => {
    try {
      const savedHistory = await AsyncStorage.getItem(CLIPBOARD_HISTORY_KEY);
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        setHistory(parsedHistory);
      }
    } catch (error) {
      console.error('Error loading clipboard history:', error);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const addToHistory = useCallback(async (text: string) => {
    console.log('history: ', history)
    try {
      const newItem: ClipboardItem = {
        text,
        timestamp: Date.now(),
      };

      const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS);
      await AsyncStorage.setItem(CLIPBOARD_HISTORY_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error saving to clipboard history:', error);
    }
  }, [history.length]);

  const editHistoryItem = useCallback(async (editedText: string, index: number) => {
    try {
      if (index < 0 || index >= history.length) {
        console.error('Invalid index for editing history item');
        return;
      }

      const updatedHistory = [...history];
      updatedHistory[index] = {
        ...updatedHistory[index],
        text: editedText,
        timestamp: Date.now() // Cập nhật timestamp khi sửa
      };

      await AsyncStorage.setItem(CLIPBOARD_HISTORY_KEY, JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } catch (error) {
      console.error('Error editing clipboard history item:', error);
    }
  }, [history.length]);

  const clearHistory = useCallback(async () => {
    try {
      await AsyncStorage.setItem(CLIPBOARD_HISTORY_KEY, JSON.stringify([]));
      setHistory([]);
    } catch (error) {
      console.error('Error clearing clipboard history:', error);
    }
  }, [history.length]);

  return {
    history,
    addToHistory,
    clearHistory,
    loadHistory,
    editHistoryItem
  };
}; 