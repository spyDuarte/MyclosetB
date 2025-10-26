# MyClosetB Frontend

Aplicação React construída com Vite e Chakra UI para gerenciamento de guarda-roupa.

## Configuração
1. Instale dependências:
   ```bash
   npm install
   ```
2. Defina a URL base do backend no arquivo `.env`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
3. Execute a aplicação:
   ```bash
   npm run dev
   ```

## Testes
```bash
npm test
```

## Scripts adicionais
- `npm run build` — gera build de produção.
- `npm run preview` — pré-visualiza build.
- `npm run lint` — executa ESLint.

## Estrutura principal
- `src/App.jsx` — rotas e layout geral.
- `src/pages/` — páginas de dashboard, cadastro de peça e criador de looks.
- `src/components/` — componentes reutilizáveis.
- `src/api/` — cliente Axios e hooks de dados.
- `src/theme/` — tema customizado Chakra UI.

## Acessibilidade e responsividade
- Layouts usam componentes responsivos (`Grid`, `Flex`, breakpoints Chakra).
- Componentes possuem `aria-label` e `aria-live` para leitores de tela.
- Tema garante contraste AA por padrão.
