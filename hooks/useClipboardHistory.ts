import { useState, useEffect, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('clipboard.db');
const MAX_HISTORY_ITEMS = 10;

interface ClipboardItem {
  id: number;
  text: string;
  timestamp: number;
}

// Hàm escape các ký tự đặc biệt trong SQL
const escapeSQLString = (str: string): string => {
  return str
    .replace(/'/g, "''") 
    .replace(/"/g, '""') 
    .replace(/\\/g, '\\\\') 
    .replace(/\$/g, '\\$') 
    .replace(/%/g, '\\%') 
    .replace(/_/g, '\\_') 
    .replace(/\[/g, '\\[') 
    .replace(/\]/g, '\\]') 
    .replace(/\(/g, '\\(') 
    .replace(/\)/g, '\\)') 
    .replace(/\*/g, '\\*') 
    .replace(/\+/g, '\\+') 
    .replace(/\?/g, '\\?') 
    .replace(/\|/g, '\\|') 
    .replace(/\{/g, '\\{') 
    .replace(/\}/g, '\\}') 
    .replace(/</g, '\\<') 
    .replace(/>/g, '\\>') 
    .replace(/\^/g, '\\^') 
    .replace(/`/g, '\\`') 
    .replace(/~/g, '\\~') 
    .replace(/!/g, '\\!') 
    .replace(/&/g, '\\&') 
    .replace(/#/g, '\\#'); 
};

export const useClipboardHistory = () => {
  const [history, setHistory] = useState<ClipboardItem[]>([]);

  const initDatabase = useCallback(() => {
    db.execSync(
      'CREATE TABLE IF NOT EXISTS clipboard_history (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, timestamp INTEGER);'
    );
  }, []);

  useEffect(() => {
    initDatabase();
    loadHistory();
  }, [initDatabase]);

  const loadHistory = useCallback(() => {
    const result = db.getAllSync<ClipboardItem>(
      `SELECT * FROM clipboard_history ORDER BY timestamp DESC LIMIT ${MAX_HISTORY_ITEMS};`
    );
    setHistory(result);
  }, []);

  const addToHistory = useCallback(async (text: string) => {
    const timestamp = Date.now();
    const escapedText = escapeSQLString(text);
    
    try {
      db.execSync(
        `INSERT INTO clipboard_history (text, timestamp) VALUES ('${escapedText}', ${timestamp});`
      );

      db.execSync(
        `DELETE FROM clipboard_history WHERE id NOT IN (SELECT id FROM clipboard_history ORDER BY timestamp DESC LIMIT ${MAX_HISTORY_ITEMS});`
      );

      loadHistory();
    } catch (error) {
      console.error('Error in addToHistory:', error);
    }
  }, [loadHistory]);

  const editHistoryItem = useCallback(async (editedText: string, index: number) => {
    try {
      if (index < 0 || index >= history.length) {
        console.error('Invalid index for editing history item');
        return;
      }

      const item = history[index];
      if (!item || !item.id) {
        return;
      }

      const timestamp = Date.now();
      const escapedText = escapeSQLString(editedText);

      db.execSync(
        `UPDATE clipboard_history SET text = '${escapedText}', timestamp = ${timestamp} WHERE id = ${item.id};`
      );

      loadHistory();
    } catch (error) {
      console.error('Error in editHistoryItem:', error);
    }
  }, [history, loadHistory]);

  const clearHistory = useCallback(() => {
    try {
      db.execSync('DELETE FROM clipboard_history;');
      setHistory([]);
    } catch (error) {
      console.error('Error in clearHistory:', error);
    }
  }, []);

  return {
    history,
    addToHistory,
    clearHistory,
    loadHistory,
    editHistoryItem
  };
}; 