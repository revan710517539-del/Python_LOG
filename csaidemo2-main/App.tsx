
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { CustomerList } from './components/CustomerList';
import { RegistrationBoard } from './components/RegistrationBoard';
import { ChatInterface } from './components/ChatInterface';
import { ComparisonModal } from './components/ComparisonModal';
import { CustomerData, ViewMode, Message, ExtractedData, Opportunity, ComparisonItem } from './types';
import { X } from 'lucide-react';

const MOCK_CUSTOMERS: CustomerData[] = [
  {
    id: '1',
    customerIdDisplay: 'CSB001234567',
    avatarColor: 'bg-blue-100',
    tags: ['私主', '本地'],
    aum: '300.00万',
    activityRate: '85%',
    penetrationRate: '68%',
    location: '江苏省常熟市招商城片区',
    businessType: '五金建材批发',
    lastInteraction: '2天前',
    assetChange: '+45%',
    aiInsight: '活跃度最高，近期资产增长45%。资金回笼明显。',
    aiTodo: '大额存单到期提醒，建议营销理财产品。',
    kyc: {
      customerName: '郭家豪',
      idNumber: '32058119800101****',
      address: '江苏省常熟市招商城片区88号',
      phone: '138****5678',
      occupation: '私营业主',
      position: '总经理',
      companyName: '常熟市豪杰五金建材有限公司',
      spouseAge: '38',
      spouseCompany: '豪杰五金财务部',
      childrenCount: '1',
      childrenAge: '10',
      childrenMaritalStatus: '未婚',
      fatherAge: '65',
      fatherPension: '3000元/月',
      motherAge: '62',
      motherPension: '2500元/月',
      otherAddress: '上海市浦东新区某小区',
      otherContact: '139****1234 (配偶)',
      hobbies: '高尔夫, 茶道',
      remarks: '客户比较看重资金流动性。'
    },
    softInfo: {
      incomeSource: '企业经营分红，每年年底到账，现金流充裕。',
      familySituation: '核心家庭，生活富裕，注重子女教育，妻子掌握财政大权。',
      financialAssets: '本行AUM 300万，持有500万他行理财，偏好中低风险。',
      liabilities: '无主要负债，经营性贷款已结清。',
      otherBank: '在招行有金葵花卡，工行有大额存单。',
      financialPreference: '风险厌恶型，喜欢固定收益类产品，周末喜欢去上海打球。'
    },
    opportunities: [
        // Example for Wealth Category
        {
            id: 'opp-1',
            category: '财富类',
            subCategory: '定期需求',
            reminderDate: '2023-12-20',
            amount: '200万',
            description: '客户有一笔他行理财即将到期，可营销大额存单。'
        },
        // Example for Asset Category
        {
            id: 'opp-2',
            category: '资产类',
            subCategory: '个人贷款（授信）',
            reminderDate: '2024-03-01',
            amount: '50万',
            description: '客户因进货需要周转资金，咨询信用贷款。'
        },
        // Example for Other Category
        {
            id: 'opp-3',
            category: '其他类',
            subCategory: '社保卡需求',
            reminderDate: '2024-01-15',
            amount: '1张',
            description: '客户母亲退休需办理三代社保卡。'
        }
    ],
    kycCompleteness: 85,
    manager: '张伟'
  },
  {
    id: '2',
    customerIdDisplay: 'CSB009876543',
    avatarColor: 'bg-purple-100',
    tags: ['科技', '高潜'],
    aum: '1200.00万',
    activityRate: '40%',
    penetrationRate: '35%',
    location: '浙江省杭州市滨江区',
    businessType: '软件与信息服务',
    lastInteraction: '15天前',
    assetChange: '-5%',
    aiInsight: '客户近期资金回笼较慢，账户余额波动较大。',
    aiTodo: '跟进企业科创贷需求。',
    kyc: {
      customerName: '李思思',
      idNumber: '33010619920808****',
      address: '杭州市滨江区网商路699号',
      phone: '139****9999',
      occupation: '企业高管',
      position: 'CTO',
      companyName: '杭州智联科技有限公司',
      spouseAge: '34',
      spouseCompany: '某互联网大厂',
      childrenCount: '0',
      childrenAge: '',
      childrenMaritalStatus: '',
      fatherAge: '60',
      fatherPension: '5000元/月',
      motherAge: '58',
      motherPension: '4500元/月',
      otherAddress: '',
      otherContact: '',
      hobbies: '健身, 摄影',
      remarks: '工作繁忙，联系尽量避开工作时间。'
    },
    softInfo: {
      incomeSource: '高薪工资及股权激励变现，资金来源合法稳定。',
      familySituation: '单身，父母在老家，近期有购房计划。',
      financialAssets: '主要持有股票和基金，风险承受能力高。',
      liabilities: '有少量消费贷。',
      otherBank: '主要使用招行App进行投资。',
      financialPreference: '激进型，对科创类理财感兴趣。'
    },
    opportunities: [
        {
            id: 'opp-4',
            category: '资产类',
            subCategory: '对公贷款需求',
            reminderDate: '2024-01-15',
            amount: '500万',
            description: '企业研发投入大，有科创贷融资需求。'
        }
    ],
    kycCompleteness: 60,
    manager: '王芳'
  },
  {
    id: '3',
    customerIdDisplay: 'CSB882736112',
    avatarColor: 'bg-green-100',
    tags: ['拆迁', '养老'],
    aum: '80.00万',
    activityRate: '15%',
    penetrationRate: '20%',
    location: '苏州市吴中区',
    businessType: '退休人员',
    lastInteraction: '30天前',
    assetChange: '0%',
    aiInsight: '客户为拆迁户，资金长期沉淀，缺乏理财规划。',
    aiTodo: '上门拜访，赠送节日礼品，推荐养老理财。',
    kyc: {
      customerName: '王大爷',
      idNumber: '32050119551212****',
      address: '苏州市吴中区越溪街道',
      phone: '133****5555',
      occupation: '退休',
      position: '',
      companyName: '',
      spouseAge: '68',
      spouseCompany: '',
      childrenCount: '2',
      childrenAge: '40, 38',
      childrenMaritalStatus: '已婚',
      fatherAge: '',
      fatherPension: '',
      motherAge: '',
      motherPension: '',
      otherAddress: '',
      otherContact: '',
      hobbies: '钓鱼, 广场舞',
      remarks: '耳背，说话要大声。'
    },
    softInfo: {
      incomeSource: '退休金及房租收入。',
      familySituation: '与老伴居住，子女周末来看望。',
      financialAssets: '大部分为定期存款，少部分国债。',
      liabilities: '无负债。',
      otherBank: '农行有社保卡。',
      financialPreference: '极度厌恶风险，只存定期。'
    },
    opportunities: [],
    kycCompleteness: 90,
    manager: '陈建国'
  },
  {
    id: '4',
    customerIdDisplay: 'CSB771829334',
    avatarColor: 'bg-yellow-100',
    tags: ['代发', '青年'],
    aum: '15.00万',
    activityRate: '95%',
    penetrationRate: '45%',
    location: '上海市黄浦区',
    businessType: '金融从业者',
    lastInteraction: '1天前',
    assetChange: '+10%',
    aiInsight: '代发薪客户，月度流水稳定，消费能力强。',
    aiTodo: '推荐信用卡分期及消费贷提额。',
    kyc: {
      customerName: '赵小亮',
      idNumber: '31010119980505****',
      address: '上海市黄浦区南京东路',
      phone: '186****1111',
      occupation: '职员',
      position: '分析师',
      companyName: '某证券公司',
      spouseAge: '',
      spouseCompany: '',
      childrenCount: '0',
      childrenAge: '',
      childrenMaritalStatus: '',
      fatherAge: '55',
      fatherPension: '',
      motherAge: '52',
      motherPension: '',
      otherAddress: '',
      otherContact: '',
      hobbies: '旅游, 电子游戏',
      remarks: '喜欢线上交流。'
    },
    softInfo: {
      incomeSource: '工资收入，年终奖。',
      familySituation: '未婚，租房。',
      financialAssets: '持有少量基金，主要用于消费。',
      liabilities: '信用卡账单约1万/月。',
      otherBank: '招行信用卡。',
      financialPreference: '追求高收益，愿意尝试新产品。'
    },
    opportunities: [],
    kycCompleteness: 40,
    manager: 'Amy'
  },
  {
    id: '5',
    customerIdDisplay: 'CSB665544332',
    avatarColor: 'bg-red-100',
    tags: ['法人', '授信'],
    aum: '500.00万',
    activityRate: '60%',
    penetrationRate: '75%',
    location: '江苏省昆山市',
    businessType: '制造业',
    lastInteraction: '5天前',
    assetChange: '+5%',
    aiInsight: '企业扩产在即，对设备融资有潜在需求。',
    aiTodo: '联系信贷经理协同拜访，制定融资租赁方案。',
    kyc: {
      customerName: '周总',
      idNumber: '32058319750909****',
      address: '昆山市经济开发区',
      phone: '137****8888',
      occupation: '私营业主',
      position: '董事长',
      companyName: '昆山精密机械厂',
      spouseAge: '45',
      spouseCompany: '家庭主妇',
      childrenCount: '1',
      childrenAge: '18',
      childrenMaritalStatus: '未婚',
      fatherAge: '75',
      fatherPension: '',
      motherAge: '72',
      motherPension: '',
      otherAddress: '',
      otherContact: '',
      hobbies: '茶艺, 收藏',
      remarks: '比较讲究排场。'
    },
    softInfo: {
      incomeSource: '企业经营利润。',
      familySituation: '儿子即将出国留学。',
      financialAssets: '企业账户资金为主，个人资产配置较少。',
      liabilities: '企业经营贷500万。',
      otherBank: '中行有结算账户。',
      financialPreference: '注重资金安全和税务规划。'
    },
    opportunities: [
        {
            id: 'opp-5',
            category: '其他类',
            subCategory: '其他需求',
            reminderDate: '2023-08-01',
            amount: '50万美元',
            description: '子女出国留学，有购汇需求。'
        }
    ],
    kycCompleteness: 70,
    manager: '孙强'
  }
];

