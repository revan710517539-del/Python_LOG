
import React, { useState } from 'react';
import { CustomerData } from '../types';
import { 
    Filter, Search, ChevronDown, ChevronUp, 
    MapPin, Briefcase, Phone, MessageSquare, TrendingUp, Sparkles, User,
    ListTodo, ChevronRight, X, CheckCircle2, Circle
} from 'lucide-react';

interface CustomerListProps {
  customers: Partial<CustomerData>[];
  onSelect: (id: string) => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({ customers, onSelect }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [todoModalId, setTodoModalId] = useState<string | null>(null);
  const notifyRouter = (payload: Record<string, unknown>) => {
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
          window.parent.postMessage({ source: 'router', ...payload }, '*');
      }
  };
  
  // Mock Todo List State
  const [todoStatus, setTodoStatus] = useState<Record<string, boolean>>({});

  // Helper for filter inputs
  const FilterItem = ({ label }: { label: string }) => (
    <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-gray-500">{label}</label>
        <div className="relative">
            <input 
                type="text" 
                className="w-full h-8 px-3 text-xs border border-gray-200 rounded hover:border-blue-400 focus:border-blue-500 focus:outline-none transition-colors"
                placeholder="请输入"
            />
            <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-300" />
        </div>
    </div>
  );

  const handleOpenTodo = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setTodoModalId(id);
  };

  const toggleTodo = (todoKey: string) => {
      setTodoStatus(prev => ({...prev, [todoKey]: !prev[todoKey]}));
  };
  const handleOpenCustomerInsight = (e: React.MouseEvent, name?: string) => {
      e.stopPropagation();
      if (!name) return;
      notifyRouter({
          type: 'open-customer-insight',
          customerName: name,
          targetProject: '常熟-理财助手',
      });
  };

  const currentCustomerForTodo = customers.find(c => c.id === todoModalId);
  const getTodos = (c: Partial<CustomerData>) => [
      { id: 't1', text: c.aiTodo || '完善客户信息' },
      { id: 't2', text: '完善客户KYC职业信息' },
      { id: 't3', text: '邀请客户加入企业微信' }
  ];

  return (
    <div className="h-full bg-[#F5F7FA] overflow-y-auto p-4 lg:p-6 relative">
       <div className="max-w-7xl mx-auto space-y-4">
          
          {/* Header & Filter Area */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  {/* Title */}
                  <div className="flex items-center gap-2">
                      <div className="w-1 h-5 bg-blue-600 rounded-full"></div>
                      <h1 className="text-lg font-bold text-gray-800">个人列表</h1>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full border border-blue-100">{customers.length}户</span>
                  </div>
                  
                  {/* Search & Toggle */}
                  <div className="flex items-center gap-3 w-full md:w-auto">
                      <div className="relative flex-1 md:w-64">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                          <input 
                              type="text" 
                              placeholder="快速搜索..." 
                              className="w-full pl-9 pr-4 h-9 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
                          />
                      </div>
                      <button 
                          onClick={() => setShowAdvanced(!showAdvanced)}
                          className={`flex items-center gap-1.5 px-3 h-9 text-xs font-medium rounded-lg border transition-colors ${showAdvanced ? 'bg-blue-50 border-blue-200 text-blue-600' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                      >
                          <Filter size={14} />
                          高级筛选
                          {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                      </button>
                  </div>
              </div>

              {/* Advanced Filter Panel */}
              {showAdvanced && (
                  <div className="pt-4 border-t border-dashed border-gray-100 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-4 animate-in slide-in-from-top-1">
                      <FilterItem label="管户机构 (支行)" />
                      <FilterItem label="管户机构 (分理处)" />
                      <FilterItem label="管户客户经理" />
                      <FilterItem label="管户分层" />
                      <FilterItem label="会员等级" />
                      <FilterItem label="客户名" />
                      <FilterItem label="证件号" />
                      <FilterItem label="手机号" />
                      <FilterItem label="信贷管户经理" />
                      <FilterItem label="标签" />
                      
                      <div className="col-span-2 md:col-span-4 lg:col-span-5 flex justify-end gap-3 mt-2">
                          <button 
                            onClick={() => setShowAdvanced(false)}
                            className="px-5 h-8 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                          >
                              收起
                          </button>
                          <button className="px-6 h-8 bg-blue-600 text-white text-xs font-medium rounded shadow-sm hover:bg-blue-700 transition-colors">
                              查询
                          </button>
                      </div>
                  </div>
              )}
          </div>

          {/* Cards List */}
          <div className="grid gap-4">
              {customers.map((c) => (
                  <div 
                    key={c.id}
                    onClick={() => c.id && onSelect(c.id)}
                    className="group bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer overflow-hidden p-6"
                  >
                      <div className="flex flex-col md:flex-row gap-6">
                          
                          {/* Left: Avatar - Strictly Blue Circle with User Icon */}
                          <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                    <User size={28} strokeWidth={1.5} />
                                </div>
                          </div>

                          {/* Middle: Content - Strictly Matching Screenshot Layout */}
                          <div className="flex-1 min-w-0 flex flex-col gap-3">
                                {/* Row 1: Name, ID, Tags, Metrics */}
                                <div className="flex flex-wrap items-baseline gap-3">
                                    <h3 className="text-xl font-bold text-gray-900">{c.kyc?.customerName}</h3>
                                    <span className="text-sm text-gray-400 font-normal">ID:{c.customerIdDisplay}</span>
                                    
                                    {/* Local Tag */}
                                    {c.tags?.includes('本地') && (
                                        <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded">本地</span>
                                    )}

                                    {/* AUM - Amber Highlight */}
                                    <span className="px-2 py-0.5 bg-[#FFF7ED] text-[#C2410C] text-sm font-bold rounded border border-[#FFEDD5]">
                                        AUM {c.aum}
                                    </span>

                                    {/* Activity Rate - Blue Highlight */}
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                                        近30天交易活跃度 {c.activityRate}
                                    </span>

                                    {/* Penetration Rate - Blue Highlight */}
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                                        产品渗透率 {c.penetrationRate}
                                    </span>
                                </div>

                                {/* Row 2: Icons & Info (Gray Text) */}
                                <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <MapPin size={14} className="text-gray-400"/>
                                        <span>{c.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Briefcase size={14} className="text-gray-400"/>
                                        <span>{c.businessType}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone size={14} className="text-gray-400"/>
                                        <span className="font-mono">{c.kyc?.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MessageSquare size={14} className="text-gray-400"/>
                                        <span>最近互动 {c.lastInteraction}</span>
                                    </div>
                                    {/* Asset Change - Green/Red */}
                                    <div className="flex items-center gap-1 font-medium">
                                        <TrendingUp size={14} className={c.assetChange?.startsWith('-') ? 'text-green-500' : 'text-red-500'} />
                                        <span className={c.assetChange?.startsWith('-') ? 'text-green-500' : 'text-red-500'}>
                                            资产变化 {c.assetChange}
                                        </span>
                                    </div>
                                </div>

                                {/* Row 3: AI Insight & Todo Box */}
                                <div className="mt-1 bg-[#F8FAFC] rounded-lg p-3 border border-slate-100 flex flex-col gap-2">
                                    {/* Insight */}
                                    <div className="flex items-start gap-2">
                                        <div className="p-0.5 bg-blue-600 rounded text-white mt-0.5 flex-shrink-0">
                                            <Sparkles size={12} fill="currentColor" />
                                        </div>
                                        <div className="text-sm leading-relaxed text-gray-600">
                                            <span className="font-bold text-blue-700 mr-2">AI核心洞察</span>
                                            {c.aiInsight}
                                        </div>
                                    </div>
                                    {/* Todo */}
                                    <div 
                                        className="flex items-start gap-2 border-t border-slate-200/50 pt-2 cursor-pointer hover:bg-orange-50/50 rounded -mx-1 px-1 transition-colors group/todo"
                                        onClick={(e) => c.id && handleOpenTodo(e, c.id)}
                                    >
                                        <div className="p-0.5 bg-orange-500 rounded text-white mt-0.5 flex-shrink-0">
                                            <ListTodo size={12} />
                                        </div>
                                        <div className="flex-1 text-sm leading-relaxed text-gray-600 flex justify-between items-center">
                                            <div>
                                                <span className="font-bold text-orange-600 mr-2">AI推荐待办</span>
                                                {c.aiTodo}
                                            </div>
                                            <ChevronRight size={16} className="text-gray-400 group-hover/todo:text-orange-500 transition-colors" />
                                        </div>
                                    </div>
                                </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex flex-row md:flex-col gap-3 md:w-32 flex-shrink-0 justify-center border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                                <button 
                                    onClick={(e) => handleOpenCustomerInsight(e, c.kyc?.customerName)}
                                    className="h-9 w-full flex items-center justify-center gap-1.5 bg-white border border-blue-200 text-blue-600 text-xs font-medium rounded hover:bg-blue-50 transition-colors"
                                >
                                    <Sparkles size={14} /> AI洞察
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); c.id && onSelect(c.id); }}
                                    className="h-9 w-full flex items-center justify-center gap-1.5 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700 shadow-sm transition-colors"
                                >
                                    <MessageSquare size={14} /> AI拜访
                                </button>
                          </div>
                      </div>
                  </div>
              ))}
          </div>

          {/* Todo Modal */}
          {todoModalId && currentCustomerForTodo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col max-h-[80vh]">
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                          <h3 className="font-bold text-gray-800 flex items-center gap-2">
                              <ListTodo size={18} className="text-orange-500" />
                              待办清单
                          </h3>
                          <button onClick={() => setTodoModalId(null)} className="text-gray-400 hover:text-gray-600">
                              <X size={20} />
                          </button>
                      </div>
                      
                      <div className="p-4 flex-1 overflow-y-auto space-y-3">
                          <p className="text-xs text-gray-400 mb-2">客户：{currentCustomerForTodo.kyc?.customerName}</p>
                          {getTodos(currentCustomerForTodo).map((todo) => {
                              const isCompleted = todoStatus[todo.id + todoModalId] || false;
                              return (
                                  <div 
                                    key={todo.id} 
                                    className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                                        isCompleted 
                                            ? 'bg-green-50 border-green-100' 
                                            : 'bg-white border-gray-200 hover:border-blue-200'
                                    }`}
                                  >
                                      <span className={`text-sm ${isCompleted ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                                          {todo.text}
                                      </span>
                                      <button 
                                        onClick={() => toggleTodo(todo.id + todoModalId)}
                                        className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-colors ${
                                            isCompleted 
                                                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                                                : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600'
                                        }`}
                                      >
                                          {isCompleted ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                                          {isCompleted ? '已完成' : '完成'}
                                      </button>
                                  </div>
                              )
                          })}
                      </div>

                      <div className="p-4 border-t border-gray-100 grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => setTodoModalId(null)}
                            className="py-2.5 rounded-lg border border-gray-200 text-gray-600 text-sm font-bold hover:bg-gray-50"
                          >
                              关闭弹窗
                          </button>
                          <button 
                            onClick={() => onSelect(todoModalId!)}
                            className="py-2.5 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-sm"
                          >
                              AI拜访
                          </button>
                      </div>
                  </div>
              </div>
          )}
       </div>
    </div>
  );
};
