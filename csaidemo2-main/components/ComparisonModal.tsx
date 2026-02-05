
import React, { useState, useEffect } from 'react';
import { ComparisonItem, Opportunity } from '../types';
import { X, Check, ArrowRight, Edit2, Bot, Database } from 'lucide-react';

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparisonData: ComparisonItem[];
  onConfirm: (data: ComparisonItem[]) => void;
}

export const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  comparisonData,
  onConfirm
}) => {
  const [items, setItems] = useState<ComparisonItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      setItems(JSON.parse(JSON.stringify(comparisonData))); // Deep copy
    }
  }, [isOpen, comparisonData]);

  const handleValueChange = (index: number, newValue: string) => {
    const newItems = [...items];
    newItems[index].aiValue = newValue;
    setItems(newItems);
  };

  if (!isOpen) return null;

  // Group items by type (inferred from fieldKey)
  const groupedItems = items.reduce((acc, item) => {
    const type = item.fieldKey.startsWith('kyc.') ? 'KYC信息' : 
                 item.fieldKey.startsWith('softInfo.') ? '软信息' : '新商机';
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {} as Record<string, ComparisonItem[]>);

  // Helper to find the original index in the flat 'items' array
  const getOriginalIndex = (item: ComparisonItem) => {
      return items.indexOf(item);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Bot size={24} className="text-blue-600" />
             </div>
             <div>
                 <h2 className="text-lg font-bold text-gray-800">数据提取确认</h2>
                 <p className="text-xs text-gray-500">已为您解析 {items.length} 项内容，【更新】后，资料完整度将提升</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
           <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
               {/* Table Header */}
               <div className="grid grid-cols-12 gap-4 bg-gray-50/80 px-4 py-3 border-b border-gray-200 text-xs font-bold text-gray-500">
                   <div className="col-span-2 text-center">信息类型</div>
                   <div className="col-span-3">客户信息项</div>
                   <div className="col-span-4 text-blue-600 flex items-center gap-1">
                       <Bot size={14} /> AI解析结果 (新)
                   </div>
                   <div className="col-span-3 text-gray-400 flex items-center gap-1 justify-end pr-2">
                       <Database size={14} /> 系统已存信息 (旧)
                   </div>
               </div>

               {/* Table Body */}
               <div className="divide-y divide-gray-100">
                   {Object.entries(groupedItems).map(([type, groupItems], groupIdx) => (
                       <React.Fragment key={type}>
                           {groupItems.map((item, itemIdx) => {
                               const realIndex = getOriginalIndex(item);
                               const isFirstInGroup = itemIdx === 0;
                               
                               return (
                                   <div key={item.fieldKey} className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-blue-50/30 transition-colors group">
                                       {/* Group Label (Merged Cell Effect) */}
                                       <div className="col-span-2 flex justify-center">
                                            {isFirstInGroup && (
                                                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-bold shadow-sm border border-gray-200">
                                                    {type}
                                                </span>
                                            )}
                                       </div>
                                       
                                       <div className="col-span-3 text-sm text-gray-700 font-bold">
                                           {item.label}
                                       </div>

                                       <div className="col-span-4 relative">
                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    <input 
                                                        type="text" 
                                                        value={item.aiValue}
                                                        onChange={(e) => handleValueChange(realIndex, e.target.value)}
                                                        className="w-full text-sm font-bold text-gray-900 bg-transparent border-b border-transparent hover:border-blue-200 focus:border-blue-500 focus:outline-none focus:bg-white transition-all py-1"
                                                    />
                                                    <Edit2 size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-hover:text-blue-400" />
                                                </div>
                                            </div>
                                       </div>

                                       <div className="col-span-3 text-sm text-gray-400 text-right pr-2">
                                           {item.currentValue || <span className="text-gray-300 italic">空</span>}
                                       </div>
                                   </div>
                               );
                           })}
                       </React.Fragment>
                   ))}
               </div>
           </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-gray-100 bg-white flex justify-center gap-4">
            <button 
                onClick={onClose}
                className="px-8 py-2.5 rounded-full border border-gray-300 text-gray-600 text-sm font-bold hover:bg-gray-50 transition-colors"
            >
                放弃更新
            </button>
            <button 
                onClick={() => onConfirm(items)}
                className="px-8 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
                <Check size={16} /> 确定更新勾选项
            </button>
        </div>
      </div>
    </div>
  );
};
