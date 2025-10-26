import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ItemForm from '../components/wardrobe/ItemForm.jsx';
import theme from '../theme/index.js';

describe('ItemForm', () => {
  const renderForm = (props = {}) =>
    render(
      <ChakraProvider theme={theme}>
        <ItemForm onSubmit={props.onSubmit ?? vi.fn()} isSubmitting={props.isSubmitting} />
      </ChakraProvider>
    );

  it('validates required fields', () => {
    const onSubmit = vi.fn();
    renderForm({ onSubmit });

    fireEvent.click(screen.getByRole('button', { name: /salvar peça/i }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByText(/Informe o nome da peça/i)).toBeInTheDocument();
  });

  it('submits when required fields are filled', () => {
    const onSubmit = vi.fn();
    renderForm({ onSubmit });

    fireEvent.change(screen.getByLabelText(/Nome/i), { target: { value: 'Camisa branca' } });
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: 'Tops' } });
    fireEvent.change(screen.getByLabelText(/Subcategoria/i), { target: { value: 'Camiseta' } });

    fireEvent.click(screen.getByRole('button', { name: /salvar peça/i }));
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Camisa branca', category: 'Tops', subcategory: 'Camiseta' })
    );
  });
});
