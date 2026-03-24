import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User as UserIcon, HelpCircle } from 'lucide-react';
import { getSupportResponse } from '../services/geminiService';
import { SUPPORT_EMAIL, SUPPORT_LINKS } from '../constants';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const Support: React.FC<{ userName: string }> = ({ userName }) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', sender: 'ai', text: `Hello ${userName}! How can I help you with the Videos app today?` }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setLoading(true);

    const aiResponseText = await getSupportResponse(query, userName);
    
    const aiMsg: Message = { id: (Date.now() + 1).toString(), sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-card rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-4 bg-primary text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <h2 className="font-bold text-lg">AI Support Assistant</h2>
        </div>
        <a href={`mailto:${SUPPORT_EMAIL}`} className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30 transition">
          Email Human
        </a>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-end max-w-[80%] gap-2 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-gray-200 dark:bg-gray-700' : 'bg-primary/20'}`}>
                {msg.sender === 'user' ? <UserIcon size={16} /> : <Bot size={16} className="text-primary" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${
                msg.sender === 'user' 
                  ? 'bg-primary text-white rounded-br-none' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="flex items-center gap-2 text-gray-400 text-sm ml-10">
                <span className="animate-pulse">AI is thinking...</span>
             </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-dark">
        <div className="flex gap-2 mb-3 overflow-x-auto no-scrollbar">
           {SUPPORT_LINKS.map((link, idx) => (
             <a key={idx} href={link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-primary bg-primary/10 px-2 py-1 rounded-full whitespace-nowrap hover:bg-primary/20">
               <HelpCircle size={12} /> External Help {idx + 1}
             </a>
           ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your problem..."
            className="flex-1 bg-white dark:bg-gray-800 border dark:border-gray-600 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-primary hover:bg-red-600 text-white p-2 rounded-full transition disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;