
import React, { useRef, useState, useEffect } from 'react';
import { CustomerData, Opportunity, KYCData, SoftInfo, OpportunityCategory } from '../types';
import { FieldInput } from './FieldInput';
import { 
    CheckCircle2, AlertCircle, TrendingUp, User, FileText, Phone, MapPin, 
    CreditCard, ChevronDown, RefreshCcw, Calendar, Coins, Tag, Plus, 
    Pencil, Trash2, X, Check, Save
} from 'lucide-react';

interface RegistrationBoardProps {
  data: CustomerData;
  onUpdateField: (category: 'kyc' | 'softInfo', key: string, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSuccess: boolean;
  fieldUpdateTimestamps: Record<string, number>;
  onUpdateOpportunity: (opp: Opportunity) => void;
  onAddOpportunity: (opp: Opportunity) => void;
  onDeleteOpportunity: (id: string) => void;
}

// Category Definitions
const OPP_CATEGORIES: Record<OpportunityCategory, string[]> = {
    '资产类': ['个人贷款（授信）', '对公贷款需求', '信用卡需求', '票据贴现需求'],
    '财富类': ['他行存款到期需求', '定期需求', '活期需求', '保险需求', '贵金属需求', '理财需求', '代发业务需求', '结构性存款需求'],
    '其他类': ['码上付需求', '社保卡需求', '企业微信需求', '数币归集需求', '经纪人需求', '借记卡需求', '其他需求']
};

const OpportunityCard: React.FC<{
    opp: Opportunity;
    onSave: (opp: Opportunity) => void;
    onDelete: (id: string) => void;
}> = ({ opp, onSave, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempOpp, setTempOpp] = useState({ ...opp });

    useEffect(() => {
        setTempOpp({ ...opp });
    }, [opp]);

    const handleSave = () => {
        onSave(tempOpp);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setTempOpp({ ...opp });
        setIsEditing(false);
    };

    // Style Helpers
    const getCategoryColor = (cat: string) => {
        switch(cat) {
            case '资产类': return 'bg-blue-50 text-blue-700 border-blue-100';
            case '财富类': return 'bg-amber-50 text-amber-700 border-amber-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    if (isEditing) {
        return (
            <div className="bg-white border border-blue-300 shadow-md rounded-lg p-4 space-y-3 animate-in fade-in zoom-in-95">
                <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-blue-600">编辑需求</h4>
                    <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                        <X size={16} />
                    </button>
                </div>
                
                {/* Category & SubCategory */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-medium">大类</label>
                        <select 
                            value={tempOpp.category}
                            onChange={(e) => {
                                const newCat = e.target.value as OpportunityCategory;
                                setTempOpp({
                                    ...tempOpp, 
                                    category: newCat,
                                    subCategory: OPP_CATEGORIES[newCat][0] // Reset sub to first option
                                });
                            }}
                            className="w-full text-xs border border-gray-200 rounded p-1.5 focus:border-blue-500 outline-none"
                        >
                            {Object.keys(OPP_CATEGORIES).map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-medium">小类</label>
                        <select 
                            value={tempOpp.subCategory}
                            onChange={(e) => setTempOpp({...tempOpp, subCategory: e.target.value})}
                            className="w-full text-xs border border-gray-200 rounded p-1.5 focus:border-blue-500 outline-none"
                        >
                            {OPP_CATEGORIES[tempOpp.category].map(sc => (
                                <option key={sc} value={sc}>{sc}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Date & Amount */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-medium">提醒日期</label>
                        <input 
                            type="date"
                            value={tempOpp.reminderDate}
                            onChange={(e) => setTempOpp({...tempOpp, reminderDate: e.target.value})}
                            className="w-full text-xs border border-gray-200 rounded p-1.5 focus:border-blue-500 outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500 font-medium">金额/数量</label>
                        <input 
                            type="text"
                            value={tempOpp.amount}
                            onChange={(e) => setTempOpp({...tempOpp, amount: e.target.value})}
                            placeholder="例: 100万"
                            className="w-full text-xs border border-gray-200 rounded p-1.5 focus:border-blue-500 outline-none"
                        />
                    </div>
                </div>

                {/* Description */}
                <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 font-medium">备注/描述</label>
                    <textarea 
                        rows={2}
                        value={tempOpp.description}
                        onChange={(e) => setTempOpp({...tempOpp, description: e.target.value})}
                        className="w-full text-xs border border-gray-200 rounded p-1.5 focus:border-blue-500 outline-none resize-none"
                    />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button 
                        onClick={() => onDelete(opp.id)}
                        className="px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded flex items-center gap-1 mr-auto"
                    >
                        <Trash2 size={12} /> 删除
                    </button>
                    <button 
                        onClick={handleSave}
                        className="px-4 py-1.5 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-1 shadow-sm"
                    >
                        <Save size={12} /> 保存
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2 flex-wrap">
                    <div className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${getCategoryColor(opp.category)}`}>
                        {opp.category}
                    </div>
                    <div className="text-xs font-bold text-gray-800 flex items-center gap-1">
                        <Tag size={12} className="text-gray-400" />
                        {opp.subCategory}
                    </div>
                </div>
                <button 
                    onClick={() => setIsEditing(true)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-all"
                >
                    <Pencil size={14} />
                </button>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-500">
                        <Calendar size={12} />
                    </div>
                    <span className="font-mono text-gray-600">{opp.reminderDate || '未设置日期'}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                    <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0 text-orange-500">
                        <Coins size={12} />
                    </div>
                    <span className="font-medium text-gray-700">{opp.amount || '未设置金额'}</span>
                </div>
            </div>

            {/* Description */}
            <div className="text-xs text-gray-500 leading-relaxed bg-gray-50 p-2 rounded border border-gray-100">
                {opp.description || '暂无描述...'}
            </div>
        </div>
    );
};

export const RegistrationBoard: React.FC<RegistrationBoardProps> = ({
  data,
  onUpdateField,
  onSubmit,
  isSubmitting,
  isSuccess,
  fieldUpdateTimestamps,
  onUpdateOpportunity,
  onAddOpportunity,
  onDeleteOpportunity
}) => {
  // Use completeness from props or calculate fallback
  const completeness = data.kycCompleteness;

  const getUpdatedTime = (key: string) => fieldUpdateTimestamps[key] || 0;
  const isRecentAI = (key: string) => {
     return !!fieldUpdateTimestamps[key]; 
  };

  // Improved Scroll Spy Logic
  const [activeSection, setActiveSection] = useState<string>('section-soft');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Refs for sections to calculate offsets accurately
  const sectionRefs = {
      'section-soft': useRef<HTMLDivElement>(null),
      'section-kyc': useRef<HTMLDivElement>(null),
      'section-opp': useRef<HTMLDivElement>(null),
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    
    const containerTop = scrollContainerRef.current.scrollTop;
    // Offset slightly to handle sticky header height
    const scrollPosition = containerTop + 100; 

    // Find the current active section
    let current = 'section-soft';
    
    // Simple check: which section top is closest to scroll position but less than it
    if (sectionRefs['section-kyc'].current && sectionRefs['section-kyc'].current!.offsetTop <= scrollPosition) {
        current = 'section-kyc';
    }
    if (sectionRefs['section-opp'].current && sectionRefs['section-opp'].current!.offsetTop <= scrollPosition) {
        current = 'section-opp';
    }
    
    if (activeSection !== current) {
        setActiveSection(current);
    }
  };

  const scrollToSection = (id: string) => {
    // @ts-ignore
    const element = sectionRefs[id]?.current;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Manually set active to avoid scroll flicker lag
      setActiveSection(id);
    }
  };

  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [isRefreshingAddress, setIsRefreshingAddress] = useState(false);

  const handleRefreshAddress = (e: React.MouseEvent) => {
      e.stopPropagation();
      setIsRefreshingAddress(true);
      setTimeout(() => {
          setIsRefreshingAddress(false);
          // Simulation of getting new address
          onUpdateField('kyc', 'address', data.kyc.address + ' (已更新定位)'); 
      }, 1000);
  };

  // Add Opportunity Modal State
  const [isAddOppModalOpen, setIsAddOppModalOpen] = useState(false);
  const [newOppData, setNewOppData] = useState<Partial<Opportunity>>({
      category: '资产类',
      subCategory: '个人贷款（授信）'
  });

  const handleOpenAddModal = () => {
      setNewOppData({
          category: '资产类',
          subCategory: '个人贷款（授信）',
          reminderDate: '',
          amount: '',
          description: ''
      });
      setIsAddOppModalOpen(true);
  };

  const handleConfirmAddOpp = () => {
      const newOpp: Opportunity = {
          id: Date.now().toString(),
          category: newOppData.category as OpportunityCategory,
          subCategory: newOppData.subCategory || '',
          reminderDate: newOppData.reminderDate || '',
          amount: newOppData.amount || '',
          description: newOppData.description || ''
      };
      onAddOpportunity(newOpp);
      setIsAddOppModalOpen(false);
  };

  if (isSuccess) {
      return (
          <div className="h-full flex flex-col items-center justify-center bg-white p-8 animate-in fade-in duration-700">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={48} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">拜访登记成功</h2>
              <p className="text-gray-500 mb-8">数据已成功写入核心系统。</p>
          </div>
      )
  }

  // Gamification: Calculate Stars based on content
  const getStarCount = (val: string) => {
      if (!val) return 0;
      if (val.length > 25) return 3;
      if (val.length > 8) return 2;
      return 1;
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm relative overflow-hidden">
      {/* Header Area */}
      <div className="bg-white border-b border-gray-200 pt-6 pb-0 px-6 flex-shrink-0 z-30 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
         <div className="flex justify-between items-start mb-6">
             <div>
                 {/* Row 1: Name and Tags */}
                 <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{data.kyc.customerName || '新客户'}</h2>
                    {data.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-md font-medium border border-gray-200">
                            {tag}
                        </span>
                    ))}
                 </div>
                 
                 {/* Row 2: Details Info Bar */}
                 <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500">
                     <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded">
                         <CreditCard size={14} className="text-gray-400"/>
                         <span className="font-mono text-gray-700">{data.kyc.idNumber || '---'}</span>
                     </div>
                     
                     <div className="flex items-center gap-1.5 relative group">
                         <div 
                            className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors"
                            onClick={() => setShowPhonePopup(!showPhonePopup)}
                         >
                            <Phone size={14} />
                            <span className="font-mono font-medium">{data.kyc.phone || '---'}</span>
                            <ChevronDown size={12} />
                         </div>
                         
                         {/* Phone Popup Mock */}
                         {showPhonePopup && (
                             <div className="absolute top-full left-0 mt-1 bg-white shadow-xl border border-gray-200 rounded-lg p-2 w-48 z-50 animate-in fade-in zoom-in-95">
                                 <div className="p-2 hover:bg-blue-50 rounded cursor-pointer flex justify-between items-center text-sm text-slate-700">
                                     <span>{data.kyc.phone}</span>
                                     <Phone size={12} className="text-green-600"/>
                                 </div>
                             </div>
                         )}
                     </div>

                     <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded max-w-[240px]">
                         <MapPin size={14} className="text-gray-400 flex-shrink-0"/>
                         <span className="truncate text-gray-700" title={data.kyc.address}>{data.kyc.address || '地址未知'}</span>
                         <button 
                             onClick={handleRefreshAddress}
                             className={`ml-1 p-0.5 rounded-full hover:bg-blue-100 text-gray-400 hover:text-blue-600 transition-colors ${isRefreshingAddress ? 'animate-spin text-blue-600' : ''}`}
                             title="获取最新定位"
                         >
                             <RefreshCcw size={12} />
                         </button>
                     </div>
                 </div>
             </div>
         </div>

         {/* Navigation Tabs (Sticky Headers) */}
         <div className="flex items-center gap-8 relative">
             {[
                 { id: 'section-soft', label: '软信息', icon: <FileText size={16}/> },
                 { id: 'section-kyc', label: 'KYC信息', icon: <User size={16}/> },
                 { id: 'section-opp', label: '新商机', icon: <TrendingUp size={16}/> }
             ].map((tab) => {
                const isActive = activeSection === tab.id;
                return (
                    <button 
                        key={tab.id}
                        onClick={() => scrollToSection(tab.id)} 
                        className={`flex items-center gap-2 pb-3 text-sm transition-all relative
                            ${isActive 
                                ? 'text-blue-700 font-bold' 
                                : 'text-gray-500 font-medium hover:text-gray-700'}`
                        }
                    >
                        <span className={`${isActive ? 'opacity-100' : 'opacity-70'}`}>{tab.icon}</span>
                        {tab.label}
                        {isActive && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></div>
                        )}
                    </button>
                )
             })}
             
             {/* Completeness Badge - Moved here */}
             <div className="ml-auto pb-3">
                <div className="text-[10px] text-gray-400 font-medium bg-gray-50 px-3 py-1 rounded-full border border-gray-100 flex items-center gap-2">
                    资料完整度 
                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${completeness}%` }}></div>
                    </div>
                    <span className="text-blue-600 font-bold">{completeness}%</span>
                </div>
             </div>
         </div>
      </div>

      {/* Content Area - Scrollable Flat List */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 scrollbar-hide space-y-8 bg-gray-50"
      >
        
        {/* Soft Info Section - Priority #1 */}
        <div id="section-soft" ref={sectionRefs['section-soft']} className="scroll-mt-6">
           <div className="bg-white p-6 rounded-xl border border-indigo-50 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
               <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <FileText size={20} className="text-indigo-600"/> 软信息
                    <span className="text-xs font-normal text-gray-400 ml-2 bg-gray-50 px-2 py-0.5 rounded-full">AI自动提取核心区</span>
               </h3>
               <div className="grid grid-cols-1 gap-5">
                    <FieldInput 
                        label="收入来源" 
                        subLabel="资金来源稳定性、可支配节奏"
                        value={data.softInfo.incomeSource} 
                        fieldKey="softInfo.incomeSource" 
                        onSave={(v) => onUpdateField('softInfo', 'incomeSource', v)}
                        lastUpdated={getUpdatedTime('softInfo.incomeSource')}
                        isAIUpdated={isRecentAI('softInfo.incomeSource')}
                        stars={getStarCount(data.softInfo.incomeSource)}
                        showStars={true}
                    />
                    <FieldInput 
                        label="家庭情况" 
                        subLabel="家庭约束、理财决策权"
                        value={data.softInfo.familySituation} 
                        fieldKey="softInfo.familySituation" 
                        onSave={(v) => onUpdateField('softInfo', 'familySituation', v)}
                        lastUpdated={getUpdatedTime('softInfo.familySituation')}
                        isAIUpdated={isRecentAI('softInfo.familySituation')}
                        stars={getStarCount(data.softInfo.familySituation)}
                        showStars={true}
                    />
                    <FieldInput 
                        label="资产情况" 
                        subLabel="整体资产、中长期理财空间"
                        value={data.softInfo.financialAssets} 
                        fieldKey="softInfo.financialAssets" 
                        onSave={(v) => onUpdateField('softInfo', 'financialAssets', v)}
                        lastUpdated={getUpdatedTime('softInfo.financialAssets')}
                        isAIUpdated={isRecentAI('softInfo.financialAssets')}
                        stars={getStarCount(data.softInfo.financialAssets)}
                        showStars={true}
                    />
                    <FieldInput 
                        label="负债情况" 
                        subLabel="负债类型、规模、风险"
                        value={data.softInfo.liabilities} 
                        fieldKey="softInfo.liabilities" 
                        onSave={(v) => onUpdateField('softInfo', 'liabilities', v)}
                        lastUpdated={getUpdatedTime('softInfo.liabilities')}
                        isAIUpdated={isRecentAI('softInfo.liabilities')}
                        stars={getStarCount(data.softInfo.liabilities)}
                        showStars={true}
                    />
                    <FieldInput 
                        label="他行情况" 
                        subLabel="了解他行，寻找营销切入口"
                        value={data.softInfo.otherBank} 
                        fieldKey="softInfo.otherBank" 
                        onSave={(v) => onUpdateField('softInfo', 'otherBank', v)}
                        lastUpdated={getUpdatedTime('softInfo.otherBank')}
                        isAIUpdated={isRecentAI('softInfo.otherBank')}
                        stars={getStarCount(data.softInfo.otherBank)}
                        showStars={true}
                    />
                    <FieldInput 
                        label="理财偏好" 
                        subLabel="风险认知、个人爱好"
                        value={data.softInfo.financialPreference} 
                        fieldKey="softInfo.financialPreference" 
                        onSave={(v) => onUpdateField('softInfo', 'financialPreference', v)}
                        lastUpdated={getUpdatedTime('softInfo.financialPreference')}
                        isAIUpdated={isRecentAI('softInfo.financialPreference')}
                        stars={getStarCount(data.softInfo.financialPreference)}
                        showStars={true}
                    />
               </div>
           </div>
        </div>

        {/* KYC Section */}
        <div id="section-kyc" ref={sectionRefs['section-kyc']} className="scroll-mt-6">
            <div className="bg-white p-6 rounded-xl border border-blue-50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-6">
                    <User size={20} className="text-blue-600"/> KYC信息
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                    {/* Groups */}
                    <div className="col-span-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">职业与身份</span>
                    </div>
                    <FieldInput label="职业分类" value={data.kyc.occupation} fieldKey="kyc.occupation" onSave={(v) => onUpdateField('kyc', 'occupation', v)} lastUpdated={getUpdatedTime('kyc.occupation')} isAIUpdated={isRecentAI('kyc.occupation')} showStars={false} />
                    <FieldInput label="公司职位" value={data.kyc.position} fieldKey="kyc.position" onSave={(v) => onUpdateField('kyc', 'position', v)} lastUpdated={getUpdatedTime('kyc.position')} isAIUpdated={isRecentAI('kyc.position')} showStars={false} />
                    <div className="col-span-2">
                         <FieldInput label="企业名称" value={data.kyc.companyName} fieldKey="kyc.companyName" onSave={(v) => onUpdateField('kyc', 'companyName', v)} lastUpdated={getUpdatedTime('kyc.companyName')} isAIUpdated={isRecentAI('kyc.companyName')} showStars={false} />
                    </div>

                    <div className="col-span-2 mt-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">家庭成员</span>
                    </div>
                    <FieldInput label="配偶年龄" value={data.kyc.spouseAge} fieldKey="kyc.spouseAge" onSave={(v) => onUpdateField('kyc', 'spouseAge', v)} lastUpdated={getUpdatedTime('kyc.spouseAge')} isAIUpdated={isRecentAI('kyc.spouseAge')} showStars={false} />
                    <FieldInput label="配偶企业" value={data.kyc.spouseCompany} fieldKey="kyc.spouseCompany" onSave={(v) => onUpdateField('kyc', 'spouseCompany', v)} lastUpdated={getUpdatedTime('kyc.spouseCompany')} isAIUpdated={isRecentAI('kyc.spouseCompany')} showStars={false} />
                    
                    <FieldInput label="子女数量" value={data.kyc.childrenCount} fieldKey="kyc.childrenCount" onSave={(v) => onUpdateField('kyc', 'childrenCount', v)} lastUpdated={getUpdatedTime('kyc.childrenCount')} isAIUpdated={isRecentAI('kyc.childrenCount')} showStars={false} />
                    <FieldInput label="子女年龄" value={data.kyc.childrenAge} fieldKey="kyc.childrenAge" onSave={(v) => onUpdateField('kyc', 'childrenAge', v)} lastUpdated={getUpdatedTime('kyc.childrenAge')} isAIUpdated={isRecentAI('kyc.childrenAge')} showStars={false} />
                    
                    <div className="col-span-2 mt-2">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded">其他</span>
                    </div>
                    <div className="col-span-2">
                        <FieldInput label="其他地址" value={data.kyc.otherAddress} fieldKey="kyc.otherAddress" onSave={(v) => onUpdateField('kyc', 'otherAddress', v)} lastUpdated={getUpdatedTime('kyc.otherAddress')} isAIUpdated={isRecentAI('kyc.otherAddress')} showStars={false} />
                    </div>
                    <div className="col-span-2">
                        <FieldInput label="其他联系方式" value={data.kyc.otherContact} fieldKey="kyc.otherContact" onSave={(v) => onUpdateField('kyc', 'otherContact', v)} lastUpdated={getUpdatedTime('kyc.otherContact')} isAIUpdated={isRecentAI('kyc.otherContact')} showStars={false} />
                    </div>
                    <div className="col-span-2">
                        <FieldInput label="活动爱好" value={data.kyc.hobbies} fieldKey="kyc.hobbies" onSave={(v) => onUpdateField('kyc', 'hobbies', v)} lastUpdated={getUpdatedTime('kyc.hobbies')} isAIUpdated={isRecentAI('kyc.hobbies')} showStars={false} />
                    </div>
                    <div className="col-span-2">
                        <FieldInput label="备注" value={data.kyc.remarks} fieldKey="kyc.remarks" onSave={(v) => onUpdateField('kyc', 'remarks', v)} lastUpdated={getUpdatedTime('kyc.remarks')} isAIUpdated={isRecentAI('kyc.remarks')} showStars={false} />
                    </div>
                </div>
            </div>
        </div>

        {/* Opportunities Section */}
        <div id="section-opp" ref={sectionRefs['section-opp']} className="scroll-mt-6 pb-12">
            <div className="bg-white p-6 rounded-xl border border-amber-50 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                        <TrendingUp size={20} className="text-amber-600"/> 新商机
                    </h3>
                    <button 
                        onClick={handleOpenAddModal}
                        className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-700 rounded-full text-xs font-bold hover:bg-amber-100 transition-colors"
                    >
                        <Plus size={14} /> 添加需求
                    </button>
                </div>

                {data.opportunities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-gray-400 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                        <AlertCircle className="mb-2 opacity-50" size={32} />
                        <p className="text-xs">暂无识别到的新需求</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {data.opportunities.map((opp) => (
                            <OpportunityCard 
                                key={opp.id} 
                                opp={opp} 
                                onSave={onUpdateOpportunity} 
                                onDelete={onDeleteOpportunity}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
      </div>
      
      {/* Add Opportunity Modal */}
      {isAddOppModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
                  <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-800">添加新商机</h3>
                      <button onClick={() => setIsAddOppModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-4">
                      {/* Category */}
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500">大类商机</label>
                          <select 
                              value={newOppData.category}
                              onChange={(e) => {
                                  const newCat = e.target.value as OpportunityCategory;
                                  setNewOppData(prev => ({
                                      ...prev, 
                                      category: newCat,
                                      subCategory: OPP_CATEGORIES[newCat][0] 
                                  }));
                              }}
                              className="w-full h-9 px-3 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
                          >
                              {Object.keys(OPP_CATEGORIES).map(c => (
                                  <option key={c} value={c}>{c}</option>
                              ))}
                          </select>
                      </div>

                      {/* Sub Category */}
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500">小类商机</label>
                          <select 
                              value={newOppData.subCategory}
                              onChange={(e) => setNewOppData(prev => ({...prev, subCategory: e.target.value}))}
                              className="w-full h-9 px-3 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
                          >
                              {OPP_CATEGORIES[newOppData.category as OpportunityCategory]?.map(sc => (
                                  <option key={sc} value={sc}>{sc}</option>
                              ))}
                          </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          {/* Date */}
                          <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500">需求提醒日期</label>
                              <input 
                                  type="date"
                                  value={newOppData.reminderDate}
                                  onChange={(e) => setNewOppData(prev => ({...prev, reminderDate: e.target.value}))}
                                  className="w-full h-9 px-3 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
                              />
                          </div>
                          {/* Amount */}
                          <div className="space-y-1">
                              <label className="text-xs font-medium text-gray-500">金额/数量</label>
                              <input 
                                  type="text"
                                  value={newOppData.amount}
                                  onChange={(e) => setNewOppData(prev => ({...prev, amount: e.target.value}))}
                                  placeholder="例: 100万"
                                  className="w-full h-9 px-3 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none"
                              />
                          </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                          <label className="text-xs font-medium text-gray-500">备注描述 (可选)</label>
                          <textarea 
                              rows={3}
                              value={newOppData.description}
                              onChange={(e) => setNewOppData(prev => ({...prev, description: e.target.value}))}
                              className="w-full p-3 border border-gray-200 rounded text-sm focus:border-blue-500 outline-none resize-none"
                          />
                      </div>
                  </div>

                  <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                      <button 
                          onClick={() => setIsAddOppModalOpen(false)}
                          className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 text-sm font-bold hover:bg-gray-100 transition-colors"
                      >
                          取消
                      </button>
                      <button 
                          onClick={handleConfirmAddOpp}
                          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 shadow-sm transition-colors"
                      >
                          确认添加
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
