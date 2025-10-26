# Backend

Este diretório contém o backend do MyClosetB construído com FastAPI, SQLAlchemy (async) e Strawberry GraphQL.

## Requisitos

- Python 3.11+
- Virtualenv ou ferramenta similar

Instale dependências:

```bash
pip install -r requirements.txt
```

## Configuração

As configurações padrão usam SQLite local (`mycloset.db`). Você pode sobrescrever via variáveis de ambiente:

- `DATABASE_URL` (ex.: `sqlite+aiosqlite:///./mycloset.db`)
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`

Crie o banco e aplique migrações Alembic:

```bash
alembic -c alembic.ini upgrade head
```

## Executando o servidor

```bash
uvicorn backend.app.main:app --reload
```

Rotas principais:

- REST: `http://localhost:8000/api/...`
- GraphQL (autenticado via header `Authorization: Bearer <token>`): `http://localhost:8000/graphql`
- Health check: `http://localhost:8000/health`

## Autenticação

O fluxo utiliza OAuth2 password grant com JWT:

1. Registre um usuário: `POST /api/auth/register`
2. Obtenha token: `POST /api/auth/token` (form data `username` e `password`)
3. Use o token Bearer nas demais requisições.

## Testes

Os testes unitários e de integração utilizam Pytest. Antes de executar, exporte `TEST_DATABASE_URL` (ou `DATABASE_URL`) para um banco separado (por exemplo, `sqlite+aiosqlite:///./test.db`). Em seguida rode:

```bash
pytest backend/tests -q
```

Um relatório de cobertura básico pode ser gerado com:

```bash
pytest backend/tests --cov=backend.app
```
