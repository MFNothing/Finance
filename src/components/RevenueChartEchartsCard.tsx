"use client";
import React, { useState, useEffect, useRef } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import ReactECharts from "echarts-for-react";
import _ from "lodash";
import { TaiwanStockMonthRevenueItem } from "@/api/finance";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import ArrowDropDownIcon from '@mui/icons-material/ExpandMore';
import { YearRangeType } from "@/types/finance";

interface RevenueChartEchartsCardProps {
  revenueData: TaiwanStockMonthRevenueItem[];
  growthData: number[];
  loading: boolean;
  onRangeChange?: (range: { type: YearRangeType, startYear?: number, endYear?: number }) => void;
}

const MENU_OPTIONS = [
  { label: '近 3 年', value: YearRangeType.ThreeYear },
  { label: '近 5 年', value: YearRangeType.FiveYear },
  { label: '近 8 年', value: YearRangeType.EightYear },
  { label: '自訂', value: YearRangeType.Custom }
];

const RevenueChartEchartsCard: React.FC<RevenueChartEchartsCardProps> = ({ 
  revenueData, 
  growthData, 
  loading, 
  onRangeChange 
}) => {
  // 年份下拉菜单相关状态
  const [selectedRange, setSelectedRange] = useState<YearRangeType>(YearRangeType.FiveYear);
  // 近30年年份数组
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  const [customStart, setCustomStart] = useState(years[years.length - 1] || 2020);
  const [customEnd, setCustomEnd] = useState(years[0] || 2025);
  const [popoverAnchor, setPopoverAnchor] = useState<null | HTMLElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 处理点击外部关闭弹窗
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current) {
        const target = event.target as HTMLElement;
        
        // 检查点击的目标是否在弹窗内部
        const isClickInside = popoverRef.current.contains(target);
        
        // 检查是否点击的是 Select 下拉菜单
        const isSelectMenu = target.closest('.MuiPopover-root') || target.closest('.MuiMenu-root');
        
        // 如果点击不在弹窗内部且不是 Select 下拉菜单，则关闭弹窗
        if (!isClickInside && !isSelectMenu) {
          setPopoverAnchor(null);
        }
      }
    };

    // 添加全局点击监听器
    document.addEventListener('mousedown', handleClickOutside);
    
    // 清理监听器
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [popoverAnchor]);

  const xLabels = revenueData.map(item => `${item.revenue_year}${item.revenue_month.toString().padStart(2, '0')}`);
  const revenueDataArray = revenueData.map(item => item.revenue / 1000); // 千元

  const option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'transparent',
      borderWidth: 0,
      extraCssText: 'box-shadow:none;',
      textStyle: {
        color: '#fff',
        fontWeight: 'bold'
      },
      formatter: (params: Array<{ axisValueLabel: string; seriesName: string; data: number; color: string }>) => {
        const date = params[0].axisValueLabel;
        const dateStr = date.length === 6 ? `${date.slice(0, 4)}/${date.slice(4)}` : date;
        // 外层相对定位
        let str = `<div style="position:relative;min-width:120px;">`;
        // 绝对定位的背景
        str += `<div style="position:absolute;z-index:1;left:0;top:0;width:100%;height:100%;background:rgba(0,0,0,0.85);border-radius:6px;"></div>`;
        // 内容层
        str += `<div style="position:relative;z-index:2;padding:8px 16px;">`;
        str += `<div style="font-weight:bold; font-size:12px;">${dateStr}</div>`;
        params.forEach((item: { seriesName: string; data: number; color: string }) => {
          const marker = `<span style="display:inline-block;margin-right:4px;border-radius:50%;width:10px;height:10px;background:${item.color};"></span>`;
          if (item.seriesName === '每月營收') {
            str += `<div style="font-size:14px;">${marker}<span style="font-weight:bold;">每月營收</span> <span style="font-weight:bold;">${item.data.toLocaleString()}</span> 千元</div>`;
          } else {
            str += `<div style="font-size:14px;">${marker}<span style="font-weight:bold;">單月營收年增率 (%)</span> <span style="font-weight:bold;">${item.data.toFixed(2)}</span>%</div>`;
          }
        });
        str += `</div></div>`;
        return str;
      }
    },
    legend: {
      data: [{
        name: '每月營收',
        icon: 'rect',
        itemStyle: {
          color: 'rgb(232, 175, 0)'
        },
      }, {
        name: '單月營收年增率 (%)',
        icon: 'rect',
      }],
      left: '100',
      top: '20'
    },
    xAxis: [
      {
        type: 'category',
        data: xLabels,
        axisTick: { show: false },
        axisLine: { show: false },
        splitLine: {
          show: false,
        },
        axisLabel: {
          formatter: function (value: string, index: number) {
            // 每隔12个点显示一次年份
            if (index % 12 === 0) {
              return value.slice(0, 4);
            }
            return '';
          },
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '千元',
        nameLocation: 'end',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 13,
          padding: [0, 0, 20, -24]
        },
        position: 'left',
        min: Math.min(0, _.min(revenueDataArray) || 0),
        axisLabel: {
          formatter: (value: number) => value.toLocaleString()
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#e0e0e0',
            width: 1
          }
        }
      },
      {
        type: 'value',
        name: '%',
        nameLocation: 'end',
        nameTextStyle: {
          fontWeight: 'bold',
          fontSize: 13,
          padding: [0, 0, 20, 24]
        },
        position: 'right',
        min: Math.min(0, _.min(growthData) || 0),
        axisLabel: {
          formatter: (value: number) => value.toFixed(2)
        },
        splitLine: {
          show: false,
        }
      }
    ],
    series: [
      {
        name: '每月營收',
        type: 'bar',
        data: revenueDataArray,
        yAxisIndex: 0,
        itemStyle: {
          color: 'rgba(232, 175, 0, 0.4)',
          borderColor: 'rgb(232, 175, 0)',
          borderWidth: 1,
        },
        emphasis: {
          disabled: true
        },
      },
      {
        name: '單月營收年增率 (%)',
        type: 'line',
        data: growthData,
        yAxisIndex: 1,
        itemStyle: {
          color: '#CB4B4B',
        },
        lineStyle: {
          width: 2.5,
        },
        smooth: false,
        showSymbol: false,
        symbolSize: 8,
        emphasis: {
          symbolSize: 12
        },
      },
    ],
    grid: {
      left: 80,
      right: 60,
      bottom: 60,
      top: 60,
    },
  };

  const handleCustomConfirm = () => {
    setSelectedRange(YearRangeType.Custom);
    onRangeChange?.({ type: YearRangeType.Custom, startYear: customStart, endYear: customEnd });
    setPopoverAnchor(null); // 关闭弹窗
  };

  // 处理开始年份变化
  const handleStartYearChange = (year: number) => {
    setCustomStart(year);
    // 如果开始年份晚于结束年份，自动调整结束年份
    if (year > customEnd) {
      setCustomEnd(year);
    }
  };

  // 处理结束年份变化
  const handleEndYearChange = (year: number) => {
    setCustomEnd(year);
    // 如果结束年份早于开始年份，自动调整开始年份
    if (year < customStart) {
      setCustomStart(year);
    }
  };

  const currentLabel = MENU_OPTIONS.find(opt => opt.value === selectedRange)?.label || '选择区间';

  return (
    <Paper sx={{ p: 2 }} variant="outlined">
      {/* 顶部栏 */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        position="relative"
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
        {/* 下拉菜单按钮 */}
        <PopupState variant="popover" popupId="demo-popup-menu">
          {(popupState) => (
            <>
              <Button
                variant="contained"
                color="primary"
                {...bindTrigger(popupState)}
                endIcon={
                  <ArrowDropDownIcon
                    style={{
                      transition: 'transform 0.2s',
                      transform: popupState.isOpen ? 'rotate(180deg)' : 'none'
                    }}
                  />
                }
              >
                {currentLabel}
              </Button>
              <Menu
                {...bindMenu(popupState)}
                PaperProps={{
                  sx: {
                    bgcolor: '#676767', // 深灰背景
                    minWidth: 100,      // 你可以根据实际调整
                    boxShadow: 'none',
                    mt: 1,
                    borderRadius: 1
                  }
                }}
                MenuListProps={{
                  sx: {
                    p: 0
                  }
                }}
              >
                {MENU_OPTIONS.map(opt => (
                  <MenuItem
                    key={opt.value}
                    onClick={e => {
                      if (opt.value === YearRangeType.Custom) {
                        setPopoverAnchor(e.currentTarget);
                      } else {
                        setSelectedRange(opt.value);
                        onRangeChange?.({ type: opt.value });
                      }
                      popupState.close();
                    }}
                    sx={{
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: 13,
                      bgcolor: selectedRange === opt.value ? '#757575' : 'transparent',
                      '&:hover': {
                        bgcolor: '#757575'
                      },
                      padding: '9px 12px'
                    }}
                    selected={selectedRange === opt.value}
                  >
                    {opt.label}
                  </MenuItem>
                ))}
              </Menu>
            </>
          )}
        </PopupState>
        
        {/* 自订弹窗 - 使用绝对定位 */}
        {popoverAnchor && (
          <Box
            ref={popoverRef}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 1000,
              bgcolor: '#393939',
              color: '#fff',
              borderRadius: 2,
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
              minWidth: 160,
              p: 2,
            }}
          >
            <Box display="flex" flexDirection="column" gap={1}>
              <Box display="flex" alignItems="center">
                <Typography sx={{ minWidth: 72, color: '#fff', fontSize: 15 }}>
                  起始年度：
                </Typography>
                <Select
                  value={customStart}
                  onChange={e => handleStartYearChange(Number(e.target.value))}
                  sx={{
                    color: '#fff',
                    bgcolor: '#393939',
                    border: '1px solid #fff',
                    minWidth: 80,
                    ml: 1,
                    '.MuiSelect-icon': { color: '#fff' },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  }}
                  size="small"
                  MenuProps={{
                    PaperProps: { sx: { bgcolor: '#393939', color: '#fff' } }
                  }}
                >
                  {years.map(y => (
                    <MenuItem 
                      key={y} 
                      value={y} 
                      sx={{ 
                        color: y > customEnd ? '#666' : '#fff',
                        opacity: y > customEnd ? 0.5 : 1
                      }}
                      disabled={y > customEnd}
                    >
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box display="flex" alignItems="center">
                <Typography sx={{ minWidth: 72, color: '#fff', fontSize: 15 }}>
                  结束年度：
                </Typography>
                <Select
                  value={customEnd}
                  onChange={e => handleEndYearChange(Number(e.target.value))}
                  sx={{
                    color: '#fff',
                    bgcolor: '#393939',
                    border: '1px solid #fff',
                    minWidth: 80,
                    ml: 1,
                    '.MuiSelect-icon': { color: '#fff' },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none'
                    }
                  }}
                  size="small"
                  MenuProps={{
                    PaperProps: { sx: { bgcolor: '#393939', color: '#fff' } }
                  }}
                >
                  {years.map(y => (
                    <MenuItem 
                      key={y} 
                      value={y} 
                      sx={{ 
                        color: y < customStart ? '#666' : '#fff',
                        opacity: y < customStart ? 0.5 : 1
                      }}
                      disabled={y < customStart}
                    >
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </Box>
              <Box display="flex" justifyContent="center" mt={2}>
                <Button
                  onClick={handleCustomConfirm}
                  variant="contained"
                  sx={{
                    bgcolor: '#fff',
                    color: '#0386F4',
                    fontWeight: 700,
                    borderRadius: 1,
                    minWidth: 120,
                  }}
                >
                  确定
                </Button>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
      {/* 图表占位 */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        sx={{
          height: 420,
          width: '100%',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <ReactECharts option={option} style={{ height: 420, width: '100%' }} opts={{ renderer: 'canvas', devicePixelRatio: 3 }} />
        )}
      </Box>
    </Paper>
  );
};

export default RevenueChartEchartsCard; 