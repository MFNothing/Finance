import { TaiwanStockMonthRevenueItem } from "@/api/finance";
import { YearRangeType } from "@/types/finance";

// 根据年份区间计算显示范围
export const getDisplayRange = (
  selectedRange: YearRangeType,
  customStart?: number,
  customEnd?: number
) => {
  const currentYear = new Date().getFullYear();
  
  switch (selectedRange) {
    case YearRangeType.ThreeYear:
      return { startYear: currentYear - 3, endYear: currentYear };
    case YearRangeType.FiveYear:
      return { startYear: currentYear - 5, endYear: currentYear };
    case YearRangeType.EightYear:
      return { startYear: currentYear - 8, endYear: currentYear };
    case YearRangeType.Custom:
      return { startYear: customStart || currentYear - 5, endYear: customEnd || currentYear };
    default:
      return { startYear: currentYear - 5, endYear: currentYear };
  }
};

// 过滤显示数据
export const filterDisplayData = (
  revenueData: TaiwanStockMonthRevenueItem[],
  startYear: number,
  endYear: number
) => {
  const sortedData = [...revenueData].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  // 过滤显示数据（只显示用户选择区间内的数据）
  const displayData = sortedData.filter(item => 
    item.revenue_year >= startYear && item.revenue_year <= endYear
  );
  
  return { displayData, fullDataForGrowth: sortedData };
};

// 计算年增率
export const calculateGrowthData = (
  displayData: TaiwanStockMonthRevenueItem[],
  fullDataForGrowth: TaiwanStockMonthRevenueItem[]
) => {
  return displayData.map((item) => {
    const lastYearItem = fullDataForGrowth.find(
      (lastYear) =>
        lastYear.revenue_year === item.revenue_year - 1 &&
        lastYear.revenue_month === item.revenue_month
    );
    
    if (!lastYearItem || lastYearItem.revenue === 0) return 0;
    return ((item.revenue - lastYearItem.revenue) / lastYearItem.revenue) * 100;
  });
}; 