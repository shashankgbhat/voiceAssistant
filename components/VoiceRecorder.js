import { Audio } from 'expo-av';
import { useRef, useState } from 'react';

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const recordingRef = useRef(null);

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      const recording = recordingRef.current;
      if (!recording) return null;
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;
      return uri;
    } catch (err) {
      console.error('Failed to stop recording', err);
      return null;
    }
  };

  return { isRecording, startRecording, stopRecording };
};
    