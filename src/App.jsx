import React, { useState } from 'react';
import { createEvent } from './supabaseClient';
import * as Sentry from '@sentry/browser';

function App() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAskQuestion = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setResponse('');
    try {
      const result = await createEvent('chatgpt_request', {
        prompt: question,
        response_type: 'text',
      });
      setResponse(result);
    } catch (error) {
      console.error('Error fetching response:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-4 flex flex-col items-center">
      <div className="max-w-3xl w-full h-full">
        <h1 className="text-4xl font-bold text-purple-600 mb-6 text-center">Ask Mr. Waoo</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent box-border"
            rows="4"
            placeholder="Type your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>
          <button
            className={`mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer ${
              loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleAskQuestion}
            disabled={loading}
          >
            {loading ? 'Asking...' : 'Ask Mr. Waoo'}
          </button>
        </div>
        {response && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-purple-600 mb-4">Mr. Waoo's Response:</h2>
            <p className="text-gray-800">{response}</p>
          </div>
        )}
      </div>
      <footer className="mt-8 text-center">
        <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Made on ZAPT
        </a>
      </footer>
    </div>
  );
}

export default App;