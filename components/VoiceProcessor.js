import { OPENAI_API_KEY } from '@env';

export const transcribeAudio = async (uri) => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/x-wav',
      name: 'audio.wav',
    });
    formData.append('model', 'whisper-1');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    const whisperData = await whisperRes.json();
    return whisperData.text;
  } catch (err) {
    console.error('Whisper transcription failed', err);
    return '';
  }
};

export const getGPTReply = async (text) => {
  try {
    const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: text }],
      }),
    });

    const chatData = await chatRes.json();
    return chatData.choices[0].message.content;
  } catch (err) {
    console.error('GPT reply failed', err);
    return 'Sorry, something went wrong.';
  }
};
