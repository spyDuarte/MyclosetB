import { extendTheme } from '@chakra-ui/react';

const colors = {
  brand: {
    50: '#e7f9f7',
    100: '#c2ebe4',
    200: '#9bdcd2',
    300: '#73cdc1',
    400: '#4cbfad',
    500: '#32a593',
    600: '#247f72',
    700: '#165951',
    800: '#073330',
    900: '#00120f'
  }
};

const fonts = {
  heading: 'Poppins, system-ui, sans-serif',
  body: 'Inter, system-ui, sans-serif'
};

const components = {
  Button: {
    baseStyle: {
      borderRadius: 'full',
      fontWeight: '600'
    },
    defaultProps: {
      colorScheme: 'brand'
    }
  },
  Heading: {
    baseStyle: {
      color: 'brand.700'
    }
  }
};

const styles = {
  global: {
    body: {
      bg: 'gray.50',
      color: 'gray.800'
    },
    '*::placeholder': {
      color: 'gray.400'
    }
  }
};

const config = {
  initialColorMode: 'light',
  useSystemColorMode: false
};

const theme = extendTheme({ colors, components, config, fonts, styles });

export default theme;
