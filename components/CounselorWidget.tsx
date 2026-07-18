'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, ArrowDown, Sparkles, User, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

const QUICK_QUESTIONS = [
  "How can I apply?",
  "What is the curriculum?",
  "What are your facilities?",
  "What are the school hours?",
  "Are school buses available?",
];

export default function CounselorWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Hello! I am Ayo, your virtual Academic Counselor at Matem Schools. How can I assist you or your family today with admissions, school programs, or campus details?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [unread, setUnread] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setUnread(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg = text.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/counselor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map(m => ({ role: m.role, content: m.content })),
          userMessage: userMsg
        })
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'model', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'model',
          content: data.error || "Pardon me, I encountered a brief technical lag. Please try again or feel free to call us at 08089664009."
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'model',
        content: "I'm having trouble connecting to the school admissions server right now. Kindly call our registrar directly, or try again shortly."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="ai-counselor-widget" className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="bg-white rounded-2xl shadow-premium-lg border border-gray-100 w-[350px] sm:w-[400px] h-[550px] flex flex-col overflow-hidden mb-4"
          >
            {/* Chat Header */}
            <div className="bg-navy-800 p-4 text-white flex items-center justify-between border-b border-gold-500/30">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gold-500 rounded-full flex items-center justify-center text-navy-950 font-bold shadow-inner">
                  <Sparkles className="h-5 w-5 text-navy-900" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm text-white flex items-center">
                    Ayo — Academic Advisor
                  </h4>
                  <p className="text-[10px] text-gold-300 font-sans tracking-wide">
                    Matem AI Admissions Assistant
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-300 hover:text-white p-1 rounded-full hover:bg-navy-700/50 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 scrollbar-thin">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start max-w-[85%] space-x-2 ${m.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                      m.role === 'user' ? 'bg-navy-100 text-navy-800' : 'bg-gold-100 text-gold-800'
                    }`}>
                      {m.role === 'user' ? <User className="h-4 w-4" /> : 'A'}
                    </div>
                    <div className={`rounded-2xl px-4 py-2.5 text-xs shadow-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-navy-800 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none whitespace-pre-wrap'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-start max-w-[85%] space-x-2">
                    <div className="w-7 h-7 rounded-full bg-gold-100 text-gold-800 flex items-center justify-center shrink-0 text-xs font-bold animate-pulse">
                      A
                    </div>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-none px-4 py-3 text-xs shadow-sm flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Questions suggestion */}
            {messages.length < 4 && (
              <div className="px-4 py-2 bg-white border-t border-gray-100">
                <p className="text-[10px] text-gray-400 mb-1.5 flex items-center font-semibold uppercase tracking-wider">
                  <HelpCircle className="h-3 w-3 mr-1 text-gold-500" /> Suggested topics:
                </p>
                <div className="flex flex-wrap gap-1.5 max-h-[70px] overflow-y-auto">
                  {QUICK_QUESTIONS.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] bg-gray-100 hover:bg-gold-100 hover:text-gold-900 text-gray-700 px-2.5 py-1 rounded-full transition-colors font-medium border border-gray-200/50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-3 border-t border-gray-100 bg-white flex items-center">
              <input
                type="text"
                placeholder="Ask me about admissions, uniform, bus routes..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
                className="flex-1 bg-gray-50 border border-gray-200 text-xs rounded-xl px-4 py-2.5 focus:outline-none focus:border-gold-500 text-gray-800"
                disabled={isLoading}
              />
              <button
                onClick={() => handleSendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="ml-2 bg-navy-800 hover:bg-navy-700 disabled:bg-gray-200 disabled:text-gray-400 text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Launcher Button */}
      <button
        onClick={toggleChat}
        className="relative bg-navy-800 hover:bg-navy-900 text-white p-4 rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-gold-500/30"
        aria-label="Open Counselor Chatbot"
      >
        {unread && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-gold-500 rounded-full border border-white flex items-center justify-center text-[9px] font-bold text-navy-950 animate-bounce">
            AI
          </span>
        )}
        {isOpen ? <X className="h-6 w-6 text-gold-400" /> : <MessageSquare className="h-6 w-6 text-gold-400" />}
      </button>
    </div>
  );
}
