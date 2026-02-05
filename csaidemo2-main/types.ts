
export interface KYCData {
  customerName: string; // Keep for header display
  idNumber: string;    // Keep for ID
  address: string;     // Keep for Address
  phone: string;       // Keep for contact
  
  // New Requested Fields
  occupation: string;         // 职业分类
  position: string;           // 公司职位
  companyName: string;        // 企业名称
  spouseAge: string;          // 配偶年龄
  spouseCompany: string;      // 配偶所在企业
  childrenCount: string;      // 子女数量
  childrenAge: string;        // 子女年龄
  childrenMaritalStatus: string; // 子女婚姻状况
  fatherAge: string;          // 父亲年龄
  fatherPension: string;      // 父亲养老金
  motherAge: string;          // 母亲年龄
  motherPension: string;      // 母亲养老金
  otherAddress: string;       // 其他地址
  otherContact: string;       // 其他联系方式
  hobbies: string;            // 活动爱好 (KYC level)
  remarks: string;            // 备注
}

export interface SoftInfo {
  incomeSource: string;       // 收入来源 (New)
  familySituation: string;    // 家庭情况
  financialAssets: string;    // 资产情况
  liabilities: string;        // 负债情况
  otherBank: string;          // 他行情况 (New)
  financialPreference: string;// 理财认知偏好 (New)
}

export type OpportunityCategory = '资产类' | '财富类' | '其他类';

export interface Opportunity {
  id: string;
  category: OpportunityCategory;
  subCategory: string; // Specific items like "个人贷款（授信）", "理财需求" etc.
  reminderDate: string; // 需求提醒日期
  amount: string;       // 金额/数量
  description: string;  // Context/Details
}

export interface CustomerData {
  id: string;
  // List View Specific Fields
  avatarColor?: string;
  customerIdDisplay: string; // e.g., CSB001234567
  tags: string[]; // ["本地"]
  aum: string; // "300.00万"
  activityRate: string; // "85%"
  penetrationRate: string; // "68%"
  location: string;
  businessType: string;
  lastInteraction: string;
  assetChange: string;
  aiInsight: string; // Summary text
  aiTodo: string;    // New Field: AI Recommended Todo

  // Detail View Data
  kyc: KYCData;
  softInfo: SoftInfo;
  opportunities: Opportunity[];
  kycCompleteness: number; // 0-100
  manager: string;
}

export interface ComparisonItem {
  label: string;
  aiValue: string;
  currentValue: string;
  fieldKey: string;
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  type?: 'text' | 'voice'; // New: Support voice messages
  duration?: number;       // New: Duration for voice messages
  content: string; // Text content (transcribed text for voice)
  imageUri?: string; // For displayed images
  relatedFieldIds?: string[]; // IDs of fields updated by this message for visual linking
  timestamp: number;
  comparisonData?: ComparisonItem[]; // New field for the card
  suggestions?: string[]; // New: List of suggested questions/hints
}

// Extracted partial data structure returned by Gemini
export interface ExtractedData {
  kyc?: Partial<KYCData>;
  softInfo?: Partial<SoftInfo>;
  opportunities?: Opportunity[];
  summary?: string;
}

export type ViewMode = 'LIST' | 'DETAIL';
export type TabMode = 'KYC' | 'SOFT_INFO' | 'OPPORTUNITY';
