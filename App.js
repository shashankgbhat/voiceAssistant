import React, { useState } from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import RecordButton from './components/RecordButton';
import Loader from './components/Loader';
import { useVoiceRecorder } from './components/VoiceRecorder';
import { transcribeAudio, getGPTReply } from './components/VoiceProcessor';
import ChatBubble from './components/ChatBubble';
import * as Speech from 'expo-speech';

export default function App() {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder();
  const [isProcessing, setIsProcessing] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'assistant', text: 'Hi! Ask me anything.' },
  ]);

  const addMessage = (sender, text, audioUri = null, transcript = null) => {
    setMessages((prev) => [...prev, { id: Date.now(), sender, text, audioUri, transcript }]);
  };

  const handleStop = async () => {
    setIsProcessing(true);
    const uri = await stopRecording();
    if (uri) {
      addMessage('user', 'Audio message sent', uri);
      const userText = await transcribeAudio(uri);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.audioUri === uri ? { ...msg, transcript: userText } : msg
        )
      );
      const botReply = await getGPTReply(userText);
      addMessage('assistant', botReply);
      Speech.speak(botReply);
    }
    setIsProcessing(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: '100%' }} contentContainerStyle={{ paddingBottom: 60 }}>
        {messages.map((msg) => (
          <ChatBubble key={msg.id} message={msg} />
        ))}
      </ScrollView>
      {isProcessing ? (
        <Loader />
      ) : (
        <RecordButton
          isRecording={isRecording}
          onStart={startRecording}
          onStop={handleStop}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e1e1e',
    paddingTop: 60,
    paddingHorizontal: 10,
  },
});