"use client";

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import CompanyTitleCard from "../components/CompanyTitleCard";
import RevenueDetailTableCard from "../components/RevenueDetailTableCard";
import SearchBar, { StockOption } from "@/components/SearchBar";
import React, { useEffect, useState, useMemo } from "react";
import {
  fetchTaiwanStockInfo,
  fetchTaiwanStockMonthRevenue,
  TaiwanStockInfoItem,
  TaiwanStockMonthRevenueItem,
} from "@/api/finance";
import dayjs from "dayjs";
import RevenueChartEchartsCard from "@/components/RevenueChartEchartsCard";
import { YearRangeType } from "@/types/finance";
import { getDisplayRange, filterDisplayData, calculateGrowthData } from "@/utils/dataProcessor";

export default function Home() {
  const [stockList, setStockList] = useState<TaiwanStockInfoItem[]>([]);
  const [selectedStock, setSelectedStock] = useState<StockOption | null>({
    label: "三商壽",
    value: "2867",
    group: "查询个股",
    industry_category: "金融保險",
    stock_id: "2867",
    stock_name: "三商壽",
    type: "twse",
    date: "2025-07-09",
  });
  const [revenueData, setRevenueData] = useState<TaiwanStockMonthRevenueItem[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [yearRange, setYearRange] = useState<{ type: YearRangeType, startYear?: number, endYear?: number }>({
    type: YearRangeType.FiveYear
  });

  // 处理显示数据
  const processedData = useMemo(() => {
    if (!revenueData?.length) return { displayData: [], growthData: [] };
    
    const { startYear, endYear } = getDisplayRange(
      yearRange.type,
      yearRange.startYear,
      yearRange.endYear
    );
    
    const { displayData, fullDataForGrowth } = filterDisplayData(revenueData, startYear, endYear);
    const growthData = calculateGrowthData(displayData, fullDataForGrowth);
    
    return { displayData, growthData };
  }, [revenueData, yearRange]);

  // 获取股票列表数据
  const fetchStockList = async () => {
    try {
      // 先尝试从 localStorage 读取
      const cached = localStorage.getItem("stockList");
      if (cached) {
        setStockList(JSON.parse(cached));
        return;
      }

      // 否则请求接口
      const res = await fetchTaiwanStockInfo();
      setStockList(res.data);
      localStorage.setItem("stockList", JSON.stringify(res.data));
    } catch (error) {
      console.error("获取股票列表失败:", error);
    }
  };

  // 根据年份区间计算日期范围
  const calculateDateRange = (range: { type: YearRangeType, startYear?: number, endYear?: number }) => {
    const endDate = dayjs().format("YYYY-MM-DD");
    let startDate: string;

    switch (range.type) {
      case YearRangeType.ThreeYear:
        startDate = dayjs().subtract(4, "year").format("YYYY-MM-DD"); // 多查一年
        break;
      case YearRangeType.FiveYear:
        startDate = dayjs().subtract(6, "year").format("YYYY-MM-DD"); // 多查一年
        break;
      case YearRangeType.EightYear:
        startDate = dayjs().subtract(9, "year").format("YYYY-MM-DD"); // 多查一年
        break;
      case YearRangeType.Custom:
        if (range.startYear && range.endYear) {
          startDate = `${range.startYear - 1}-01-01`; // 多查一年
          const customEndDate = `${range.endYear}-12-31`;
          return { startDate, endDate: customEndDate };
        }
        // 如果自定义参数不完整，默认使用5年
        startDate = dayjs().subtract(6, "year").format("YYYY-MM-DD");
        break;
      default:
        startDate = dayjs().subtract(6, "year").format("YYYY-MM-DD");
    }

    return { startDate, endDate };
  };

  // 获取营收数据
  const fetchRevenueData = async (stockId: string, range?: { type: YearRangeType, startYear?: number, endYear?: number }) => {
    try {
      setLoading(true);

      const currentRange = range || yearRange;
      const { startDate, endDate } = calculateDateRange(currentRange);

      const res = await fetchTaiwanStockMonthRevenue(
        stockId,
        startDate,
        endDate
      );
      setRevenueData(res.data);
    } catch (error) {
      console.error("获取营收数据失败:", error);
      setRevenueData([]);
    } finally {
      setLoading(false);
    }
  };

  // 处理年份区间变化
  const handleRangeChange = (range: { type: YearRangeType, startYear?: number, endYear?: number }) => {
    setYearRange(range);
    if (selectedStock?.stock_id) {
      fetchRevenueData(selectedStock.stock_id, range);
    }
  };

  // 初始化：获取股票列表
  useEffect(() => {
    fetchStockList();
  }, []);

  // 当选中股票变化时，获取对应的营收数据
  useEffect(() => {
    if (selectedStock?.stock_id) {
      fetchRevenueData(selectedStock.stock_id);
    }
  }, [selectedStock?.stock_id]);

  return (
    <>
      <SearchBar stockList={stockList} onChange={setSelectedStock} />
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          width: "100vw",
          height: "calc(100vh - 58px)",
          marginTop: "58px",
        }}
      >
        <Stack spacing={"18px"} sx={{ paddingTop: "18px" }}>
          <CompanyTitleCard
            companyName={selectedStock?.stock_name || ""}
            companyCode={selectedStock?.stock_id || ""}
          />
          <RevenueChartEchartsCard 
            revenueData={processedData.displayData}
            growthData={processedData.growthData}
            loading={loading} 
            onRangeChange={handleRangeChange}
          />
          <RevenueDetailTableCard 
            revenueData={processedData.displayData}
            growthData={processedData.growthData}
            loading={loading} 
          />
        </Stack>
      </Container>
    </>
  );
}
