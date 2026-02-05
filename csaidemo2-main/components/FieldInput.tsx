
import React, { useState, useEffect } from 'react';
import { Pencil, Check, X, Star } from 'lucide-react';

interface FieldInputProps {
  label: string;
  subLabel?: string; 
  value: string;
  fieldKey: string;
  onSave: (val: string) => void;
  lastUpdated: number; 
  isAIUpdated: boolean;
  stars?: number; 
  showStars?: boolean;
}

export const FieldInput: React.FC<FieldInputProps> = ({
  label,
  subLabel,
  value,
  fieldKey,
  onSave,
  lastUpdated,
  isAIUpdated,
  stars = 0,
  showStars = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    // Trigger highlight animation if updated recently (within 2 seconds) and by AI
    const now = Date.now();
    if (isAIUpdated && (now - lastUpdated < 3000)) {
      setHighlight(true);
      const timer = setTimeout(() => setHighlight(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [lastUpdated, isAIUpdated, value]);

  const handleSave = () => {
    onSave(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  return (
    <div className={`flex flex-col group/field transition-all duration-500 rounded-lg p-3 border border-gray-100 hover:border-blue-200 hover:shadow-sm bg-white ${highlight ? 'bg-green-50 ring-1 ring-green-200' : ''}`}>
      
      {/* Header: Title + Stars */}
      <div className="flex items-center justify-between mb-1">
          <label className="text-sm font-bold text-gray-800">
              {label}
          </label>
          
          {/* Stars rendering */}
          {showStars && (
            <div className="flex gap-0.5">
                 {[1, 2, 3].map(i => (
                     <Star 
                        key={i} 
                        size={12} 
                        className={`${i <= (stars || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} 
                     />
                 ))}
            </div>
          )}
      </div>

      {/* Guide Words (Sublabel) - Always Visible */}
      {subLabel && (
          <div className="text-[10px] text-gray-400 mb-2 leading-tight">
              {subLabel}
          </div>
      )}
      
      {/* Content Input Area */}
      {isEditing ? (
        <div className="flex items-start gap-2 animate-in fade-in zoom-in-95 mt-1">
          <textarea
            className="flex-1 border border-blue-400 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 bg-white resize-none"
            rows={2}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSave();
              }
              if (e.key === 'Escape') handleCancel();
            }}
          />
          <div className="flex flex-col gap-1">
            <button onClick={handleSave} className="text-green-600 hover:bg-green-50 p-1 rounded">
                <Check size={16} />
            </button>
            <button onClick={handleCancel} className="text-gray-400 hover:bg-gray-100 p-1 rounded">
                <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div 
          className="flex items-start justify-between cursor-pointer min-h-[24px] mt-1"
          onClick={() => setIsEditing(true)}
        >
          <p className={`text-sm leading-relaxed w-full break-words ${!value ? 'text-gray-300 italic' : 'text-gray-700'}`}>
            {value || '点击补充信息...'}
          </p>
          <Pencil size={12} className="text-blue-400 opacity-0 group-hover/field:opacity-100 transition-opacity mt-1 ml-2 flex-shrink-0" />
        </div>
      )}
    </div>
  );
};
