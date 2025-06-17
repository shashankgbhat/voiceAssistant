import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { MaterialIcons } from '@expo/vector-icons';

const ChatBubble = ({ message }) => {
  const isUser = message.sender === 'user';
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);

  const playbackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPosition(status.positionMillis);
      setDuration(status.durationMillis);
      if (!status.isPlaying) setIsPlaying(false);
    }
  };

  const loadSound = async () => {
    if (sound) await sound.unloadAsync();
    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: message.audioUri },
      { shouldPlay: false },
      playbackStatusUpdate
    );
    setSound(newSound);
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleSeek = async (value) => {
    if (!sound) return;
    await sound.setPositionAsync(value);
  };

  useEffect(() => {
    if (message.audioUri) loadSound();
    return () => { if (sound) sound.unloadAsync(); };
  }, [message.audioUri]);

  return (
    <View style={[styles.bubbleContainer, isUser ? styles.userAlign : styles.botAlign]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        {message.audioUri ? (
          <View style={styles.audioContainer}>
            <TouchableOpacity onPress={togglePlayPause}>
              <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={28} color="#fff" />
            </TouchableOpacity>
            <Slider
              style={{ flex: 1, marginLeft: 10 }}
              minimumValue={0}
              maximumValue={duration}
              value={position}
              onSlidingComplete={handleSeek}
              minimumTrackTintColor="#ffffff"
              maximumTrackTintColor="#999"
              thumbTintColor="#fff"
            />
          </View>
        ) : (
          <Text style={styles.message}>{message.text}</Text>
        )}
        {message.transcript && (
          <Text style={styles.transcript}>{message.transcript}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bubbleContainer: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  userAlign: {
    alignItems: 'flex-end',
  },
  botAlign: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 10,
  },
  userBubble: {
    backgroundColor: '#0b93f6',
  },
  botBubble: {
    backgroundColor: '#444',
  },
  message: {
    color: '#fff',
    fontSize: 16,
  },
  transcript: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ChatBubble;
