
import React, { useState, useRef, useEffect } from 'react';
import { Message, ComparisonItem } from '../types';
import { Mic, Image as ImageIcon, Keyboard, X, Bot, Plus, Clock, Edit2, CheckCircle2, Sparkles, Search, Maximize2, RefreshCw, Send, Radio, Play, HelpCircle, AlertTriangle } from 'lucide-react';
import { analyzeVisitInput, fileToGenerativePart } from '../services/geminiService';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (msg: Message) => void;
  onDataExtracted: (data: any) => void;
  onPreviewImage: (url: string) => void;
  onOpenComparison: (data: ComparisonItem[]) => void;
  onQuickUpdate: (data: ComparisonItem[]) => void;
}

// Sub-component for Waveform Animation
const Waveform = () => (
    <div className="flex items-center gap-1 h-6">
        {[...Array(15)].map((_, i) => (
            <div 
                key={i} 
                className="w-1 bg-white/80 rounded-full animate-pulse"
                style={{ 
                    height: `${Math.random() * 100}%`,
                    animationDuration: `${0.5 + Math.random() * 0.5}s`
                }}
            />
        ))}
    </div>
);

// Sub-component for Thinking Steps
const ThinkingProcess = ({ type, step, streamingText, stepDescription }: { type: 'voice' | 'text', step: number, streamingText?: string, stepDescription?: string }) => {
    const steps = type === 'voice' 
        ? ['音转字', '意图识别', '关键信息提取']
        : ['意图识别', '关键信息提取'];
    
    return (
        <div className="flex flex-col gap-2 p-3 bg-blue-50/50 rounded-lg w-full max-w-sm mb-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 mb-1">
                <Sparkles size={12} className="animate-spin-slow" />
                AI思考中...
            </div>
            
            <div className="flex flex-col gap-3 mt-1">
                {steps.map((label, idx) => {
                    const isActive = idx === step;
                    const isCompleted = idx < step;
                    
                    // Determine content to show below this step
                    let content = null;
                    if (isActive) {
                        if (type === 'voice' && idx === 0) {
                             // Step 0 in Voice: Show Streaming Text (STT)
                             content = (
                                <div className="ml-5 mt-1 bg-white/60 p-2 rounded border border-blue-100">
                                    <p className="text-xs text-gray-600 animate-pulse font-mono leading-relaxed break-all">
                                        {streamingText || '正在接收语音流...'}
                                        <span className="inline-block w-1.5 h-3 bg-blue-400 ml-1 animate-blink align-middle"></span>
                                    </p>
                                </div>
                             );
                        } else if (stepDescription) {
                            // Other active steps: Show description
                             content = (
                                <div className="ml-5 mt-1 text-[10px] text-blue-600/80 italic animate-in fade-in">
                                    {stepDescription}
                                </div>
                             );
                        }
                    }

                    return (
                        <div key={idx} className="flex flex-col">
                            <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${isActive || isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                                <div className={`w-3 h-3 rounded-full flex items-center justify-center border flex-shrink-0 ${isCompleted ? 'bg-blue-500 border-blue-500' : isActive ? 'border-blue-500' : 'border-gray-300'}`}>
                                    {isCompleted && <CheckCircle2 size={8} className="text-white" />}
                                    {isActive && <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />}
                                </div>
                                {label}
                            </div>
                            {content}
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  onSendMessage,
  onDataExtracted,
  onPreviewImage,
  onOpenComparison,
  onQuickUpdate
}) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [inputType, setInputType] = useState<'voice' | 'text'>('text');
  const [streamingText, setStreamingText] = useState(''); // Text appearing during STT step
  const [stepDescription, setStepDescription] = useState(''); // Dynamic description for thinking steps

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isVoiceMode, setIsVoiceMode] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordTimerRef = useRef<number | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, processingStep, streamingText, stepDescription]);

  // Handle Recording Timer
  useEffect(() => {
      if (isRecording) {
          recordTimerRef.current = window.setInterval(() => {
              setRecordTime(prev => prev + 1);
          }, 1000);
      } else {
          if (recordTimerRef.current) clearInterval(recordTimerRef.current);
          setRecordTime(0);
      }
      return () => {
          if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = seconds % 60;
      return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsVoiceMode(false); 
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const startRecording = () => {
      setIsRecording(true);
  };

  const stopAndSendRecording = () => {
      const duration = recordTime;
      setIsRecording(false);
      
      const fullText = "这段录音主要是关于李思思的，她是纺织行业的，组织机构代码是91440300MA5F8RXX5L。目前仓库成品平均一个月发完。她配偶在外面也开了2家同业公司。每天工作时长大概是早8晚10。";
      
      // Create Voice Message immediately
      const voiceMsgId = Date.now().toString();
      const voiceMsg: Message = {
          id: voiceMsgId,
          role: 'user',
          type: 'voice',
          duration: duration,
          content: fullText, // The extracted content hidden or used later
          timestamp: Date.now()
      };
      onSendMessage(voiceMsg);

      // Start processing flow
      handleProcessing(fullText, 'voice');
  };

  const handleSend = async (overrideText?: string, type: 'voice' | 'text' = 'text') => {
    const textToSend = overrideText || inputText;
    if ((!textToSend.trim() && !selectedImage) || isProcessing) return;

    // For text, add message immediately. For voice, it's already added in stopAndSendRecording
    if (type === 'text') {
        const userMsgId = Date.now().toString();
        const newUserMsg: Message = {
            id: userMsgId,
            role: 'user',
            type: 'text',
            content: textToSend || (selectedImage ? '已上传图片' : ''),
            imageUri: previewUrl || undefined,
            timestamp: Date.now()
        };
        onSendMessage(newUserMsg);
        setInputText('');
    }

    handleProcessing(textToSend, type);
  };

  const handleProcessing = async (text: string, type: 'voice' | 'text') => {
    setInputType(type);
    setIsProcessing(true);
    setProcessingStep(0);
    setStreamingText('');
    setStepDescription('');
    
    // Simulate Thinking Process
    if (type === 'voice') {
        // Step 0: Speech to Text Streaming
        // Text is streamed directly in the ThinkingProcess component via streamingText prop
        const chars = text.split('');
        for (let i = 0; i < chars.length; i++) {
            setStreamingText(prev => prev + chars[i]);
            await new Promise(resolve => setTimeout(resolve, 30)); // fast typing effect
        }
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Step 1: Intent
        setProcessingStep(1); 
        // Stream text for intent
        const intentText = "识别到输入内容属于拜访纪要，正在执行关键信息提取...";
        setStepDescription(""); // Clear first
        for (let i = 0; i < intentText.length; i++) {
            setStepDescription(prev => prev + intentText[i]);
            await new Promise(resolve => setTimeout(resolve, 20)); 
        }
        await new Promise(resolve => setTimeout(resolve, 800));

        // Step 2: Extraction
        setProcessingStep(2); 
        const extractionText = "正在生成结构化对比表格...";
        setStepDescription("");
        for (let i = 0; i < extractionText.length; i++) {
            setStepDescription(prev => prev + extractionText[i]);
            await new Promise(resolve => setTimeout(resolve, 20)); 
        }
        await new Promise(resolve => setTimeout(resolve, 800));
    } else {
        // Text mode steps
        // Step 0: Intent (index 0 for text mode logical mapping in UI)
        setProcessingStep(0);
        setStepDescription("正在分析用户意图...");
        await new Promise(resolve => setTimeout(resolve, 600));
        
        setProcessingStep(1);
        setStepDescription("正在提取关键业务信息...");
        await new Promise(resolve => setTimeout(resolve, 600));
    }
    
    // Process with Gemini
    try {
      let imageBase64: string | undefined;
      let mimeType = 'image/jpeg';
      
      if (selectedImage) {
        imageBase64 = await fileToGenerativePart(selectedImage);
        mimeType = selectedImage.type;
        clearImage();
      }

      const extractedData = await analyzeVisitInput(text, imageBase64, mimeType);
      
      // Completion Step: Mark everything as done before showing result
      setProcessingStep(prev => prev + 1); // Move past the last step to mark it completed
      setStepDescription(""); 
      await new Promise(resolve => setTimeout(resolve, 500)); // Visual pause to show all checkmarks

      onDataExtracted(extractedData);

    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
         id: (Date.now() + 1).toString(),
         role: 'model',
         content: "抱歉，处理您的请求时遇到问题，请重试。",
         timestamp: Date.now()
      };
      onSendMessage(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(undefined, 'text');
    }
  };

  // State for inline editing in chat card
  const [editingCardId, setEditingCardId] = useState<string | null>(null);
  const [editingValues, setEditingValues] = useState<Record<string, string>>({});

  const toggleEdit = (msgId: string, fieldKey: string, currentValue: string) => {
      setEditingCardId(msgId);
      setEditingValues(prev => ({
          ...prev,
          [`${msgId}-${fieldKey}`]: prev[`${msgId}-${fieldKey}`] || currentValue
      }));
  };

  const updateEditValue = (msgId: string, fieldKey: string, val: string) => {
      setEditingValues(prev => ({
          ...prev,
          [`${msgId}-${fieldKey}`]: val
      }));
  };

  // Helper to sync edited values back to the data structure before sending to update
  const getMergedDataForUpdate = (msg: Message) => {
      if (!msg.comparisonData) return [];
      return msg.comparisonData.map(item => ({
          ...item,
          aiValue: editingValues[`${msg.id}-${item.fieldKey}`] || item.aiValue
      }));
  };

  return (
    <div className="h-full flex flex-col bg-white relative font-sans">
       {/* History Header */}
       <div className="absolute top-4 right-4 z-10">
            <button className="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-600 transition-colors">
                <Clock size={12}/> 历史对话
            </button>
       </div>

       {/* Messages Area */}
       <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide pb-24">
          {messages.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center -mt-10 animate-in fade-in duration-700">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 flex items-center justify-center shadow-lg shadow-blue-200 mb-6 animate-bounce-slow">
                    <Bot size={40} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 mb-2 tracking-tight">HI，我是你的AI拜访助手</h2>
                <p className="text-sm text-gray-400 font-light text-center px-6">上传相关材料，我来帮你解析并同步至拜访记录</p>
             </div>
          ) : (
             <>
             {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex w-full animate-in slide-in-from-bottom-2 duration-300 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                   {msg.role === 'model' && (
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 flex items-center justify-center shadow-sm mr-2 flex-shrink-0 mt-1">
                           <Bot size={16} className="text-white" />
                       </div>
                   )}
                   
                   <div className={`max-w-[90%] ${msg.role === 'user' ? 'flex justify-end' : ''}`}>
                      {/* Voice Bubble (User) */}
                      {msg.role === 'user' && msg.type === 'voice' && (
                          <div className="flex items-center gap-2 bg-blue-600 text-white rounded-2xl rounded-br-none px-4 py-3 shadow-sm min-w-[120px] cursor-pointer hover:bg-blue-700 transition-colors">
                              <Play size={16} fill="white" />
                              <div className="flex-1 h-1 bg-blue-400/50 rounded-full mx-2 overflow-hidden">
                                   {/* Fake progress bar */}
                                   <div className="h-full bg-white/80 w-1/3 rounded-full"></div>
                              </div>
                              <span className="font-mono text-sm">{msg.duration || 15}s</span>
                          </div>
                      )}

                      {/* Standard Text/Image Bubble (User or Model Text) */}
                      {msg.role === 'user' && msg.type !== 'voice' && (
                           <div className="bg-blue-600 text-white rounded-2xl rounded-br-none p-3.5 shadow-sm text-sm leading-relaxed">
                                {msg.imageUri && (
                                    <div className="mb-2 relative group overflow-hidden rounded-lg">
                                    <img 
                                        src={msg.imageUri} 
                                        alt="Uploaded content" 
                                        className="max-h-40 w-full object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                        onClick={() => onPreviewImage(msg.imageUri!)}
                                    />
                                    </div>
                                )}
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                           </div>
                      )}
                      
                      {/* Model Simple Text Bubble (No comparison data, no suggestions) */}
                      {msg.role === 'model' && !msg.comparisonData && !msg.suggestions && (
                           <div className="bg-white text-gray-800 border border-gray-100 rounded-2xl rounded-bl-none shadow-[0_2px_8px_-2px_rgba(0,0,0,0.05)] p-3.5 text-sm leading-relaxed">
                                <p className="whitespace-pre-wrap">{msg.content}</p>
                           </div>
                      )}

                      {/* Suggestion Bubble (Questions Hint) */}
                      {msg.suggestions && (
                          <div className="bg-white rounded-xl border border-gray-200 shadow-md p-4 w-full max-w-sm mt-1 animate-in fade-in slide-in-from-bottom-1">
                               <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold mb-3">
                                    <HelpCircle size={12} className="text-blue-500" />
                                    <span>{msg.content}</span>
                               </div>
                               <div className="space-y-2">
                                   {msg.suggestions.map((s, idx) => (
                                       <div key={idx} className="text-xs text-gray-700 bg-gray-50 px-3 py-2.5 rounded-lg border border-transparent hover:border-blue-100 hover:bg-blue-50 transition-colors cursor-pointer leading-relaxed">
                                           {s}
                                       </div>
                                   ))}
                               </div>
                          </div>
                      )}

                      {/* Comparison Card Bubble (Model) */}
                      {msg.comparisonData && (
                          <div className="bg-white rounded-xl border border-gray-200 shadow-md overflow-hidden w-full max-w-sm">
                              {/* Header */}
                              <div className="bg-blue-50/50 p-3 border-b border-gray-100 flex justify-between items-center">
                                  <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold">
                                      <Sparkles size={12} fill="currentColor" />
                                      AI解析完成
                                  </div>
                              </div>
                              
                              <div className="p-4 bg-white">
                                  {msg.content && (
                                     <div className="text-xs text-gray-500 mb-4 leading-relaxed">
                                         {msg.content}
                                     </div>
                                  )}

                                  {/* Table Header */}
                                  <div className="grid grid-cols-12 gap-2 bg-gray-50 p-2 rounded-t-lg text-[10px] text-gray-500 font-bold border-b border-gray-200">
                                      <div className="col-span-4">信息标题</div>
                                      <div className="col-span-5 text-blue-600">✨ AI解析结果</div>
                                      <div className="col-span-3 text-right">操作</div>
                                  </div>
                                  
                                  {/* Rows */}
                                  <div className="border border-gray-100 border-t-0 rounded-b-lg divide-y divide-gray-100 max-h-[300px] overflow-y-auto">
                                      {msg.comparisonData.map((item, idx) => {
                                          const isEditing = editingCardId === msg.id && editingValues[`${msg.id}-${item.fieldKey}`] !== undefined;
                                          const displayValue = editingValues[`${msg.id}-${item.fieldKey}`] ?? item.aiValue;

                                          return (
                                          <div key={idx} className="grid grid-cols-12 gap-2 p-2.5 items-center hover:bg-gray-50 transition-colors text-xs">
                                              <div className="col-span-4 text-gray-500 font-medium truncate" title={item.label}>
                                                  {item.label}
                                              </div>
                                              <div className="col-span-6 flex items-center gap-1 text-gray-800 font-medium">
                                                  <CheckCircle2 size={12} className="text-blue-500 flex-shrink-0" fill="#EBF5FF" />
                                                  {isEditing ? (
                                                      <input 
                                                          className="w-full bg-blue-50 border-b border-blue-300 focus:outline-none px-1"
                                                          value={displayValue}
                                                          onChange={(e) => updateEditValue(msg.id, item.fieldKey, e.target.value)}
                                                          autoFocus
                                                          onBlur={() => setEditingCardId(null)} // simplistic blur
                                                      />
                                                  ) : (
                                                      <span className="truncate" title={displayValue}>{displayValue}</span>
                                                  )}
                                              </div>
                                              <div className="col-span-2 flex justify-end">
                                                  <button 
                                                    onClick={() => toggleEdit(msg.id, item.fieldKey, item.aiValue)}
                                                    className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-blue-600"
                                                  >
                                                      <Edit2 size={12} />
                                                  </button>
                                              </div>
                                          </div>
                                      )})}
                                  </div>

                                  {/* Action Buttons */}
                                  <div className="mt-4 flex gap-2">
                                      <button 
                                        onClick={() => onOpenComparison(getMergedDataForUpdate(msg))}
                                        className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 flex items-center justify-center gap-1.5"
                                      >
                                          <Maximize2 size={12} /> 全屏查看
                                      </button>
                                      <button 
                                        onClick={() => onQuickUpdate(getMergedDataForUpdate(msg))}
                                        className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm flex items-center justify-center gap-1.5"
                                      >
                                          <RefreshCw size={12} /> 一键更新
                                      </button>
                                  </div>
                              </div>
                          </div>
                      )}
                   </div>
                </div>
             ))}

             {isProcessing && (
                <div className="flex justify-start w-full animate-in fade-in">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-400 to-indigo-400 flex items-center justify-center shadow-sm mr-2 flex-shrink-0 mt-1">
                       <Bot size={16} className="text-white" />
                   </div>
                   <ThinkingProcess type={inputType} step={processingStep} streamingText={streamingText} stepDescription={stepDescription} />
                </div>
             )}
             <div ref={messagesEndRef} />
             </>
          )}
       </div>

       {/* Recording Overlay - Replaces Input Bar when Recording */}
       {isRecording ? (
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 pb-6 absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <button onClick={() => setIsRecording(false)} className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center">
                    <div className="text-white font-mono font-bold mb-1">录音中 {formatTime(recordTime)}</div>
                    <Waveform />
                </div>

                <button onClick={stopAndSendRecording} className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center hover:scale-105 transition-transform shadow-lg">
                    <Send size={20} fill="currentColor" />
                </button>
            </div>
       ) : (
           /* Bottom Input Area */
           <div className="bg-white border-t border-gray-100 px-4 py-3 pb-6 absolute bottom-0 left-0 right-0 z-20">
               {/* Image Preview Overlay */}
               {previewUrl && (
                    <div className="absolute bottom-full left-4 mb-2 z-20 animate-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 p-2 bg-white rounded-lg shadow-lg border border-gray-100 pr-3">
                            <img src={previewUrl} alt="Preview" className="h-12 w-12 object-cover rounded-md" />
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-700">已选择图片</span>
                                <span className="text-[10px] text-gray-400 max-w-[100px] truncate">{selectedImage?.name}</span>
                            </div>
                            <button onClick={clearImage} className="text-gray-400 hover:text-red-500 p-1.5 bg-gray-50 rounded-full ml-2">
                                <X size={14} />
                            </button>
                        </div>
                    </div>
               )}

               <div className="flex items-center gap-4">
                   <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-colors"
                   >
                       <ImageIcon size={24} strokeWidth={1.5} />
                       <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleImageSelect}
                       />
                   </button>

                   <div className="flex-1">
                       {isVoiceMode ? (
                           <button 
                             className="w-full h-10 bg-white border border-gray-200 shadow-sm rounded-full text-sm font-bold text-gray-700 hover:bg-gray-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                             onClick={startRecording}
                           >
                               <Mic size={16} className="text-gray-400" />
                               点击说话
                           </button>
                       ) : (
                            <div className="relative">
                                <input
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="w-full h-10 bg-gray-50 border border-gray-200 rounded-full px-4 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all pr-10"
                                    placeholder={selectedImage ? "描述图片内容..." : "请输入内容..."}
                                    autoFocus
                                />
                                <button 
                                    onClick={() => handleSend(undefined, 'text')}
                                    className={`absolute right-1 top-1 w-8 h-8 rounded-full flex items-center justify-center transition-all ${inputText || selectedImage ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-300'}`}
                                    disabled={!inputText && !selectedImage}
                                >
                                    <Plus size={18} className={inputText || selectedImage ? 'rotate-0' : 'rotate-45'} />
                                </button>
                            </div>
                       )}
                   </div>

                   <button 
                      onClick={() => setIsVoiceMode(!isVoiceMode)}
                      className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors"
                   >
                       {isVoiceMode ? <Keyboard size={24} strokeWidth={1.5} /> : <Mic size={24} strokeWidth={1.5} />}
                   </button>
               </div>
           </div>
       )}
    </div>
  );
};