export default function App() {
  const [view, setView] = useState<ViewMode>('LIST');
  const [currentCustomer, setCurrentCustomer] = useState<CustomerData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // State for the one-click update animation
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Track field update timestamps for highlighting
  const [fieldUpdates, setFieldUpdates] = useState<Record<string, number>>({});

  // Comparison Modal State
  const [comparisonModalOpen, setComparisonModalOpen] = useState(false);
  const [currentComparisonData, setCurrentComparisonData] = useState<ComparisonItem[]>([]);

  const handleSelectCustomer = (id: string) => {
    const customer = MOCK_CUSTOMERS.find(c => c.id === id);
    if (customer) {
      setCurrentCustomer({ ...customer }); // Clone
      setView('DETAIL');
      setMessages([]); // Reset chat
      setIsSuccess(false);
      setFieldUpdates({});
    }
  };

  const handleUpdateField = (category: 'kyc' | 'softInfo', key: string, value: string) => {
    if (!currentCustomer) return;

    setCurrentCustomer(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value
        }
      };
    });
    
    // Update timestamp for highlight (even if manual)
    setFieldUpdates(prev => ({...prev, [`${category}.${key}`]: Date.now()}));
  };

  const handleUpdateOpportunity = (updatedOpp: Opportunity) => {
      if (!currentCustomer) return;
      setCurrentCustomer(prev => {
          if (!prev) return null;
          const newOpps = prev.opportunities.map(opp => 
            opp.id === updatedOpp.id ? updatedOpp : opp
          );
          return { ...prev, opportunities: newOpps };
      });
  };

  const handleAddOpportunity = (newOpp: Opportunity) => {
      if (!currentCustomer) return;
      setCurrentCustomer(prev => {
          if (!prev) return null;
          return { ...prev, opportunities: [...prev.opportunities, newOpp] };
      });
  };

  const handleDeleteOpportunity = (id: string) => {
      if (!currentCustomer) return;
      setCurrentCustomer(prev => {
          if (!prev) return null;
          return { ...prev, opportunities: prev.opportunities.filter(o => o.id !== id) };
      });
  };

  const handleDataExtracted = (data: ExtractedData) => {
    if (!currentCustomer) return;
    const comparisonList: ComparisonItem[] = [];

    // Helper to add comparison data
    const compareAndAdd = (label: string, fieldKey: string, newVal: any, oldVal: any) => {
        if (newVal && newVal !== oldVal) {
            comparisonList.push({
                label: label,
                aiValue: String(newVal),
                currentValue: String(oldVal || ''),
                fieldKey: fieldKey
            });
        }
    };

    // KYC
    if (data.kyc) {
      Object.keys(data.kyc).forEach(k => {
        const key = k as keyof typeof data.kyc;
        const val = data.kyc![key];
        if (val) {
           let label: string = key;
           if(key === 'customerName') label = '客户姓名';
           if(key === 'companyName') label = '企业名称';
           if(key === 'occupation') label = '职业分类';
           if(key === 'position') label = '公司职位';
           if(key === 'idNumber') label = '身份证号';
           if(key === 'address') label = '地址';
           if(key === 'phone') label = '电话';
           if(key === 'spouseAge') label = '配偶年龄';
           if(key === 'spouseCompany') label = '配偶企业';
           if(key === 'childrenCount') label = '子女数量';
           if(key === 'childrenAge') label = '子女年龄';
           if(key === 'childrenMaritalStatus') label = '子女婚姻';
           if(key === 'fatherAge') label = '父亲年龄';
           if(key === 'fatherPension') label = '父亲养老金';
           if(key === 'motherAge') label = '母亲年龄';
           if(key === 'motherPension') label = '母亲养老金';
           if(key === 'otherAddress') label = '其他地址';
           if(key === 'otherContact') label = '其他联系';
           if(key === 'hobbies') label = '活动爱好';
           if(key === 'remarks') label = '备注';
           
           compareAndAdd(label, `kyc.${key}`, val, (currentCustomer.kyc as any)[key]);
        }
      });
    }

    // Soft Info
    if (data.softInfo) {
      Object.keys(data.softInfo).forEach(k => {
        const key = k as keyof typeof data.softInfo;
        const val = data.softInfo![key];
        if (val) {
           // Chinese Mapping for Soft Info
           let label: string = key;
           if(key === 'incomeSource') label = '收入来源';
           if(key === 'familySituation') label = '家庭情况';
           if(key === 'financialAssets') label = '资产情况';
           if(key === 'liabilities') label = '负债情况';
           if(key === 'otherBank') label = '他行情况';
           if(key === 'financialPreference') label = '理财偏好';

           compareAndAdd(label, `softInfo.${key}`, val, (currentCustomer.softInfo as any)[key]);
        }
      });
    }

    // Increase completeness score by 10%
    setCurrentCustomer(prev => {
        if (!prev) return null;
        return {
            ...prev,
            kycCompleteness: Math.min(100, prev.kycCompleteness + 10)
        }
    });

    // Add Comparison Message to Chat
    const now = Date.now();
    const aiMessage: Message = {
        id: now.toString(),
        role: 'model',
        content: data.summary || "已解析到新的客户信息。", 
        timestamp: now,
        comparisonData: comparisonList.length > 0 ? comparisonList : undefined
    };
    setMessages(prev => [...prev, aiMessage]);

    // Check if opportunities were found. If not, suggest next steps.
    const hasOpportunities = data.opportunities && data.opportunities.length > 0;
    
    // Logic: If no new business opportunities identified (or just part of this demo flow as requested)
    if (!hasOpportunities) {
        // Use setTimeout to delay the warning and hint messages by 2 seconds
        setTimeout(() => {
            const timeAfterDelay = Date.now();
            
            // 1. Add warning message with title prefix
            const warningMsg: Message = {
                id: (timeAfterDelay).toString(),
                role: 'model',
                content: "【有效性检测】：本次拜访未能识别新商机，且语音录入＜1分钟，建议继续录入拜访信息。",
                timestamp: timeAfterDelay
            };
            
            // 2. Add Hint/Suggestion Bubble
            const hintsMsg: Message = {
                 id: (timeAfterDelay + 1).toString(),
                 role: 'model',
                 content: "您可以继续补充以下信息：",
                 timestamp: timeAfterDelay + 1,
                 suggestions: [
                     "家庭里谁是主要挣钱或管钱的人？",
                     "是否需要承担孩子教育方面的支出？有没有提到赡养老人或医疗方面的压力？"
                 ]
             };
             
             setMessages(prev => [...prev, warningMsg, hintsMsg]);
        }, 2000);
    }
  };

  // Handler for applying the update (Batch)
  const applyBatchUpdate = (items: ComparisonItem[]) => {
      const updates: Record<string, number> = {};
      const now = Date.now();

      setCurrentCustomer(prev => {
          if (!prev) return null;
          const newCustomer = { ...prev };
          
          items.forEach(item => {
              if (item.fieldKey.startsWith('kyc.')) {
                  const key = item.fieldKey.split('.')[1];
                  (newCustomer.kyc as any)[key] = item.aiValue;
                  updates[item.fieldKey] = now;
              } else if (item.fieldKey.startsWith('softInfo.')) {
                  const key = item.fieldKey.split('.')[1];
                  (newCustomer.softInfo as any)[key] = item.aiValue;
                  updates[item.fieldKey] = now;
              }
          });
          return newCustomer;
      });

      setFieldUpdates(prev => ({...prev, ...updates}));
      setComparisonModalOpen(false);

      // Add feedback message
      const doneMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          content: `已成功更新 ${items.length} 项信息。`,
          timestamp: Date.now()
      };
      setMessages(prev => [...prev, doneMsg]);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Mock API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Auto-reply in chat
      const successMsg: Message = {
          id: Date.now().toString(),
          role: 'model',
          content: '拜访登记已完成，是否需要继续补充信息？',
          timestamp: Date.now()
      };
      setMessages(prev => [...prev, successMsg]);

    }, 2000);
  };

  return (
    <Layout>
      {view === 'LIST' && (
        <div className="h-full overflow-y-auto">
          <CustomerList 
            customers={MOCK_CUSTOMERS} 
            onSelect={handleSelectCustomer} 
          />
        </div>
      )}

      {view === 'DETAIL' && currentCustomer && (
        <div className="flex h-full relative">
           {/* Left: Registration Board (60%) */}
           <div className="w-[60%] h-full">
              <RegistrationBoard 
                data={currentCustomer}
                onUpdateField={handleUpdateField}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isSuccess={isSuccess}
                fieldUpdateTimestamps={fieldUpdates}
                onUpdateOpportunity={handleUpdateOpportunity}
                onAddOpportunity={handleAddOpportunity}
                onDeleteOpportunity={handleDeleteOpportunity}
              />
           </div>

           {/* Right: Chat Interface (40%) */}
           <div className="w-[40%] h-full border-l border-gray-200 shadow-xl z-20">
              <ChatInterface 
                messages={messages}
                onSendMessage={(msg) => setMessages(prev => [...prev, msg])}
                onDataExtracted={handleDataExtracted}
                onPreviewImage={setPreviewImage}
                onOpenComparison={(data) => {
                    setCurrentComparisonData(data);
                    setComparisonModalOpen(true);
                }}
                onQuickUpdate={applyBatchUpdate}
              />
           </div>

           {/* Fullscreen Comparison Modal */}
           <ComparisonModal 
                isOpen={comparisonModalOpen}
                onClose={() => setComparisonModalOpen(false)}
                comparisonData={currentComparisonData}
                onConfirm={applyBatchUpdate}
           />

           {/* Image Preview Drawer/Overlay */}
           {previewImage && (
             <div className="absolute inset-0 z-50 bg-black/60 flex justify-end">
                <div className="w-[60%] h-full bg-slate-900 p-6 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
                   <div className="flex justify-between items-center mb-4">
                      <h3 className="text-white font-semibold">文件预览</h3>
                      <button onClick={() => setPreviewImage(null)} className="text-white hover:text-gray-300 bg-white/10 p-2 rounded-full">
                         <X size={24} />
                      </button>
                   </div>
                   <div className="flex-1 flex items-center justify-center p-4 bg-black/40 rounded-xl overflow-hidden">
                      <img src={previewImage} alt="Full Preview" className="max-w-full max-h-full object-contain" />
                   </div>
                   <div className="mt-4 text-center text-gray-400 text-sm">
                      点击右上角关闭。您可以对照图片核对左侧信息。
                   </div>
                </div>
             </div>
           )}

           {/* Back Button (Floating) */}
           <button 
             onClick={() => setView('LIST')}
             className="absolute top-20 left-4 z-40 bg-white/90 p-2 rounded-full shadow-md hover:bg-white text-gray-600 border border-gray-200 flex items-center gap-1 text-sm font-medium pr-3"
             title="返回列表"
           >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              返回
           </button>
        </div>
      )}
    </Layout>
  );
}
