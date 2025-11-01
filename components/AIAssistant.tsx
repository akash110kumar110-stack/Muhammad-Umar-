import React, { useState, useRef, useEffect } from 'react';
import { getAIThreatAnalysis } from '../services/geminiService';
import type { Threat } from '../types';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

const AIAssistant: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: Date.now(), sender: 'ai', text: "I am Neural Sentinel's AI Analyst. How can I assist you with the current threat landscape?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explainableMessageId, setExplainableMessageId] = useState<number | null>(messages[0].id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: Message = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setExplainableMessageId(null);

    try {
      const dummyThreats: Threat[] = [];
      const aiResponseText = await getAIThreatAnalysis(dummyThreats, input);
      const newAiMessageId = Date.now();
      const aiMessage: Message = { id: newAiMessageId, sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
      setExplainableMessageId(newAiMessageId);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { id: Date.now(), sender: 'ai', text: "Apologies, I'm experiencing technical difficulties." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleExplainFurther = async () => {
    if (!explainableMessageId || isLoading) return;

    const messageToExplain = messages.find(m => m.id === explainableMessageId);
    if (!messageToExplain) return;

    const followUpPrompt = `Please elaborate on your previous analysis: "${messageToExplain.text}"`;
    const userDisplayMessage: Message = { id: Date.now(), sender: 'user', text: 'Explain that further.' };
    
    setMessages(prev => [...prev, userDisplayMessage]);
    setIsLoading(true);
    setExplainableMessageId(null);

    try {
      const dummyThreats: Threat[] = [];
      const aiResponseText = await getAIThreatAnalysis(dummyThreats, followUpPrompt);
      const newAiMessageId = Date.now();
      const aiMessage: Message = { id: newAiMessageId, sender: 'ai', text: aiResponseText };
      setMessages(prev => [...prev, aiMessage]);
      setExplainableMessageId(newAiMessageId);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = { id: Date.now(), sender: 'ai', text: "Apologies, I couldn't elaborate on that point." };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div
      className={`fixed top-0 right-0 h-full w-full md:w-96 bg-gray-900/80 backdrop-blur-xl border-l-2 border-cyan-500/50 shadow-2xl shadow-black transform transition-transform duration-500 ease-in-out z-40 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <header className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <h2 className="text-xl font-orbitron text-cyan-400">AI Threat Analyst</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`flex gap-3 w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-cyan-500/50 flex-shrink-0 flex items-center justify-center text-cyan-200 text-xs font-bold">AI</div>}
                    <div
                        className={`max-w-xs md:max-w-sm rounded-lg p-3 text-sm ${
                        msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-200'
                        }`}
                    >
                        <div className="prose prose-sm prose-invert" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br />') }} />
                    </div>
                </div>
                 {msg.sender === 'ai' && msg.id === explainableMessageId && !isLoading && (
                    <button
                        onClick={handleExplainFurther}
                        className="mt-2 ml-11 flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-200 bg-gray-700/50 px-2 py-1 rounded-md transition hover:bg-gray-700"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C3.732 4.943 7.523 3 10 3s6.268 1.943 9.542 7c-3.274 5.057-7.064 7-9.542 7S3.732 15.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        Explain Further
                    </button>
                )}
            </div>
          ))}
          {isLoading && (
             <div className="flex gap-3 justify-start">
               <div className="w-8 h-8 rounded-full bg-cyan-500/50 flex-shrink-0 flex items-center justify-center text-cyan-200 text-xs font-bold">AI</div>
               <div className="max-w-xs md:max-w-sm rounded-lg p-3 text-sm bg-gray-800 text-gray-200">
                 <div className="flex items-center space-x-1">
                   <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                   <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                   <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                 </div>
               </div>
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <footer className="p-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about current threats..."
              className="flex-1 bg-gray-800 border border-gray-600 rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-cyan-600 text-white p-2 rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AIAssistant;