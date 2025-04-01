import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClipboardHistory from '@/components/ClipboardHistory';

export default function ClipboardScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ClipboardHistory />
    </SafeAreaView>
  );
}