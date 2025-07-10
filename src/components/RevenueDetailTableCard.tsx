"use client";
import React, { useRef, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { TaiwanStockMonthRevenueItem } from "@/api/finance";
import Typography from "@mui/material/Typography";

interface RevenueDetailTableCardProps {
  revenueData: TaiwanStockMonthRevenueItem[];
  growthData: number[];
  loading: boolean;
}

const RevenueDetailTableCard: React.FC<RevenueDetailTableCardProps> = ({
  revenueData,
  growthData,
  loading,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // 处理数据：添加年增率和月份标签
  const dataWithGrowth = revenueData.map((item, index) => ({
    ...item,
    growth: growthData[index] || 0,
    monthLabel: `${item.revenue_year}${item.revenue_month
      .toString()
      .padStart(2, "0")}`,
  }));

  useEffect(() => {
    if (scrollRef.current) {
      setTimeout(() => {
        scrollRef.current!.scrollLeft = scrollRef.current!.scrollWidth;
      }, 200);
    }
  }, [dataWithGrowth]);

  return (
    <Paper sx={{ py: 2 }} variant="outlined">
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2, ml: 2, fontWeight: 700, fontSize: 16 }}
      >
        详细数据
      </Button>
      <Box sx={{ width: "100%" }}>
        <TableContainer sx={{ width: "100%", overflowX: "auto", }} ref={scrollRef}>
          <Table size="small" sx={{ minWidth: 700 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#f6f8fa",
                    fontWeight: 700,
                    minWidth: 156,
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    borderLeft: "none",
                    "&:before": {
                      backgroundColor: "#fff",
                      content: '""',
                      position: "absolute",
                      top: "-1px",
                      bottom: "-1px",
                      width: "4px",
                      right: "-4px",
                      borderLeft: "1px solid #e3e3e3",
                    },
                  }}
                >
                  年度月份
                </TableCell>
                {dataWithGrowth.map((item) => (
                  <TableCell
                    key={item.monthLabel}
                    align="center"
                    sx={{
                      bgcolor: "#f6f8fa",
                      fontWeight: 700,
                    }}
                  >
                    {item.monthLabel}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#fff",
                    fontWeight: 700,
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    borderLeft: "none",
                    "&:before": {
                      backgroundColor: "#fff",
                      content: '""',
                      position: "absolute",
                      top: "-1px",
                      bottom: "-1px",
                      width: "4px",
                      right: "-4px",
                      borderLeft: "1px solid #e3e3e3",
                    },
                  }}
                >
                  每月营收
                </TableCell>
                {dataWithGrowth.map((item) => (
                  <TableCell key={item.monthLabel} align="center">
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      (item.revenue / 1000).toLocaleString()
                    )}
                  </TableCell>
                ))}
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{
                    bgcolor: "#f6f8fa",
                    fontWeight: 700,
                    position: "sticky",
                    left: 0,
                    zIndex: 2,
                    borderLeft: "none",
                    "&:before": {
                      backgroundColor: "#fff",
                      content: '""',
                      position: "absolute",
                      top: "-1px",
                      bottom: "-1px",
                      width: "4px",
                      right: "-4px",
                      borderLeft: "1px solid #e3e3e3",
                    },
                  }}
                >
                  单月营收年增率 (%)
                </TableCell>
                {dataWithGrowth.map((item) => (
                  <TableCell key={item.monthLabel} align="center">
                    {loading ? (
                      <CircularProgress size={20} />
                    ) : (
                      Number(item.growth).toFixed(2)
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* 右下角声明 */}
      <Box sx={{ mt: 2, textAlign: "right", mr: 2 }}>
        <Typography
          variant="subtitle2"
          color="text.primary"
          sx={{ fontSize: 13 }}
        >
          表格單位：千元，數據來自公開資訊觀測站
        </Typography>
        <Typography
          variant="subtitle2"
          color="text.primary"
          sx={{ fontSize: 13 }}
        >
          網頁圖表歡迎轉貼引用，請註明出處為財報狗
        </Typography>
      </Box>
    </Paper>
  );
};

export default RevenueDetailTableCard;
