import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import App from '../App.jsx';
import theme from '../theme/index.js';

vi.mock('../api/hooks.js', () => ({
  useDashboardData: () => ({
    data: {
      totals: { items: 12, clean: 9, laundry: 3, looksCreated: 4, looksShared: 1 },
      suggestions: {
        today: { title: 'Reunião', description: 'Use o blazer azul com a calça preta.' },
        weather: { summary: 'Temperatura amena, sugerimos camadas leves.' }
      },
      alerts: { laundry: 2 },
      events: [
        { id: 1, title: 'Almoço de negócios', date: new Date().toISOString(), suggestedLook: 'Blazer azul' }
      ]
    },
    loading: false,
    error: null
  }),
  useItems: () => ({
    data: [
      { id: 1, name: 'Blazer azul' },
      { id: 2, name: 'Calça preta' }
    ],
    loading: false,
    error: null,
    reload: vi.fn()
  })
}));

vi.mock('../api/client.js', () => ({
  createItem: vi.fn(() => Promise.resolve({ id: 99 })),
  createLook: vi.fn(() => Promise.resolve({ id: 123 }))
}));

function renderApp(initialEntries = ['/dashboard']) {
  render(
    <ChakraProvider theme={theme}>
      <MemoryRouter initialEntries={initialEntries}>
        <App />
      </MemoryRouter>
    </ChakraProvider>
  );
}

describe('App routing', () => {
  it('renders dashboard with insights', async () => {
    renderApp();
    expect(await screen.findByText(/Olá, bem-vinda de volta/i)).toBeInTheDocument();
    expect(screen.getByText(/Peças no guarda-roupa/i)).toBeInTheDocument();
  });

  it('navigates to look builder', async () => {
    renderApp(['/looks/new']);
    expect(screen.getByText(/Criar novo look/i)).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText(/Guarda-roupa/i)).toBeInTheDocument());
  });
});
