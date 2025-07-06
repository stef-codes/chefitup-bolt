import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface TestErrorComponentProps {
  shouldThrow?: boolean;
}

const TestErrorComponent: React.FC<TestErrorComponentProps> = ({ shouldThrow = false }) => {
  if (shouldThrow) {
    throw new Error('This is a test error to verify ErrorBoundary functionality');
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>This is a test component</Text>
      <TouchableOpacity 
        style={{ 
          backgroundColor: '#EF4444', 
          padding: 10, 
          marginTop: 10, 
          borderRadius: 5 
        }}
        onPress={() => {
          throw new Error('Error triggered by button press');
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          Trigger Error
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestErrorComponent; 