import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0386F4',
    },
    // secondary: {
    //   main: '#dc004e',
    // },
    text: {
      primary: '#434343',
      secondary: '#939393',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 58,
          '@media (min-width:600px)': {
            minHeight: 58,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        outlined: {
          border: '1px solid rgba(223, 223, 223, 1)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          border: '1px solid #E9E9E9',
          padding: '12px 18px',
          height: 48,
          fontSize: 13,
          color: '#434343'
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:nth-of-type(even)': {
            backgroundColor: '#f6f8fa',
          },
        },
      },
    },
  },
});

export default theme;
