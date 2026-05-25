import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  HelpCircle,
  Clock,
  ChevronRight,
  User,
  Power
} from 'lucide-react';
import { Message } from '../types';

interface AiAdvisorProps {
  efficiencyVal: number;
}

export default function AiAdvisor({ efficiencyVal }: AiAdvisorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      role: 'assistant',
      text: `🚜 **Welcome to AgriOptima Precision Support!**

I am your **AI Agronomist Co-pilot**. I am connected directly to your active plots telemetry and historical crop logs. How can I help you optimize coordinates today?

Ask me about:
* *"How should I manage Plot B-12 moisture?"*
* *"When is the best time to release my corn inventory?"*
* *"How can I pauses fertilization cycles before rain?"*`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Create request payload
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: historyPayload })
      });

      if (!res.ok) {
        throw new Error("Agri-api route communication error");
      }

      const data = await res.json();
      
      const assistantMessage: Message = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        text: data.text || "I was unable to complete your agronomical calculation. Please try again.",
        timestamp: new Date(),
        isSimulated: data.isSimulated
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        id: `msg-ai-err-${Date.now()}`,
        role: 'assistant',
        text: `### ⚠️ Connection Diagnostic Note\nI'm having trouble reaching the main cloud analyzer node. Here's a brief recommendation based on localized agronomic patterns:\n\n* **For Nitrogen management:** Pause all applications if soil saturation exceeds 70%.\n* **For Plot B-12:** Run irrigation post-haste as moisture continues to sit below the critical 42% threshold.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <>
      {/* Floating Action Button - Smart Robot */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-24 right-5 md:right-8 w-14 h-14 bg-[#002d1a] hover:bg-[#1a432f] text-emerald-200 hover:text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform md:bottom-28 z-50 cursor-pointer border border-[#cdead0]"
        title="AgriOptima AI Advisor"
      >
        <Bot className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full"></span>
      </button>

      {/* Chat window panel */}
      {isOpen && (
        <div className="fixed bottom-40 right-4 sm:right-8 w-[92vw] max-w-[420px] h-[550px] bg-white rounded-2xl border-2 border-[#c1c8c1] flex flex-col shadow-2xl z-50 overflow-hidden animate-fade-in">
          
          {/* Header block */}
          <div className="bg-[#002d1a] p-4 text-white flex items-center justify-between border-b border-[#1a432f]">
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-950 p-2 rounded-xl text-emerald-300">
                <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm leading-tight">AGRI OPTIMA ADVISOR</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] uppercase font-sans tracking-widest text-[#84b096] font-bold">PRECISION AI ACTIVE</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 px-2.5 hover:bg-[#1a432f] rounded-full text-emerald-200 hover:text-white font-sans text-xs font-bold"
            >
              CLOSE
            </button>
          </div>

          {/* Messages scroll content */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3 bg-[#f2f4f1]/50 bg-opacity-40 agri-leaf-pattern">
            {messages.map((m) => (
              <div 
                key={m.id}
                className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role !== 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-[#002d1a] border border-[#cdead0] text-[#cdead0] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                
                <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed shadow-sm border ${
                  m.role === 'user' 
                    ? 'bg-[#1a432f] text-white border-[#002d1a]' 
                    : 'bg-white text-emerald-950 border-gray-200'
                }`}>
                  {/* Markdown or normal format parser */}
                  <div className="whitespace-pre-line font-sans prose prose-sm max-w-none">
                    {m.text}
                  </div>
                  
                  {/* Indicators standard label */}
                  <span className="block text-[8px] opacity-60 text-right mt-1.5 font-mono">
                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {m.role === 'user' && (
                  <div className="w-8 h-8 rounded-lg bg-[#cdead0] text-emerald-950 flex items-center justify-center shrink-0 font-bold text-xs border border-[#516a56]/20">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-8 h-8 rounded bg-[#002d1a] text-emerald-200 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border text-emerald-950 rounded-xl p-3 text-xs shadow-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-emerald-700 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick inquiries suggestions */}
          <div className="px-4 py-2 border-t border-gray-100 flex gap-1.5 overflow-x-auto no-scrollbar bg-white">
            {[
              "Plot B-12 telemetry guidelines",
              "Strategic October corn release prices",
              "Fertilizer pauses rule check"
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(chip)}
                className="px-3 py-1 bg-gray-100 border border-gray-200 text-gray-500 hover:bg-[#cdead0] hover:text-[#002d1a] rounded-full text-[10px] font-sans font-bold whitespace-nowrap uppercase tracking-wide cursor-pointer"
              >
                {chip.slice(0, 20)}...
              </button>
            ))}
          </div>

          {/* Input control block */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 border-t border-[#c1c8c1] flex bg-white gap-2"
          >
            <input 
              type="text"
              placeholder="Ask precision agronomist..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow border border-gray-300 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-800 outline-none font-bold text-emerald-950"
              disabled={isLoading}
            />
            <button 
              type="submit"
              className="bg-[#002d1a] border border-transparent hover:bg-emerald-950 text-[#cdead0] p-2.5 rounded-lg active:scale-95 transition-transform"
              disabled={isLoading}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
