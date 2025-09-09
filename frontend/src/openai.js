// src/openaiService.js
import axios from 'axios';

const OPENAI_API_KEY = 'xxxxxxxxxx';

export const getOpenAIResponse = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/engines/davinci-codex/completions', // Example endpoint
      {
        prompt: prompt,
        max_tokens: 150,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    return response.data.choices[0].text;
  } catch (error) {
    console.error('Error fetching OpenAI response:', error);
    throw error;
  }
};