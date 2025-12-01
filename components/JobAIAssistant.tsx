import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Job, PHASE_NAMES } from '../types';
import { formatCurrency } from '../utils';
import { Sparkles, X, Send, Bot, User, RefreshCw, TrendingUp, Mail, Lightbulb } from 'lucide-react';

interface JobAIAssistantProps {
  job: Job;
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export const JobAIAssistant: React.FC<JobAIAssistantProps> = ({ job, isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I'm your RoofRunners AI assistant. I've analyzed the job for ${job.client.name}. How can I help you optimize this claim or move the job forward?`,
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
  }, [messages]);

  const generateResponse = async (prompt: string, displayOverride?: string) => {
    // Defensive check for API Key
    if (!process.env.API_KEY) {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: "Error: API_KEY is missing from the environment. Please configure your API key to use Gemini features.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      text: displayOverride || prompt,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Construct context from the job object
      const context = `
        You are an expert roofing project manager and insurance restoration consultant for J&J Roofing Pros.
        
        CURRENT JOB CONTEXT:
        - Client: ${job.client.name} (${job.client.email || 'No email'})
        - Job Number: ${job.jobNumber}
        - Address: ${job.client.address}
        - Current Phase: ${job.phaseTracking.currentPhase} - ${PHASE_NAMES[job.phaseTracking.currentPhase]}
        - Days in Phase: ${job.phaseTracking.daysInPhase}
        - Stuck: ${job.phaseTracking.isStuck ? 'YES' : 'No'}
        
        FINANCIALS:
        - RCV (Revenue Potential): ${formatCurrency(job.financials.insurance.rcvTotal + job.financials.insurance.supplementsTotal)}
        - ACV Received: ${formatCurrency(job.financials.payments.acvReceived)}
        - Deductible: ${formatCurrency(job.financials.insurance.deductible)}
        - Est. Gross Profit: ${formatCurrency(job.financials.profitability.grossProfit)}
        - Gross Margin: ${job.financials.profitability.grossMargin.toFixed(1)}% (Target is >30%)
        
        DETAILS:
        - Damage Type: ${job.details.damageType}
        - Storm Date: ${job.details.stormDate}
        - Carrier: ${job.client.carrier}
        
        SUPPLEMENTS:
        ${job.supplements.length > 0 ? job.supplements.map(s => `- ${s.reason}: ${s.status} ($${s.amountRequested})`).join('\n') : 'No supplements filed.'}
        
        YOUR ROLE:
        Provide concise, actionable advice. If generating emails, make them professional. If analyzing financials, be critical about low margins.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: context,
        }
      });

      const aiMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: response.text || "I couldn't generate a response. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("AI Error:", error);
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: 'model',
        text: "Sorry, I encountered an error communicating with the AI service. Please try again.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    generateResponse(inputValue);
  };

  const QuickAction = ({ icon, label, prompt }: { icon: React.ReactNode, label: string, prompt: string }) => (
    <button 
      onClick={() => generateResponse(prompt, label)}
      disabled={isLoading}
      className="flex items-center space-x-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-sm font-medium transition-colors border border-blue-200"
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 border-l border-slate-200 flex flex-col">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-2">
          <Sparkles className="text-yellow-400" size={20} />
          <div>
            <h2 className="font-bold text-lg">Job Intelligence</h2>
            <p className="text-xs text-blue-200">Powered by Gemini 2.5 Flash</p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex space-x-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                {msg.role === 'user' ? <User size={14} className="text-white" /> : <Bot size={14} className="text-white" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-800 shadow-sm border border-slate-200 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center flex-shrink-0">
                <RefreshCw size={14} className="text-white animate-spin" />
              </div>
              <div className="p-3 bg-white text-slate-500 shadow-sm border border-slate-200 rounded-2xl rounded-tl-none text-sm italic">
                Thinking...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      <div className="p-3 bg-white border-t border-slate-200">
        <p className="text-xs text-slate-400 font-medium uppercase mb-2 ml-1">Suggested Actions</p>
        <div className="flex flex-wrap gap-2">
          <QuickAction 
            icon={<TrendingUp size={14} />} 
            label="Analyze Health" 
            prompt="Analyze this job's health. Look at the phase duration, margin, and missing info. Give me 3 bullet points on risks and next steps." 
          />
          <QuickAction 
            icon={<Mail size={14} />} 
            label="Draft Update" 
            prompt={`Draft a polite email to the client (${job.client.name}) updating them on our progress in Phase ${job.phaseTracking.currentPhase}. Keep it professional and reassuring.`} 
          />
          <QuickAction 
            icon={<Lightbulb size={14} />} 
            label="Supplement Ideas" 
            prompt="Based on the damage type and current financials, what are common supplement items we might have missed? List them with brief reasoning." 
          />
        </div>
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-200">
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask anything about this job..."
            className="w-full pl-4 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all shadow-sm"
          />
          <button 
            type="submit" 
            disabled={!inputValue.trim() || isLoading}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};