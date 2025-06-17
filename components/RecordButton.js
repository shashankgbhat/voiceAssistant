import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { BounceIn, BounceOut } from 'react-native-reanimated';

const RecordButton = ({ isRecording, onStart, onStop }) => {
  const handlePress = () => {
    if (isRecording) onStop();
    else onStart();
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={BounceIn} exiting={BounceOut}>
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <MaterialIcons name={isRecording ? 'stop' : 'keyboard-voice'} size={32} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#0b93f6',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
});

export default RecordButton;
