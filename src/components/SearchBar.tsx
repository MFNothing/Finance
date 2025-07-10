'use client';

import React, { useRef, useState, useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { TaiwanStockInfoItem } from '@/api/finance';
import _ from 'lodash';

export interface StockOption extends TaiwanStockInfoItem {
  label: string;
  value: string;
  group: string;
}

interface SearchBarProps {
  stockList: TaiwanStockInfoItem[];
  onChange?: (option: StockOption | null) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ stockList, onChange }) => {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // 转换为 Autocomplete 需要的格式
  const options = useMemo<StockOption[]>(
    () =>
      _(stockList).filter(item => item.type === 'twse').map(item => ({
        label: `${item.stock_id} ${item.stock_name}`,
        value: item.stock_id,
        group: '查询个股',
        ...item,
      })).value(),
    [stockList]
  );

  const filterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option: StockOption) =>
      `${option.stock_id} ${option.stock_name} ${option.industry_category}`,
  });

  // 匹配高亮
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <span style={{ color: '#1976d2', fontWeight: 600 }}>{text.slice(idx, idx + query.length)}</span>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <AppBar position="fixed" color="transparent" sx={{
      boxShadow: 'none',
      borderBottom: '1px solid #DFDFDF',
      backgroundColor: '#fff',
    }}>
      <Toolbar>
        <Box
          sx={{
            mx: 'auto',
            width: {
              xs: '100%',
              sm: 400,
              md: 500,
            },
            display: 'flex',
            alignItems: 'center',
            p: 0.5,
          }}
        >
          <Autocomplete<StockOption>
            freeSolo={false}
            options={options}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.label}
            filterOptions={filterOptions}
            inputValue={inputValue}
            onInputChange={(_, value) => setInputValue(value)}
            onChange={(_, value) => onChange?.(value)}
            popupIcon={null}
            clearIcon={null}
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                paddingRight: '6px !important',
              },
              backgroundColor: '#fafafa',
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                size="small"
                inputRef={inputRef}
                placeholder="輸入台／美股代號，查看公司價值"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon color="action" onClick={() => inputRef.current?.focus()} sx={{ cursor: 'pointer' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #dfdfdf',
                    boxShadow: '0 0 3px #e9e9e9 inset'
                  },
                  '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #dfdfdf'
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid #dfdfdf'
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: '#434343',
                    fontWeight: 700,
                    opacity: 1,
                  },
                  '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall .MuiAutocomplete-input': {
                    padding: '0.5px 0 0.5px 4px',
                  }
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={`${option.stock_id}-${option.industry_category}`}>
                {highlightMatch(option.label as string, inputValue)}
              </li>
            )}
            renderGroup={(params) => (
              <Box key={params.key}>
                <Typography variant="caption" color="text.secondary" sx={{ pl: 2, pt: 1 }}>
                  {params.group}
                </Typography>
                {params.children}
              </Box>
            )}
          />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default SearchBar; 