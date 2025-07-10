"use client";
import React from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  ChartContainer,
  BarPlot,
  LinePlot,
  ChartsXAxis,
  ChartsYAxis,
  ChartsLegend,
  ChartsTooltip,
  ChartsGrid,
} from "@mui/x-charts";
import _ from "lodash";
import { TaiwanStockMonthRevenueItem } from "@/api/finance";

interface RevenueChartCardProps {
  revenueData: TaiwanStockMonthRevenueItem[];
  loading: boolean;
}

const RevenueChartCard: React.FC<RevenueChartCardProps> = ({ revenueData, loading }) => {
  // 处理数据：按日期排序并计算年增率
  const sortedData = [...revenueData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const xLabels = sortedData.map(item => `${item.revenue_year}${item.revenue_month.toString().padStart(2, '0')}`);
  const revenueDataArray = sortedData.map(item => item.revenue);
  
  // 计算年增率（与去年同期比较）
  const growthData = sortedData.map((item) => {
    // 查找去年同期的数据
    const lastYearItem = sortedData.find(
      lastYear => 
        lastYear.revenue_year === item.revenue_year - 1 && 
        lastYear.revenue_month === item.revenue_month
    );
    
    if (!lastYearItem || lastYearItem.revenue === 0) return 0;
    return ((item.revenue - lastYearItem.revenue) / lastYearItem.revenue) * 100;
  });
  
  const minGrowthData = _.min(growthData) || 0;
  const minRevenueData = _.min(revenueDataArray) || 0;

  return (
    <Paper sx={{ p: 2 }} variant="outlined">
      {/* 顶部栏 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            fontWeight: 700,
            fontSize: 16,
            px: 2,
          }}
        >
          每月营收
        </Button>
        <Button
          variant="contained"
          color="primary"
          sx={{
            fontWeight: 700,
            fontSize: 16,
            px: 2,
          }}
        >
          近5年
        </Button>
      </Box>
      {/* 图表占位 */}
      <Box
        height={467}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <ChartContainer
            series={[
              {
                type: "bar",
                data: revenueDataArray,
                label: "每月營收",
                color: "#E8AF00",
                yAxisId: "left",
              },
              {
                type: "line",
                data: growthData,
                label: "單月營收年增率 (%)",
                color: "#CB4B4B",
                yAxisId: "right",
                curve: 'linear',
              },
            ]}
            xAxis={[{ data: xLabels, scaleType: "band", id: "x" }]}
            yAxis={[
              {
                id: "left",
                min: minRevenueData > 0 ? 0 : minRevenueData,
                width: 80,
              },
              {
                id: "right",
                min: minGrowthData > 0 ? 0 : minGrowthData,
                position: "right",
              },
            ]}
          >
            <BarPlot
              slotProps={{
                bar: {
                  style: {
                    stroke: "rgb(232, 175, 0)",
                    strokeWidth: 1,
                    fill: "rgba(232, 175, 0, 0.4)",
                  },
                  className: "revenue-bar",
                },
              }}
            />
            <LinePlot
              slotProps={{
                line: {
                  style: {
                    stroke: "rgb(203, 75, 75)",
                    strokeWidth: 2.5,
                  },
                },
              }}
            />
            <ChartsXAxis axisId="x" disableLine disableTicks/>
            <ChartsYAxis axisId="left" disableLine disableTicks/>
            <ChartsYAxis axisId="right" disableLine disableTicks/>
            <ChartsGrid vertical={false} horizontal={true} />
            <ChartsLegend />
            <ChartsTooltip />
          </ChartContainer>
        )}
      </Box>
    </Paper>
  );
};

export default RevenueChartCard;
