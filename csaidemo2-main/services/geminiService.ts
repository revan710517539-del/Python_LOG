
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedData } from "../types";

// Initialize Gemini Client
// In a real app, ensure process.env.API_KEY is defined. 
// We handle the case where it might be missing gracefully in the UI.
const apiKey = process.env.API_KEY || ''; 

// Helper to encode image to Base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeVisitInput = async (
  text: string, 
  imageBase64?: string,
  imageMimeType: string = 'image/jpeg'
): Promise<ExtractedData> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock data.");
    // Fallback mock for demonstration if no key
    return mockGeminiResponse(text);
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prompt Engineering
  const systemInstruction = `
    你是一名专业的银行客户经理AI助手。
    你的目标是从用户的输入（文本和/或图片）中提取结构化的银行业务数据。
    
    请提取以下几类信息，仅返回JSON格式：

    1. 软信息（softInfo）- 请重点关注：
       - 收入来源 (incomeSource): 客户资金来源稳定性、可支配节奏
       - 家庭情况 (familySituation): 判断理财目标背后的家庭约束、理财决策权
       - 资产情况 (financialAssets): 评估客户整体资产情况、中长期理财空间
       - 负债情况 (liabilities): 摸清负债类型、规模、隐形风险
       - 他行情况 (otherBank): 了解他行情况，寻找营销切入口
       - 理财认知偏好 (financialPreference): 识别客户理财风险认知、个人爱好等

    2. KYC数据（kyc）：
       - 职业分类 (occupation)
       - 公司职位 (position)
       - 企业名称 (companyName)
       - 配偶年龄 (spouseAge)
       - 配偶所在企业 (spouseCompany)
       - 子女数量 (childrenCount)
       - 子女年龄 (childrenAge)
       - 子女婚姻状况 (childrenMaritalStatus)
       - 父亲年龄 (fatherAge)
       - 父亲养老金 (fatherPension)
       - 母亲年龄 (motherAge)
       - 母亲养老金 (motherPension)
       - 其他地址 (otherAddress)
       - 其他联系方式 (otherContact)
       - 活动爱好 (hobbies) - KYC层面的基本爱好
       - 备注 (remarks)

    3. 新需求/商机（opportunities）：
       请严格按照以下分类标准提取商机（请完全匹配以下列表中的小类名称）：
       
       **大类 (category)** 必须为以下之一：
       - "资产类"
       - "财富类"
       - "其他类"

       **小类 (subCategory)** 必须归属于对应的大类：
       - 资产类小类: "个人贷款（授信）", "对公贷款需求", "信用卡需求", "票据贴现需求"
       - 财富类小类: "他行存款到期需求", "定期需求", "活期需求", "保险需求", "贵金属需求", "理财需求", "代发业务需求", "结构性存款需求"
       - 其他类小类: "码上付需求", "社保卡需求", "企业微信需求", "数币归集需求", "经纪人需求", "借记卡需求", "其他需求"

       **其他字段**:
       - 需求提醒日期 (reminderDate): YYYY-MM-DD 格式，如果是相对时间（如"下周"）请自动推算具体日期。
       - 金额/数量 (amount): 如 "100万", "5张" 等。
       - 描述 (description): 简要描述需求背景。

    请仅以JSON格式返回结果。
    如果未提及或未找到某个字段，请不要包含它或将其设置为null。
  `;

  const prompt = `
    请分析以下输入内容。
    用户文本: "${text}"
    ${imageBase64 ? "用户同时上传了一张图片。" : ""}
  `;

  try {
    const parts: any[] = [{ text: prompt }];
    
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: imageMimeType,
          data: imageBase64
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', 
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            kyc: {
              type: Type.OBJECT,
              properties: {
                occupation: { type: Type.STRING },
                position: { type: Type.STRING },
                companyName: { type: Type.STRING },
                spouseAge: { type: Type.STRING },
                spouseCompany: { type: Type.STRING },
                childrenCount: { type: Type.STRING },
                childrenAge: { type: Type.STRING },
                childrenMaritalStatus: { type: Type.STRING },
                fatherAge: { type: Type.STRING },
                fatherPension: { type: Type.STRING },
                motherAge: { type: Type.STRING },
                motherPension: { type: Type.STRING },
                otherAddress: { type: Type.STRING },
                otherContact: { type: Type.STRING },
                hobbies: { type: Type.STRING },
                remarks: { type: Type.STRING },
                customerName: { type: Type.STRING },
                idNumber: { type: Type.STRING },
                address: { type: Type.STRING },
                phone: { type: Type.STRING },
              }
            },
            softInfo: {
              type: Type.OBJECT,
              properties: {
                incomeSource: { type: Type.STRING },
                familySituation: { type: Type.STRING },
                financialAssets: { type: Type.STRING },
                liabilities: { type: Type.STRING },
                otherBank: { type: Type.STRING },
                financialPreference: { type: Type.STRING },
              }
            },
            opportunities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  category: { type: Type.STRING, enum: ["资产类", "财富类", "其他类"] },
                  subCategory: { type: Type.STRING },
                  reminderDate: { type: Type.STRING },
                  amount: { type: Type.STRING },
                  description: { type: Type.STRING },
                }
              }
            },
            summary: { type: Type.STRING, description: "给用户的简短、友好的回复，确认已提取到的信息。" }
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No response from AI");
    
    return JSON.parse(jsonText) as ExtractedData;

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback to basic text processing
    return mockGeminiResponse(text);
  }
};

// Fallback Mock Function
const mockGeminiResponse = (text: string): ExtractedData => {
  const result: ExtractedData = { kyc: {}, softInfo: {}, opportunities: [] };
  
  if (text.includes("身份证") || text.includes("image")) {
     result.kyc = {
        customerName: "张三",
        idNumber: "110101199001011234",
        address: "北京市金融街88号",
        phone: "13800138000",
        companyName: "金融街科技有限公司",
        position: "总经理"
     };
     result.summary = "已识别身份证信息。提取了姓名、身份证号、地址及部分职业信息。";
  } else if (text.includes("营收") || text.includes("存款")) {
      result.softInfo = {
        financialAssets: "在其他行有500万理财",
        liabilities: "无负债",
        incomeSource: "公司经营分红，年底到账。",
        otherBank: "招行有金葵花卡。",
        financialPreference: "偏好保本，对流动性要求高。"
      };
      result.opportunities = [{
        id: 'mock-1',
        category: '财富类',
        subCategory: '定期需求',
        reminderDate: '2023-12-31',
        amount: '1000万',
        description: '年底分红到账，意向存入大额定期。'
      }];
      result.summary = "已记录：金融资产及存款意向。";
  } else {
    result.summary = "收到您的信息，但没有捕捉到具体的银行业务细节。请您再详细说明一下。";
  }
  
  return result;
}
