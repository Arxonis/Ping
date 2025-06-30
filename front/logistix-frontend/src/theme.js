import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0d6efd', light: '#d3e6ff', dark: '#084bcc' },
    background: { default: '#f5f7fb' },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
});

export default theme;