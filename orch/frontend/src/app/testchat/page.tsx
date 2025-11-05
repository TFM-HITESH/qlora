'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionToken, setSessionToken] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const createSession = async () => {
      try {
        const res = await fetch('/api/v1/auth/session', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to create session');
        }

        const data = await res.json();
        setSessionToken(data.token.access_token);
      } catch (error) { 
        console.error(error);
        router.push('/login');
      }
    };

    createSession();
  }, [router]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || !sessionToken) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const res = await fetch('/api/v1/chatbot/chat/stream', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionToken}`,
      },
      body: JSON.stringify({ messages: newMessages }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantMessage = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const eventLines = chunk.split('\n\n').filter(line => line.startsWith('data:'));

      for (const line of eventLines) {
        const jsonStr = line.substring(5);
        const data = JSON.parse(jsonStr);

        if (data.done) {
          setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
          return;
        }
        assistantMessage += data.content;
        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            const newLastMessage = { ...lastMessage, content: assistantMessage };
            return [...prev.slice(0, -1), newLastMessage];
          } else {
            return [...prev, { role: 'assistant', content: assistantMessage }];
          }
        });
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow p-6 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button type="submit" className="px-6 py-2 text-white bg-blue-600 rounded-r-md hover:bg-blue-700">
            Send
          </button>
        </form>
      </div>
    </div>
  );
}