from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .api.graphql.router import graphql_app
from .api.rest.router import router as api_router
from .core.config import get_settings
from .schemas import configure_schemas

configure_schemas()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(api_router)
    app.add_route("/graphql", graphql_app)

    @app.get("/health")
    async def health_check() -> dict[str, str]:
        return {"status": "ok"}

    return app


app = create_app()
