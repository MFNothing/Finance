import { get } from '@/utils/request';

export const FINMIND_API_URL = 'https://api.finmindtrade.com/api/v4/data';
const token = process.env.NEXT_PUBLIC_FINMIND_TOKEN as string;

// dataset 枚举
export enum Dataset {
  TaiwanStockInfo = 'TaiwanStockInfo',
  TaiwanStockMonthRevenue = 'TaiwanStockMonthRevenue'
}

// 通用查询参数类型
export interface FinMindQueryParams {
  dataset: Dataset;
  data_id?: string;
  start_date?: string;
  end_date?: string;
  // ...如有其他通用参数可补充
}

export interface FinMindApiResponse<T> {
  msg: string;
  status: number;
  data: T[];
}

export interface TaiwanStockInfoItem {
  industry_category: string;
  stock_id: string;
  stock_name: string;
  type: string;
  date: string; // 格式为 YYYY-MM-DD
}

export type TaiwanStockInfoResponse = FinMindApiResponse<TaiwanStockInfoItem>;

export interface TaiwanStockMonthRevenueItem {
  date: string;
  stock_id: string;
  country: string;
  revenue: number;
  revenue_month: number;
  revenue_year: number;
}

export type TaiwanStockMonthRevenueResponse = FinMindApiResponse<TaiwanStockMonthRevenueItem>;

const commonHeaders = {
  Authorization: `Bearer ${token}`,
}

export const fetchTaiwanStockInfo = () => {
  return get<TaiwanStockInfoResponse, FinMindQueryParams>(
    FINMIND_API_URL,
    {
      dataset: Dataset.TaiwanStockInfo,
    },
    {
      headers: commonHeaders,
    }
  );
};

export const fetchTaiwanStockMonthRevenue = (stockId: string, startDate: string, endDate: string) => {
  return get<TaiwanStockMonthRevenueResponse, FinMindQueryParams>(
    FINMIND_API_URL,
    {
      dataset: Dataset.TaiwanStockMonthRevenue,
      data_id: stockId,
      start_date: startDate,
      end_date: endDate,
    },
    {
      headers: commonHeaders,
    }
  );
}

