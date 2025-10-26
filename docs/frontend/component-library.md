# Biblioteca de Componentes e Tema

Este documento descreve como utilizar a biblioteca de componentes adotada no frontend do MyClosetB.

## Stack
- [Chakra UI](https://chakra-ui.com/) para componentes acessíveis e responsivos.
- Tema customizado em `frontend/src/theme/index.js` define paleta `brand`, fontes e estilos globais.
- Rotas definidas em `frontend/src/App.jsx` com React Router 6.

## Como usar
1. Instale dependências (`npm install`) no diretório `frontend/`.
2. Execute `npm run dev` para iniciar o servidor Vite com hot reload.
3. Componentes principais:
   - `AppLayout`: estrutura com `Header` e `Sidebar` responsivos.
   - `InsightCards`: cartões estatísticos do dashboard.
   - `ItemForm`: formulário reutilizável para cadastro de peças.
   - `LookCanvas`: grid interativo para montagem de looks.

## Acessibilidade
- Todos os botões possuem `aria-label` quando necessário.
- Uso de componentes Chakra garante contraste mínimo e navegação por teclado.
- Seções dinâmicas usam `aria-live="polite"` para anúncios não intrusivos.

## Testes
- Testes unitários com React Testing Library e Vitest (`npm test`).
- Exemplos em `frontend/src/__tests__/` demonstram como mockar hooks de dados.

## Boas práticas
- Preferir componentes Chakra para garantir consistência visual.
- Utilizar tokens do tema (`colorScheme="brand"`, espaçamentos, fontes) ao criar novos componentes.
- Adicionar stories ou exemplos adicionais aqui conforme novos componentes surgirem.
